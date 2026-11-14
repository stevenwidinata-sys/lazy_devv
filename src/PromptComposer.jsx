import { appendEnhancers, applyTemplate } from "./utils/prompt";

const hasKeyboard =
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

export default function PromptComposer({
  inputRef,
  prompt,
  setPrompt,
  activeTemplate,
  setActiveTemplate,
  extras,
  setExtras,
  templates,
  enhancers,
  onCopy,
  onClear,
}) {
  const rendered = activeTemplate
    ? applyTemplate(
        activeTemplate.template,
        prompt || "[paste your content here]",
      )
    : prompt;
  const preview = appendEnhancers(rendered, extras);
  return (
    <section className="card p-5">
      <p className="mb-4 text-sm text-muted">
        <strong>1. Write</strong> → <strong>2. Pick a template</strong>{" "}
        (optional) → <strong>3. Click an AI</strong>
      </p>
      <label className="mb-2 block text-sm font-bold" htmlFor="prompt">
        Your prompt
      </label>
      <textarea
        id="prompt"
        ref={inputRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows="4"
        placeholder={
          hasKeyboard ? "Ask anything... Press / to focus." : "Ask anything..."
        }
        className="control w-full"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setActiveTemplate(template)}
            className={`rounded-full px-4 py-2 text-sm sm:px-3 sm:py-1 ${activeTemplate?.id === template.id ? "bg-violet-500 text-white" : "bg-surface-2"}`}
          >
            {template.title}
          </button>
        ))}
        {activeTemplate && (
          <button
            className="rounded-full px-4 py-2 text-sm text-muted sm:px-3 sm:py-1"
            onClick={() => setActiveTemplate(null)}
          >
            Clear template
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {enhancers.map((item) => (
          <label
            key={item}
            className="flex cursor-pointer items-center gap-2 py-1 text-sm text-muted"
          >
            <input
              type="checkbox"
              checked={extras.includes(item)}
              onChange={() =>
                setExtras((all) =>
                  all.includes(item)
                    ? all.filter((x) => x !== item)
                    : [...all, item],
                )
              }
              className="h-4 w-4 accent-violet-500"
            />
            {item}
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-surface-2 p-3">
        <p className="text-xs font-bold text-muted">LIVE PREVIEW</p>
        <pre className="mt-1 whitespace-pre-wrap text-sm">
          {preview || "Your final prompt appears here."}
        </pre>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="button bg-surface-2" onClick={onCopy}>
          Copy
        </button>
        <button className="button bg-surface-2" onClick={onClear}>
          Clear
        </button>
      </div>
    </section>
  );
}
