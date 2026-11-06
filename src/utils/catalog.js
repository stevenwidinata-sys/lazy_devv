export function validateCatalog(tools, recipes) {
  const ids = new Set();
  for (const tool of tools) {
    if (ids.has(tool.id)) throw new Error(`Duplicate tool id: ${tool.id}`);
    ids.add(tool.id);
  }
  for (const recipe of recipes) {
    for (const id of recipe.apps) {
      if (!ids.has(id))
        throw new Error(`Unknown tool "${id}" in recipe "${recipe.id}"`);
    }
  }
  return true;
}

export function searchCatalog(query, tools, recipes) {
  const text = query.trim().toLowerCase();
  if (!text) return [];
  const apps = tools
    .filter((tool) =>
      [tool.name, tool.category, ...(tool.aliases || [])]
        .join(" ")
        .toLowerCase()
        .includes(text),
    )
    .map((item) => ({ type: "app", item }));
  const packs = recipes
    .filter((recipe) =>
      [recipe.title, recipe.description, ...recipe.aliases]
        .join(" ")
        .toLowerCase()
        .includes(text),
    )
    .map((item) => ({ type: "recipe", item }));
  return [...packs, ...apps].slice(0, 10);
}
