import { useEffect, useRef } from "react";

export default function RecipePacks({
  recipes,
  tools,
  activeRecipe,
  setActiveRecipe,
}) {
  const ref = useRef(null);
  const activeTools = (activeRecipe?.apps || [])
    .map((id) => tools.find((tool) => tool.id === id))
    .filter(Boolean);

  useEffect(() => {
    if (!activeRecipe || !ref.current) return;
    ref.current.open = true;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeRecipe]);

  return (
    <details ref={ref} className="mb-8">
      <summary className="cursor-pointer text-lg font-black">
        Workspace packs
      </summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            onClick={() => setActiveRecipe(recipe)}
            className="card p-4 text-left hover:border-violet-400"
          >
            <strong>{recipe.title}</strong>
            <p className="mt-1 text-sm text-muted">{recipe.description}</p>
          </button>
        ))}
      </div>
      {activeRecipe && (
        <div className="card mt-4 p-4">
          <h3 className="font-black">{activeRecipe.title}</h3>
          <p className="mt-1 text-sm text-muted">
            Choose tools, then open each link. Browsers permit links, not popup
            loops.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {activeTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="button bg-violet-500 text-white"
              >
                Open {tool.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </details>
  );
}
