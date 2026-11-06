import { useState } from "react";
import { isHttpUrl } from "./utils/prompt";

export default function Sidebar({
  history,
  setPrompt,
  extras,
  setExtras,
  enhancers,
  custom,
  setCustom,
  setNotice,
}) {
  const [form, setForm] = useState({ name: "", url: "" });
  const toggle = (item) =>
    setExtras((all) =>
      all.includes(item) ? all.filter((x) => x !== item) : [...all, item],
    );
  function add(event) {
    event.preventDefault();
    if (!form.name.trim() || !isHttpUrl(form.url))
      return setNotice("Add a name and valid http(s) URL.");
    setCustom((all) => [
      ...all,
      {
        id: `custom-${Date.now()}`,
        name: form.name.trim(),
        url: form.url,
        category: "Custom",
        icon: "YOU",
        accent: "from-violet-400 to-fuchsia-500",
      },
    ]);
    setForm({ name: "", url: "" });
    setNotice("Custom AI tool added.");
  }
  return (
    <aside className="space-y-6">
      <section className="card p-4">
        <h2 className="font-black">Prompt enhancer</h2>
        {enhancers.map((item) => (
          <label className="mt-3 flex gap-2 text-sm text-zinc-400" key={item}>
            <input
              type="checkbox"
              checked={extras.includes(item)}
              onChange={() => toggle(item)}
            />
            {item}
          </label>
        ))}
      </section>
      <section className="card p-4">
        <h2 className="font-black">Recent prompts</h2>
        {history.length ? (
          history.slice(0, 5).map((item) => (
            <button
              onClick={() => setPrompt(item.text)}
              className="mt-3 block w-full truncate text-left text-sm text-muted"
              key={item.id}
            >
              {item.text}
            </button>
          ))
        ) : (
          <p className="mt-3 text-sm text-zinc-500">
            Sent prompts appear here.
          </p>
        )}
      </section>
      <section className="card p-4">
        <h2 className="font-black">Add custom AI</h2>
        <form onSubmit={add} className="mt-3 space-y-2">
          <input
            className="control w-full"
            placeholder="Tool name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="control w-full"
            placeholder="https://tool.example"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <button className="button w-full bg-zinc-100 text-zinc-950">
            Add tool
          </button>
        </form>
      </section>
    </aside>
  );
}
