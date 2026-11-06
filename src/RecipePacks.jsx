export default function RecipePacks({
  recipes,
  tools,
  activeRecipe,
  setActiveRecipe,
}) {
  const activeTools = tools.filter((tool) =>
    activeRecipe?.apps.includes(tool.id),
  );

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-black">Workspace packs</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
