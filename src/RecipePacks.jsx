import { useState } from 'react'

export default function RecipePacks({ recipes, tools }) {
  const [active, setActive] = useState(null)
  const [picked, setPicked] = useState([])
  function choose(recipe) { setActive(recipe); setPicked(recipe.apps) }
  function openPicked() { tools.filter((tool) => picked.includes(tool.id)).forEach((tool) => window.open(tool.url, '_blank', 'noopener,noreferrer')) }
  return <section className="mb-8"><h2 className="mb-3 text-lg font-black">Workspace packs</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recipes.map((recipe) => <button id={`recipe-${recipe.id}`} key={recipe.id} onClick={() => choose(recipe)} className="card p-4 text-left hover:border-violet-400"><strong>{recipe.title}</strong><p className="mt-1 text-sm text-zinc-500">{recipe.description}</p></button>)}</div>{active && <div className="card mt-4 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-black">{active.title}</h3><button className="button bg-violet-500 text-white" onClick={openPicked}>Open selected ({picked.length})</button></div><div className="mt-3 flex flex-wrap gap-3">{tools.filter((tool) => active.apps.includes(tool.id)).map((tool) => <label className="flex gap-2 text-sm" key={tool.id}><input type="checkbox" checked={picked.includes(tool.id)} onChange={() => setPicked((all) => all.includes(tool.id) ? all.filter((id) => id !== tool.id) : [...all, tool.id])} />{tool.name}</label>)}</div></div>}</section>
}
