export function applyTemplate(template, input) {
  return template.replace('{input}', input.trim())
}

export function appendEnhancers(prompt, selectedEnhancers) {
  return [prompt.trim(), ...selectedEnhancers].filter(Boolean).join('\n\n')
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function getLaunchUrl(tool, prompt) {
  const encoded = encodeURIComponent(prompt)
  return tool.promptUrl ? tool.promptUrl(encoded) : tool.url
}
