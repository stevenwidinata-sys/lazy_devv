import { useMemo, useState } from 'react'

export default function CommandBar({ tools, recipes, onOpenTool, onOpenRecipe }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return []
    const apps = tools.filter((app) => [app.name, app.category, ...(app.aliases || [])].join(' ').toLowerCase().includes(text)).slice(0, 5).map((app) => ({ type: 'app', item: app }))
    const packs = recipes.filter((recipe) => [recipe.title, recipe.description, ...recipe.aliases].join(' ').toLowerCase().includes(text)).slice(0, 5).map((recipe) => ({ type: 'recipe', item: recipe }))
    return [...packs, ...apps]
  }, [query, recipes, tools])
  return <section className="card mb-8 p-4"><label className="mb-2 block text-sm font-bold">Open anything</label><input value={query} onChange={(e) => setQuery(e.target.value)} className="control w-full" placeholder="Try: youtube, yt, make ppt, design ui, linkedin..." />{query && <div className="mt-3 grid gap-2">{results.length ? results.map(({ type, item }) => <button key={`${type}-${item.id}`} onClick={() => type === 'app' ? onOpenTool(item) : onOpenRecipe(item)} className="rounded-lg bg-zinc-800 px-3 py-2 text-left text-sm hover:bg-zinc-700"><strong>{item.title || item.name}</strong><span className="ml-2 text-xs text-zinc-400">{type === 'recipe' ? item.description : item.category}</span></button>) : <p className="text-sm text-zinc-500">No matching app or task.</p>}</div>}</section>
}
