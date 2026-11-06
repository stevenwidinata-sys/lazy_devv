# Implementation Plan

## Overview
Build Lazy Dev, a React and Tailwind website that launches AI tools from one prompt and reduces repeated typing.

Scope includes an AI directory, reusable prompt templates, keyboard shortcuts, multi-send, favorites, prompt history, theme preference, custom AI links, and prompt enhancers. The project is an empty Git repository on `main`; it will use Vite, React, Tailwind CSS, browser `localStorage`, and deploy to Vercel. No backend or AI API keys are needed.

External AI sites have different URL-prefill support. Launching uses each supported URL format. For tools without one, the app copies the prompt before opening the site and shows a paste notice.

## Types

- `AiTool`: `{ id, name, category, url, accent, icon, promptUrl? }`.
  - `id`: stable string key.
  - `name`: visible product name.
  - `category`: `Chat`, `Search`, `Code`, `Image`, or `Writing`.
  - `url`: HTTPS launch URL.
  - `accent`: Tailwind gradient class string.
  - `icon`: short visible text mark.
  - `promptUrl`: optional function accepting encoded prompt text and returning a launch URL.
- `PromptTemplate`: `{ id, title, category, template }`.
- `CustomTool`: validated subset of `AiTool`, with generated `id`.
- Browser storage keys hold `favorites: string[]`, `recentPrompts: string[]`, `customTools: CustomTool[]`, and `theme: "dark" | "light"`.
- Recent prompt list has maximum 20 non-empty entries. Custom URLs must use `http:` or `https:`.

## Files

- `c:\Project\lazy_devv\package.json` — scripts and app dependencies.
- `c:\Project\lazy_devv\vite.config.js` — Vite configuration.
- `c:\Project\lazy_devv\tailwind.config.js` — Tailwind content/theme config.
- `c:\Project\lazy_devv\postcss.config.js` — Tailwind PostCSS integration.
- `c:\Project\lazy_devv\index.html` — page shell and metadata.
- `c:\Project\lazy_devv\src\main.jsx` — React mount.
- `c:\Project\lazy_devv\src\index.css` — Tailwind layers, theme, reusable styles.
- `c:\Project\lazy_devv\src\App.jsx` — state orchestration and screen composition.
- `c:\Project\lazy_devv\src\data\aiTools.js` — default tool directory and categories.
- `c:\Project\lazy_devv\src\data\promptTemplates.js` — starter prompt templates and enhancers.
- `c:\Project\lazy_devv\src\utils\storage.js` — resilient localStorage read/write helpers.
- `c:\Project\lazy_devv\src\utils\prompt.js` — prompt formatting, validation, and tool launch behavior.
- `c:\Project\lazy_devv\src\utils\prompt.test.mjs` — runnable assert checks for non-trivial utility behavior.
- `c:\Project\lazy_devv\README.md` — local use and Vercel deployment.
- `c:\Project\lazy_devv\.gitignore` — local and generated file exclusions.

## Functions

- `getStoredValue(key, fallback)` in `src/utils/storage.js` — parse persisted JSON safely.
- `setStoredValue(key, value)` in `src/utils/storage.js` — store JSON without breaking app when storage is unavailable.
- `isHttpUrl(value)` in `src/utils/prompt.js` — validate user-supplied destination URLs.
- `applyTemplate(template, value)` in `src/utils/prompt.js` — replace `{input}` with prompt text.
- `appendEnhancers(prompt, enhancers)` in `src/utils/prompt.js` — append selected writing directions.
- `getLaunchUrl(tool, prompt)` in `src/utils/prompt.js` — return AI-specific URL when supported.
- `App` handlers in `src/App.jsx` — create prompt output, launch tools, manage selection, local persistence, and keyboard commands.

## Classes

No classes. Use React function components and plain functions.

## Dependencies

- `react`, `react-dom`.
- `vite`, `@vitejs/plugin-react`.
- `tailwindcss`, `postcss`, `autoprefixer`.
- No UI library, router, backend, or AI SDK.

## Testing

- Run `npm run test` for Node assert checks covering template substitution, enhancer output, safe prompt launch URL construction, and URL validation.
- Run `npm run build` before every release commit.
- Manual checks: prompt launch/copy fallback, multi-select behavior, keyboard shortcut focus, local preference persistence, invalid custom links, mobile layout, and dark/light contrast.

## Implementation Order

1. Create Vite/React/Tailwind project shell, baseline styles, metadata, and documentation.
2. Add AI directory, prompt templates, storage helpers, prompt utilities, and runnable checks.
3. Build prompt composer, categorized directory, and single-tool launcher.
4. Add template selection, enhancers, multi-send, and keyboard shortcut behavior.
5. Add persisted favorites, prompt history, custom AI links, and theme control.
6. Validate build and tests; apply necessary accessibility and UI fixes.
7. Create focused `feat`, `fix`, and `refactor` Git commits, then push `main` to GitHub.
