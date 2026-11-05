/**
 * Frond browser-helper tests — form.collect() and <select multiple>.
 *
 * NO MOCKS: the built bundle runs in a real jsdom DOM; form.collect reads the
 * real <select multiple> the browser would submit. Ported from tina4-php #350
 * into the one frond source so every framework's vendored bundle carries it.
 *
 * Runs against dist/frond.js AND dist/frond.min.js.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";

const here = dirname(fileURLToPath(import.meta.url));

for (const bundle of ["frond.js", "frond.min.js"]) {
  describe(`form.collect <select multiple> (${bundle})`, () => {
    const source = readFileSync(join(here, "..", "dist", bundle), "utf8");

    function load() {
      const dom = new JSDOM(
        `<!DOCTYPE html><html><body>
           <form id="f">
             <select name="colors" multiple>
               <option value="red" selected>red</option>
               <option value="green">green</option>
               <option value="blue" selected>blue</option>
               <option value="off" selected disabled>off</option>
               <optgroup label="legacy" disabled>
                 <option value="legacy1" selected>legacy1</option>
               </optgroup>
             </select>
           </form>
         </body></html>`,
        { runScripts: "dangerously", resources: "usable" },
      );
      const s = dom.window.document.createElement("script");
      s.textContent = source;
      dom.window.document.body.appendChild(s);
      return dom;
    }

    test("sends every enabled selected option", () => {
      const dom = load();
      const fd = dom.window.frond.form.collect("f");
      assert.deepEqual(fd.getAll("colors"), ["red", "blue"]);
      dom.window.close();
    });

    test("skips a disabled option and a disabled optgroup", () => {
      const dom = load();
      const values = dom.window.frond.form.collect("f").getAll("colors");
      assert.ok(!values.includes("off"), "a disabled option must not be sent");
      assert.ok(!values.includes("legacy1"), "an option under a disabled optgroup must not be sent");
      dom.window.close();
    });
  });
}
