# AGENTS.md (for agentic contributors)

- Install/run: use Bun or npm. Build: `bun run build`. Dev: `bun run dev`. Preview: `bun run preview`. Lint: `bun run lint`. Format: `bun run format`. Type-check: no dedicated script; TS runs via editors/ESLint.
- Testing: no framework configured in this repo. If you add tests, prefer Vitest; run all: `bunx vitest run`; single test: `bunx vitest run path/to/file.test.ts -t "test name"`. Do not commit test runners without scripts unless you also update package.json.
- Single-file tasks: keep edits minimal; run lint+format after changes. Do not introduce breaking changes to Astro i18n, Tailwind v4, or Netlify adapter config.
- Imports: prefer path aliases from tsconfig (`@components/*`, `@js/*`, `@layouts/*`, `@config/*`, `@assets/*`, `@images/*`, `@videos/*`, `@/*`). Use type-only imports when applicable. Group: std libs, third-party, internal; keep sorted.
- Languages/framework: Astro 5 + React 18 + TypeScript strictNullChecks. JSX: react-jsx with jsxImportSource "react". Astro islands only where needed.
- Formatting: Prettier is authoritative; run `bun run format`. Keep CSS/Tailwind utility classes reasonably grouped; prefer semantic class extraction to components when repeated.
- Linting: ESLint 9 with astro and typescript-eslint. Important rules are relaxed: no-explicit-any OFF, no-unused-vars OFF, ban-ts-comment OFF, anchor-is-valid OFF in .astro. Still fix obvious issues and accessibility problems.
- Naming: files/folders kebab-case; components PascalCase; variables/functions camelCase; constants UPPER_SNAKE. Astro pages under `src/pages` define routes; content/config under `src/config`.
- Types: prefer explicit return types for exported functions; narrow unknowns; avoid any except template plumbing. Use discriminated unions for variant props. Keep null/undefined handling explicit (strictNullChecks is on).
- Error handling: fail fast on config/content errors; surface user-facing issues with friendly messages. In UI, guard against undefined data, and avoid throwing in Astro frontmatter unless build should fail.
- Data/content: use Astro Content Collections and Keystatic per existing patterns. Keep i18n locales aligned with `astro.config.mjs` and `src/config/translationData.json.ts`.
- Performance: keep islands small; prefer SSR/static over client JS. Use dynamic imports for heavy React components. Images via Astro assets; don’t re-enable CSS compression in compress() unless verified.
- Accessibility: keep jsx-a11y best practices even if some rules are off. Ensure focus states and aria- attributes on interactive elements.
- Commit hygiene: small, focused commits; no secrets; run lint+format before committing. Respect existing Docker/Netlify configs.
- Cursor/Copilot rules: none found (.cursor/rules, .cursorrules, .github/copilot-instructions.md not present). If added later, mirror key points here.
