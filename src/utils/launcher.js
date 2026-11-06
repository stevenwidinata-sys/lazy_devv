import { getLaunchUrl } from "./prompt.js";

export async function prepareLaunch(
  tool,
  prompt,
  clipboard = navigator.clipboard,
) {
  if (tool.promptUrl)
    return { url: getLaunchUrl(tool, prompt), mode: "deep-link" };
  try {
    await clipboard.writeText(prompt);
    return { url: tool.url, mode: "paste" };
  } catch {
    return { url: tool.url, mode: "paste-error" };
  }
}

export function historyEntry(prompt) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    text: prompt,
  };
}
