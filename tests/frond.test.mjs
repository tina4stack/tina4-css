/**
 * Frond browser-helper tests — issue #130 (onError forwarding + request timeout).
 *
 * NO MOCKS: the built dist/frond.js runs inside a real jsdom DOM and drives
 * real XMLHttpRequest round-trips against a real Node http server on localhost.
 * jsdom's XHR against a real localhost socket is a real dependency, not a mock.
 *
 * Covers:
 *   - a 401 response routes to onError (status 401), never onSuccess/callback,
 *     through post / load / form.submit
 *   - a hung socket + short opts.timeout routes ontimeout -> onError (status 0)
 *     within the budget instead of stranding
 *   - a 200 response still fires onSuccess/callback (no regression)
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));
const frondSource = readFileSync(join(here, "..", "dist", "frond.js"), "utf8");

let server;
let base;
let dom;
let frond;

before(async () => {
  // Real HTTP server. /hang never responds so the XHR must time out.
  server = http.createServer((req, res) => {
    if (req.url === "/hang") return; // deliberately never respond

    if (req.url === "/unauthorized") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "nope" }));
      return;
    }

    if (req.url === "/ok") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "<div>hello</div>" }));
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;

  // Load the built frond.js inside a jsdom window whose origin matches the
  // server, so same-origin XHR is allowed. runScripts executes the IIFE, which
  // registers window.frond.
  dom = new JSDOM(
    `<!DOCTYPE html><html><body>
       <div id="content"></div>
       <div id="message"></div>
       <form id="loginForm"><input name="username" value="bob"></form>
     </body></html>`,
    { url: base + "/", runScripts: "dangerously", resources: "usable" },
  );

  const scriptEl = dom.window.document.createElement("script");
  scriptEl.textContent = frondSource;
  dom.window.document.body.appendChild(scriptEl);

  frond = dom.window.frond;
  assert.ok(frond, "window.frond should be registered after loading frond.js");
});

after(() => {
  if (dom) dom.window.close();
  if (server) {
    server.closeAllConnections();
    server.close();
  }
});

/** Run `body`, resolving with the outcome, failing the test on a watchdog timeout. */
function drive(body, watchdogMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("watchdog: callback never fired within " + watchdogMs + "ms")),
      watchdogMs,
    );
    const done = (outcome) => {
      clearTimeout(timer);
      resolve(outcome);
    };
    body(done);
  });
}

test("post: a 401 routes to onError (status 401), never onSuccess", async () => {
  let successFired = false;
  const outcome = await drive((done) => {
    frond.post(
      base + "/unauthorized",
      { user: "bob" },
      "content",
      () => { successFired = true; },
      (status, xhr) => done({ status, xhr }),
    );
  });
  assert.equal(outcome.status, 401, "onError should receive HTTP 401");
  assert.ok(outcome.xhr, "onError should receive the xhr");
  assert.equal(successFired, false, "success callback must NOT fire on a 401");
});

test("load: a 401 routes to onError (status 401)", async () => {
  let successFired = false;
  const outcome = await drive((done) => {
    frond.load(
      base + "/unauthorized",
      "content",
      () => { successFired = true; },
      (status) => done({ status }),
    );
  });
  assert.equal(outcome.status, 401);
  assert.equal(successFired, false, "success callback must NOT fire on a 401");
});

test("form.submit: a 401 routes to onError (status 401)", async () => {
  let successFired = false;
  const outcome = await drive((done) => {
    frond.form.submit(
      "loginForm",
      base + "/unauthorized",
      "message",
      () => { successFired = true; },
      (status) => done({ status }),
    );
  });
  assert.equal(outcome.status, 401);
  assert.equal(successFired, false, "success callback must NOT fire on a 401");
});

test("request: a hung socket + short opts.timeout routes ontimeout -> onError (status 0)", async () => {
  const startedAt = Date.now();
  let successFired = false;
  const outcome = await drive((done) => {
    frond.request(base + "/hang", {
      method: "GET",
      timeout: 300,
      onSuccess: () => { successFired = true; },
      onError: (status) => done({ status }),
    });
  }, 4000);
  const elapsed = Date.now() - startedAt;
  assert.equal(successFired, false, "success callback must NOT fire on a timeout");
  assert.equal(outcome.status, 0, "a timeout surfaces as status 0");
  assert.ok(elapsed < 3000, "onError should fire near the 300ms budget, not strand (took " + elapsed + "ms)");
});

test("post: a 200 still fires the success callback (no regression)", async () => {
  let errorFired = false;
  const outcome = await drive((done) => {
    frond.post(
      base + "/ok",
      { user: "bob" },
      "content",
      (html, raw) => done({ html, raw }),
      () => { errorFired = true; },
    );
  });
  assert.equal(errorFired, false, "error callback must NOT fire on a 200");
  assert.equal(outcome.raw.message, "<div>hello</div>", "success callback receives the parsed body");
});
