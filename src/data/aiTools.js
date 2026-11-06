export const categories = ['Chat', 'Search', 'Code', 'Image', 'Writing']

const chatgptUrl = (prompt) => `https://chatgpt.com/?q=${prompt}`
const perplexityUrl = (prompt) => `https://www.perplexity.ai/search?q=${prompt}`
const youUrl = (prompt) => `https://you.com/search?q=${prompt}`

export const defaultTools = [
  { id: 'chatgpt', name: 'ChatGPT', category: 'Chat', url: 'https://chatgpt.com', promptUrl: chatgptUrl, icon: 'GPT', accent: 'from-emerald-400 to-teal-500' },
  { id: 'claude', name: 'Claude', category: 'Chat', url: 'https://claude.ai', icon: 'CL', accent: 'from-orange-400 to-amber-500' },
  { id: 'gemini', name: 'Gemini', category: 'Chat', url: 'https://gemini.google.com', icon: 'GM', accent: 'from-blue-400 to-indigo-500' },
  { id: 'grok', name: 'Grok', category: 'Chat', url: 'https://grok.com', icon: 'GK', accent: 'from-zinc-400 to-zinc-600' },
  { id: 'deepseek', name: 'DeepSeek', category: 'Chat', url: 'https://chat.deepseek.com', icon: 'DS', accent: 'from-blue-500 to-cyan-400' },
  { id: 'mistral', name: 'Mistral', category: 'Chat', url: 'https://chat.mistral.ai', icon: 'MS', accent: 'from-orange-500 to-red-500' },
  { id: 'perplexity', name: 'Perplexity', category: 'Search', url: 'https://www.perplexity.ai', promptUrl: perplexityUrl, icon: 'PX', accent: 'from-cyan-400 to-sky-500' },
  { id: 'you', name: 'You.com', category: 'Search', url: 'https://you.com', promptUrl: youUrl, icon: 'YU', accent: 'from-violet-400 to-purple-500' },
  { id: 'copilot', name: 'Copilot', category: 'Code', url: 'https://github.com/features/copilot', icon: 'CP', accent: 'from-fuchsia-400 to-pink-500' },
  { id: 'poe', name: 'Poe', category: 'Code', url: 'https://poe.com', icon: 'PO', accent: 'from-violet-500 to-purple-600' },
  { id: 'huggingchat', name: 'HuggingChat', category: 'Code', url: 'https://huggingface.co/chat', icon: 'HC', accent: 'from-yellow-400 to-orange-500' },
  { id: 'dalle', name: 'DALL·E', category: 'Image', url: 'https://chatgpt.com', icon: 'D·E', accent: 'from-emerald-400 to-green-500' },
  { id: 'midjourney', name: 'Midjourney', category: 'Image', url: 'https://www.midjourney.com', icon: 'MJ', accent: 'from-indigo-400 to-violet-600' },
]
