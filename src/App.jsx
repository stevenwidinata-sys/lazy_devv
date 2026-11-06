import { useEffect, useRef, useState } from "react";
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

const isPromptTool = (tool) =>
  ["AI", "Search", "Code", "Image"].includes(tool.category);
function Card({ tool, favorite, favoriteTool, launch }) {
  return (
    <article className="card relative p-4">
      <button
        aria-label={`Favorite ${tool.name}`}
        onClick={() => favoriteTool(tool.id)}
        className={`absolute right-3 top-3 text-lg ${favorite ? "text-amber-300" : "text-muted"}`}
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
  const pinned = tools.filter((tool) => favorites.includes(tool.id));
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
          ? "Could not copy prompt."
          : `Opening ${tool.name}.`,
    );
    window.open(result.url, "_blank", "noopener,noreferrer");
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
        <header className="mb-6 flex justify-between">
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
        <PromptComposer
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
          {grid(apps, openApp)}
        </section>
        <div className="mt-8">
          <CommandBar
            tools={tools}
            recipes={recipes}
            onOpenTool={openApp}
            onOpenRecipe={setRecipe}
          />
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
            className="fixed bottom-5 right-5 rounded-xl bg-violet-600 px-4 py-3 text-sm text-white shadow-lg"
          >
            {notice}
          </p>
        )}
      </section>
    </main>
  );
}
