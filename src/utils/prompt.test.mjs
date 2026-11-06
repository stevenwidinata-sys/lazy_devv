import assert from "node:assert/strict";
import {
  applyTemplate,
  appendEnhancers,
  getLaunchUrl,
  isHttpUrl,
} from "./prompt.js";
import { validateCatalog } from "./catalog.js";
import { prepareLaunch } from "./launcher.js";

assert.equal(applyTemplate("Ask: {input}", "  hello  "), "Ask: hello");
assert.equal(
  appendEnhancers("Question", ["Use bullets."]),
  "Question\n\nUse bullets.",
);
assert.equal(isHttpUrl("https://example.com"), true);
assert.equal(isHttpUrl("javascript:alert(1)"), false);
assert.equal(
  getLaunchUrl(
    {
      url: "https://example.com",
      promptUrl: (prompt) => `https://x.test?q=${prompt}`,
    },
    "hello world",
  ),
  "https://x.test?q=hello%20world",
);
assert.equal(
  validateCatalog([{ id: "a" }], [{ id: "recipe", apps: ["a"] }]),
  true,
);
assert.throws(
  () => validateCatalog([{ id: "a" }, { id: "a" }], []),
  /Duplicate/,
);
assert.throws(
  () => validateCatalog([{ id: "a" }], [{ id: "recipe", apps: ["missing"] }]),
  /Unknown/,
);
const writes = [];
assert.deepEqual(
  await prepareLaunch({ url: "https://site.test" }, "prompt", {
    writeText: async (text) => writes.push(text),
  }),
  { url: "https://site.test", mode: "paste" },
);
assert.deepEqual(writes, ["prompt"]);
assert.deepEqual(
  await prepareLaunch({ url: "https://site.test" }, "prompt", {
    writeText: async () => {
      throw new Error("blocked");
    },
  }),
  { url: "https://site.test", mode: "paste-error" },
);
assert.deepEqual(
  await prepareLaunch(
    {
      url: "https://site.test",
      promptUrl: (text) => `https://site.test?q=${text}`,
    },
    "hello world",
  ),
  { url: "https://site.test?q=hello%20world", mode: "deep-link" },
);

console.log("prompt utilities: ok");
