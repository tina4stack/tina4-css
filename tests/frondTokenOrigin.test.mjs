/**
 * Frond browser-helper tests — GHSA-q2gc-fpw5-3v3c
 * (frond.js sent the signed-in bearer token to other origins and accepted a
 *  replacement token from them).
 *
 * NO MOCKS: the built bundle runs inside a real jsdom DOM whose origin is the
 * "app" server, and drives real XMLHttpRequest round-trips against TWO real
 * Node http servers on localhost — one on the app's own origin, one on a
 * DIFFERENT port (a different origin, standing in for a cooperative attacker
 * site that allows Authorization and exposes FreshToken). Each server records
 * exactly what reached it, so the assertions are about bytes on the wire, not
 * about a stubbed call.
 *
 * The security contract (ADR: same-origin token boundary):
 *   - the managed bearer is attached ONLY to same-origin requests;
 *   - a FreshToken is accepted ONLY from a same-origin response;
 *   - form.collect never writes the bearer into a `formToken` field — the field
 *     travels as the server rendered it;
 *   - an explicit Authorization header in options.headers still goes wherever
 *     the caller sends it (the deliberate escape hatch).
 *
 * The same suite runs against dist/frond.js AND dist/frond.min.js.
 */

import { test, before, after, beforeEach, describe } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));

// A permissive CORS server that records every request it receives. "Permissive"
// models a cooperative foreign origin: a real attacker site WOULD allow the
// Authorization header and expose FreshToken, so if frond leaks the token this
// server captures it.
function makeServer(name) {
  const received = [];
  let waiters = [];
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Expose-Headers": "FreshToken",
  };
  const server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, cors);
      res.end();
      return;
    }
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      // Pull a multipart formToken value out of the raw body, if present.
      let formToken;
      const m = /name="formToken"\r?\n\r?\n([^\r\n]*)/.exec(raw);
      if (m) formToken = m[1];
      const rec = {
        server: name,
        path: req.url,
        method: req.method,
        auth: req.headers["authorization"] || null,
        body: raw,
        formToken,
      };
      received.push(rec);
      const fire = waiters;
      waiters = [];
      for (const w of fire) w(rec);

      // /rotate issues a FreshToken for THIS server's origin. GraphQL wants a
      // JSON envelope; the HTML-injecting helpers (load/post/form) want markup.
      const isGql = req.url.indexOf("/gql") !== -1;
      const headers = {
        "Content-Type": isGql ? "application/json" : "text/html",
        ...cors,
      };
      if (req.url.indexOf("/rotate") !== -1) headers.FreshToken = name + "-FRESH";
      res.writeHead(200, headers);
      res.end(isGql ? JSON.stringify({ data: { ping: 1 } }) : "<div>ok " + name + "</div>");
    });
  });
  return {
    name,
    received,
    server,
    // Resolves with the next request record this server receives.
    nextHit: () => new Promise((r) => waiters.push(r)),
    listen: () =>
      new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${server.address().port}`));
      }),
  };
}

// A watchdog so a request that never fires a callback (e.g. a CORS-blocked
// read) still fails loudly instead of hanging the run.
function withWatchdog(promise, ms = 5000, label = "request") {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`watchdog: ${label} never arrived in ${ms}ms`)), ms)),
  ]);
}

for (const bundle of ["frond.js", "frond.min.js"]) {
  describe(`same-origin token boundary (${bundle})`, () => {
    const source = readFileSync(join(here, "..", "dist", bundle), "utf8");
    let app, other, appBase, otherBase, dom, frond;

    before(async () => {
      app = makeServer("app");
      other = makeServer("other");
      appBase = await app.listen();
      otherBase = await other.listen();

      dom = new JSDOM(
        `<!DOCTYPE html><html><body>
           <div id="content"></div>
           <div id="message"></div>
           <form id="tokenForm">
             <input name="username" value="bob">
             <input type="hidden" name="formToken" value="RENDERED">
           </form>
         </body></html>`,
        { url: appBase + "/", runScripts: "dangerously", resources: "usable" },
      );
      const scriptEl = dom.window.document.createElement("script");
      scriptEl.textContent = source;
      dom.window.document.body.appendChild(scriptEl);
      frond = dom.window.frond;
      assert.ok(frond, "window.frond should be registered after loading " + bundle);
    });

    after(() => {
      if (dom) dom.window.close();
      for (const s of [app, other]) {
        if (s && s.server) {
          s.server.closeAllConnections();
          s.server.close();
        }
      }
    });

    beforeEach(() => {
      // Fresh managed token, and a form field re-rendered to its server value,
      // before every case (a pre-fix collect() would have overwritten it).
      frond.token = "SECRET";
      dom.window.document.querySelector('#tokenForm input[name="formToken"]').value = "RENDERED";
    });

    // ── same-origin positive controls ────────────────────────────────────────

    test("same-origin request carries the managed bearer", async () => {
      frond.load(appBase + "/api", "content");
      const hit = await withWatchdog(app.nextHit(), 5000, "app /api");
      assert.equal(hit.auth, "Bearer SECRET");
    });

    test("same-origin FreshToken rotates the managed token", async () => {
      frond.token = "OLD";
      frond.load(appBase + "/rotate", "content");
      await withWatchdog(app.nextHit(), 5000, "app /rotate");
      // Let onload run after the socket is seen.
      await new Promise((r) => setTimeout(r, 50));
      assert.equal(frond.token, "app-FRESH");
    });

    // ── the leak: the bearer must NOT reach another origin ───────────────────

    test("cross-origin load does NOT send the bearer", async () => {
      frond.load(otherBase + "/api", "content");
      const hit = await withWatchdog(other.nextHit(), 5000, "other /api");
      assert.equal(hit.auth, null, "the signed-in token must not reach another origin");
    });

    test("cross-origin post does NOT send the bearer", async () => {
      frond.post(otherBase + "/api", { x: 1 }, "content");
      const hit = await withWatchdog(other.nextHit(), 5000, "other /api post");
      assert.equal(hit.auth, null);
    });

    test("cross-origin graphql does NOT send the bearer", async () => {
      frond.graphql(otherBase + "/gql", "{ ping }");
      const hit = await withWatchdog(other.nextHit(), 5000, "other /gql");
      assert.equal(hit.auth, null);
    });

    // ── token replacement: a foreign FreshToken must be ignored ──────────────

    test("cross-origin FreshToken does NOT replace the managed token", async () => {
      frond.token = "KEEP";
      frond.load(otherBase + "/rotate", "content");
      await withWatchdog(other.nextHit(), 5000, "other /rotate");
      await new Promise((r) => setTimeout(r, 50));
      assert.equal(frond.token, "KEEP", "a foreign origin must not rotate the user's token");
    });

    // ── formToken: the bearer must never ride in the formToken slot ──────────

    test("form.collect leaves formToken as the server rendered it", () => {
      const fd = frond.form.collect("tokenForm");
      assert.equal(fd.get("formToken"), "RENDERED", "the bearer must not be written into formToken");
    });

    test("same-origin form.submit sends the rendered formToken (bearer only in header)", async () => {
      frond.form.submit("tokenForm", appBase + "/form", "message");
      const hit = await withWatchdog(app.nextHit(), 5000, "app /form");
      assert.equal(hit.formToken, "RENDERED", "formToken body must be the rendered value, not the bearer");
      assert.equal(hit.auth, "Bearer SECRET", "same-origin keeps the bearer in the header");
    });

    test("cross-origin form.submit leaks neither the bearer header nor the token in formToken", async () => {
      frond.form.submit("tokenForm", otherBase + "/form", "message");
      const hit = await withWatchdog(other.nextHit(), 5000, "other /form");
      assert.equal(hit.auth, null, "no bearer header to another origin");
      assert.notEqual(hit.formToken, "SECRET", "the token must not be posted in the formToken field");
      assert.equal(hit.formToken, "RENDERED");
    });

    // ── the escape hatch: an explicit header still goes anywhere ─────────────

    test("an explicit Authorization header still reaches another origin", async () => {
      frond.request(otherBase + "/api", { headers: { Authorization: "Bearer EXPLICIT" } });
      const hit = await withWatchdog(other.nextHit(), 5000, "other /api explicit");
      assert.equal(hit.auth, "Bearer EXPLICIT", "a caller-supplied header is honoured cross-origin");
    });
  });
}
