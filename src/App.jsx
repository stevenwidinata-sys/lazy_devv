import { useEffect, useRef, useState } from "react";
import CommandBar from "./CommandBar";
import RecipePacks from "./RecipePacks";
import Sidebar from "./Sidebar";
import { categories, defaultTools } from "./data/aiTools";
import { enhancers, promptTemplates } from "./data/promptTemplates";
import { recipes } from "./data/recipes";
import { validateCatalog } from "./utils/catalog";
import { historyEntry, prepareLaunch } from "./utils/launcher";
import { appendEnhancers, applyTemplate } from "./utils/prompt";
import { getStoredValue, setStoredValue } from "./utils/storage";

const flip = (id, set) =>
  set((all) => (all.includes(id) ? all.filter((x) => x !== id) : [...all, id]));
function Tool({ tool, favorites, launch, setFavorites }) {
  return (
    <article className="card relative p-4">
      <button
        aria-label={`Favorite ${tool.name}`}
        onClick={() => flip(tool.id, setFavorites)}
        className={`absolute right-3 top-3 text-lg ${favorites.includes(tool.id) ? "text-amber-300" : "text-muted"}`}
      >
        ★
      </button>
      <button className="w-full text-left" onClick={() => launch(tool)}>
        <span
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-black text-zinc-950 ${tool.accent}`}
        >
          {tool.icon}
        </span>
        <strong className="block">{tool.name}</strong>
        <span className="text-xs text-muted">
          {tool.category} · {tool.promptUrl ? "Deep link" : "Copy + paste"}
        </span>
      </button>
    </article>
  );
}
export default function App() {
  const ref = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState(() =>
    getStoredValue("favorites", []),
  );
  const [history, setHistory] = useState(() =>
    getStoredValue("history", []).map((x) =>
      typeof x === "string" ? historyEntry(x) : x,
    ),
  );
  const [custom, setCustom] = useState(() => getStoredValue("tools", []));
  const [extras, setExtras] = useState([]);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState(() => getStoredValue("theme", "dark"));
  const [recipe, setRecipe] = useState(null);
  const tools = [...defaultTools, ...custom];
  const output = appendEnhancers(prompt, extras);
  const visible = tools.filter(
    (tool) => category === "All" || tool.category === category,
  );
  validateCatalog(defaultTools, recipes);
  useEffect(() => {
    setStoredValue("favorites", favorites);
    setStoredValue("history", history);
    setStoredValue("tools", custom);
    setStoredValue("theme", theme);
  }, [favorites, history, custom, theme]);
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  async function launch(tool) {
    if (!output) {
      setNotice("Write a prompt first.");
      return ref.current?.focus();
    }
    const result = await prepareLaunch(tool, output);
    setHistory((all) =>
      [historyEntry(output), ...all.filter((x) => x.text !== output)].slice(
        0,
        20,
      ),
    );
    setNotice(
      result.mode === "paste"
        ? `Prompt copied. Paste it into ${tool.name}.`
        : result.mode === "paste-error"
          ? `Could not copy prompt. Copy it manually before opening ${tool.name}.`
          : `Opening ${tool.name} with your prompt.`,
    );
    window.open(result.url, "_blank", "noopener,noreferrer");
  }
  return (
    <main
      className={`app-page ${theme === "dark" ? "theme-dark" : "theme-light"} min-h-screen`}
    >
      <section className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-10 flex justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.25em] text-violet-400">
              Lazy Dev
            </p>
            <h1 className="mt-2 text-4xl font-black">One prompt. Every AI.</h1>
          </div>
          <button
            className="button bg-violet-500 text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀ Light" : "◐ Dark"}
          </button>
        </header>
        <CommandBar
          tools={tools}
          recipes={recipes}
          onOpenTool={(tool) =>
            window.open(tool.url, "_blank", "noopener,noreferrer")
          }
          onOpenRecipe={setRecipe}
        />
        <RecipePacks
          recipes={recipes}
          tools={tools}
          activeRecipe={recipe}
          setActiveRecipe={setRecipe}
        />
        <section className="card p-5">
          <label className="mb-2 block text-sm font-bold">
            What do you need?
          </label>
          <textarea
            ref={ref}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="4"
            placeholder="Ask once, then launch anywhere..."
            className="control w-full"
          />
          <p className="mt-2 text-xs text-muted">
            Deep link opens with prompt. Copy + paste copies prompt before
            opening tool.
          </p>
          {notice && (
            <p role="status" className="mt-3 text-sm text-violet-500">
              {notice}
            </p>
          )}
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {["All", ...categories, "Custom"].map((x) => (
                <button
                  key={x}
                  onClick={() => setCategory(x)}
                  className={`rounded-full px-3 py-1.5 text-sm ${category === x ? "bg-violet-500 text-white" : "bg-surface-2"}`}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {visible.map((tool) => (
                <Tool
                  key={tool.id}
                  tool={tool}
                  favorites={favorites}
                  launch={launch}
                  setFavorites={setFavorites}
                />
              ))}
            </div>
            <h2 className="mb-3 mt-8 text-lg font-black">Prompt templates</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {promptTemplates.map((x) => (
                <button
                  key={x.id}
                  onClick={() => setPrompt((v) => applyTemplate(x.template, v))}
                  className="card p-4 text-left"
                >
                  <strong>{x.title}</strong>
                  <span className="ml-2 text-xs text-muted">{x.category}</span>
                </button>
              ))}
            </div>
          </div>
          <Sidebar
            history={history}
            setPrompt={setPrompt}
            extras={extras}
            setExtras={setExtras}
            enhancers={enhancers}
            custom={custom}
            setCustom={setCustom}
            setNotice={setNotice}
          />
        </section>
      </section>
    </main>
  );
}
