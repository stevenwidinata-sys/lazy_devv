import { getLaunchUrl } from "./prompt.js";

// Synchronous on purpose: the caller must open the new tab in the same tick as
// the click, or mobile browsers (iOS Safari) treat it as a blocked popup.
// The clipboard write starts here, inside that same click, and settles later.
export function prepareLaunch(
  tool,
  prompt,
  clipboard = globalThis.navigator?.clipboard,
) {
  if (tool.promptUrl)
    return { url: getLaunchUrl(tool, prompt), mode: "deep-link" };
  let copied;
  try {
    copied = Promise.resolve(clipboard.writeText(prompt)).then(
      () => true,
      () => false,
    );
  } catch {
    copied = Promise.resolve(false);
  }
  return { url: tool.url, mode: "paste", copied };
}

export function historyEntry(prompt) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    text: prompt,
    createdAt: Date.now(),
  };
}
