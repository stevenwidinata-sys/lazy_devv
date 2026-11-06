export const promptTemplates = [
  { id: 'explain', title: 'Explain code', category: 'Code', template: 'Explain this code clearly. Include purpose, flow, edge cases, and improvements:\n\n{input}' },
  { id: 'debug', title: 'Debug error', category: 'Code', template: 'Debug this issue. Find likely root cause, explain it, then give smallest safe fix:\n\n{input}' },
  { id: 'test', title: 'Write tests', category: 'Code', template: 'Write focused tests for this. Cover happy path and important edge cases:\n\n{input}' },
  { id: 'research', title: 'Research topic', category: 'Search', template: 'Research this topic. Give current, reliable facts, sources, trade-offs, and a concise conclusion:\n\n{input}' },
  { id: 'rewrite', title: 'Rewrite text', category: 'Writing', template: 'Rewrite this for clarity and concision. Keep meaning and tone:\n\n{input}' },
  { id: 'learn', title: 'Teach me', category: 'Learning', template: 'Teach me this from first principles. Use simple examples and end with a quick self-check:\n\n{input}' },
]

export const enhancers = [
  'Use bullet points.',
  'Keep it concise.',
  'Include code examples.',
  'Explain like I am a beginner.',
]
