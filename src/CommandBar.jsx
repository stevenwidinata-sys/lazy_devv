import { useMemo, useState } from "react";
import { searchCatalog } from "./utils/catalog";

export default function CommandBar({
  tools,
  recipes,
  onOpenTool,
  onOpenRecipe,
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(
    () => searchCatalog(query, tools, recipes),
    [query, recipes, tools],
  );

  function select(result) {
    if (!result) return;
    if (result.type === "app") onOpenTool(result.item);
    else onOpenRecipe(result.item);
  }

  function handleKeyDown(event) {
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      select(results[activeIndex]);
    }
  }

  return (
    <section className="card mb-8 p-4">
      <label className="mb-2 block text-sm font-bold" htmlFor="command-search">
        Open anything
      </label>
      <input
        id="command-search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="control w-full"
        placeholder="Try: youtube, yt, make ppt, design ui, linkedin..."
        aria-controls="command-results"
        aria-activedescendant={
          results[activeIndex] ? `command-result-${activeIndex}` : undefined
        }
      />
      {query && (
        <div id="command-results" role="listbox" className="mt-3 grid gap-2">
          {results.length ? (
            results.map((result, index) => (
              <button
                id={`command-result-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                key={`${result.type}-${result.item.id}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(result)}
                className={`rounded-lg px-3 py-2 text-left text-sm ${index === activeIndex ? "bg-violet-500 text-white" : "bg-surface-2 hover:bg-surface-3"}`}
              >
                <strong>{result.item.title || result.item.name}</strong>
                <span className="ml-2 text-xs opacity-70">
                  {result.type === "recipe"
                    ? result.item.description
                    : result.item.category}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">No matching app or task.</p>
          )}
        </div>
      )}
    </section>
  );
}
