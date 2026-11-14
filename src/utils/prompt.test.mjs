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
{
  const result = prepareLaunch({ url: "https://site.test" }, "prompt", {
    writeText: async (text) => writes.push(text),
  });
  assert.equal(result.url, "https://site.test");
  assert.equal(result.mode, "paste");
  assert.equal(await result.copied, true);
  assert.deepEqual(writes, ["prompt"]);
}
{
  const result = prepareLaunch({ url: "https://site.test" }, "prompt", {
    writeText: async () => {
      throw new Error("blocked");
    },
  });
  assert.equal(await result.copied, false);
}
{
  // No clipboard API at all (e.g. insecure context) must not throw.
  const result = prepareLaunch(
    { url: "https://site.test" },
    "prompt",
    undefined,
  );
  assert.equal(await result.copied, false);
}
assert.deepEqual(
  prepareLaunch(
    {
      url: "https://site.test",
      promptUrl: (text) => `https://site.test?q=${text}`,
    },
    "hello world",
  ),
  { url: "https://site.test?q=hello%20world", mode: "deep-link" },
);

console.log("prompt utilities: ok");

import { searchCatalog } from "./catalog.js";
{
  const recipes = [
    {
      id: "ppt",
      title: "Build presentation",
      description: "Draft, design slides.",
      aliases: [],
    },
    { id: "ui", title: "Design UI", description: "Interfaces.", aliases: [] },
  ];
  assert.equal(searchCatalog("design", [], recipes)[0].item.id, "ui");
}
{
  const { historyEntry } = await import("./launcher.js");
  assert.equal(typeof historyEntry("hi").createdAt, "number");
}
console.log("search + history: ok");
