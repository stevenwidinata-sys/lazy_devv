import { useEffect, useRef, useState } from "react";
import BrandIcon from "./BrandIcon";
import CommandBar from "./CommandBar";
import PromptComposer from "./PromptComposer";
import RecipePacks from "./RecipePacks";
import Sidebar from "./Sidebar";
import { defaultTools } from "./data/aiTools";
import { enhancers, promptTemplates } from "./data/promptTemplates";
import { recipes } from "./data/recipes";
import { validateCatalog } from "./utils/catalog";
import { historyEntry, prepareLaunch } from "./utils/launcher";
import { appendEnhancers } from "./utils/prompt";
import { getStoredValue, setStoredValue } from "./utils/storage";

const APP_PREVIEW_COUNT = 8;
const isPromptTool = (tool) =>
  ["AI", "Search", "Code", "Image", "Custom"].includes(tool.category);
function Card({ tool, favorite, favoriteTool, launch }) {
  const sendsPrompt = isPromptTool(tool);
  return (
    <article className="card relative p-4">
      <button
        aria-label={`Favorite ${tool.name}`}
        onClick={() => favoriteTool(tool.id)}
        aria-pressed={favorite}
        className={`absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full text-lg hover:bg-surface-2 ${favorite ? "text-amber-300" : "text-muted"}`}
      >
        ★
      </button>
      <button className="w-full text-left" onClick={() => launch(tool)}>
        <BrandIcon tool={tool} />
        <strong className="block">{tool.name}</strong>
        {sendsPrompt ? (
          <span
            title={
              tool.promptUrl
                ? "Prompt opens in tool"
                : "Prompt copies before opening"
            }
            className="text-xs text-muted"
          >
            {tool.promptUrl ? "↗ Deep link" : "⧉ Copy + paste"}
          </span>
        ) : (
          <span className="text-xs text-muted">↗ Open</span>
        )}
      </button>
    </article>
  );
}
export default function App() {
  const ref = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState(null);
  const [extras, setExtras] = useState([]);
  const [favorites, setFavorites] = useState(() =>
    getStoredValue("favorites", []),
  );
  const [history, setHistory] = useState(() =>
    getStoredValue("history", []).map((x) =>
      typeof x === "string" ? historyEntry(x) : x,
    ),
  );
  const [custom, setCustom] = useState(() => getStoredValue("tools", []));
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState(() => getStoredValue("theme", "dark"));
  const [recipe, setRecipe] = useState(null);
  const [appCategory, setAppCategory] = useState("All");
  const [showAllApps, setShowAllApps] = useState(false);
  const tools = [...defaultTools, ...custom];
  const base = template
    ? template.template.replace(
        "{input}",
        prompt || "[paste your content here]",
      )
    : prompt;
  const output = appendEnhancers(base, extras);
  const promptTools = tools.filter(isPromptTool);
  const apps = tools.filter((tool) => !isPromptTool(tool));
  const appCategories = ["All", ...new Set(apps.map((tool) => tool.category))];
  const filteredApps =
    appCategory === "All"
      ? apps
      : apps.filter((tool) => tool.category === appCategory);
  const visibleApps =
    appCategory === "All" && !showAllApps
      ? filteredApps.slice(0, APP_PREVIEW_COUNT)
      : filteredApps;
  const pinned = tools.filter((tool) => favorites.includes(tool.id));
  validateCatalog(defaultTools, recipes);
  useEffect(() => {
    setStoredValue("favorites", favorites);
    setStoredValue("history", history);
    setStoredValue("tools", custom);
    setStoredValue("theme", theme);
  }, [favorites, history, custom, theme]);
  useEffect(() => {
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme !== "dark");
  }, [theme]);
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
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);
  const favoriteTool = (id) =>
    setFavorites((all) =>
      all.includes(id) ? all.filter((x) => x !== id) : [...all, id],
    );
  const openApp = (tool) =>
    window.open(tool.url, "_blank", "noopener,noreferrer");
  function launch(tool) {
    if (!output) {
      setNotice("Write a prompt first.");
      ref.current?.focus();
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Open in the same tick as the click so phone browsers don't block it.
    const result = prepareLaunch(tool, output);
    window.open(result.url, "_blank", "noopener,noreferrer");
    setHistory((all) =>
      [historyEntry(output), ...all.filter((x) => x.text !== output)].slice(
        0,
        20,
      ),
    );
    if (result.mode === "deep-link") {
      setNotice(`Opening ${tool.name}.`);
      return;
    }
    result.copied.then((ok) =>
      setNotice(
        ok
          ? `Prompt copied. Paste it into ${tool.name}.`
          : "Could not copy prompt. Use the Copy button.",
      ),
    );
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setNotice("Prompt copied.");
    } catch {
      setNotice("Could not copy prompt.");
    }
  }
  const grid = (list, action) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {list.map((tool) => (
        <Card
          key={tool.id}
          tool={tool}
          favorite={favorites.includes(tool.id)}
          favoriteTool={favoriteTool}
          launch={action}
        />
      ))}
    </div>
  );
  return (
    <main
      className={`app-page ${theme === "dark" ? "theme-dark" : "theme-light"} min-h-screen`}
    >
      <section className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.25em] text-violet-400">
              Lazy Dev
            </p>
            <h1 className="mt-2 text-4xl font-black">One prompt. Every AI.</h1>
          </div>
          <button
            className="button h-11 min-w-11 shrink-0 bg-violet-500 text-white"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span>
            <span className="ml-1 hidden sm:inline">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </header>
        <CommandBar
          tools={tools}
          recipes={recipes}
          onOpenTool={openApp}
          onOpenRecipe={setRecipe}
        />
        <PromptComposer
          inputRef={ref}
          prompt={prompt}
          setPrompt={setPrompt}
          activeTemplate={template}
          setActiveTemplate={setTemplate}
          extras={extras}
          setExtras={setExtras}
          templates={promptTemplates}
          enhancers={enhancers}
          onCopy={copy}
          onClear={() => {
            setPrompt("");
            setTemplate(null);
            setExtras([]);
          }}
        />
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-black">Send prompt to AI</h2>
          {grid(promptTools, launch)}
        </section>
        {pinned.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-black">Favorites</h2>
            {grid(pinned, (tool) =>
              isPromptTool(tool) ? launch(tool) : openApp(tool),
            )}
          </section>
        )}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-black">Just open app</h2>
          <div
            className="no-scrollbar -mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1"
            role="tablist"
            aria-label="App categories"
          >
            {appCategories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={appCategory === category}
                onClick={() => setAppCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm ${appCategory === category ? "bg-violet-500 text-white" : "bg-surface-2"}`}
              >
                {category}
              </button>
            ))}
          </div>
          {grid(visibleApps, openApp)}
          {appCategory === "All" && filteredApps.length > APP_PREVIEW_COUNT && (
            <button
              className="button mt-3 w-full bg-surface-2"
              aria-expanded={showAllApps}
              onClick={() => setShowAllApps((open) => !open)}
            >
              {showAllApps
                ? "Show fewer apps"
                : `Show all ${filteredApps.length} apps`}
            </button>
          )}
        </section>
        <div className="mt-8">
          <RecipePacks
            recipes={recipes}
            tools={tools}
            activeRecipe={recipe}
            setActiveRecipe={setRecipe}
          />
        </div>
        <Sidebar
          history={history}
          setPrompt={setPrompt}
          setHistory={setHistory}
          custom={custom}
          setCustom={setCustom}
          setNotice={setNotice}
        />
        {notice && (
          <p
            role="status"
            className="fixed bottom-5 left-5 right-5 rounded-xl text-center sm:left-auto sm:text-left bg-violet-600 px-4 py-3 text-sm text-white shadow-lg"
          >
            {notice}
          </p>
        )}
      </section>
    </main>
  );
}
