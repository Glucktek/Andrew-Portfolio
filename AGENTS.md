# AGENTS.md (for agentic contributors)

- Build/dev/preview/lint/format: `bun run build|dev|preview|lint|format`. Type-check: via editors/ESLint; no script.
- Testing: none configured. If adding Vitest: run all `bunx vitest run`; single `bunx vitest run path/to/file.test.ts -t "test name"`.
- Projects structure: list page `src/pages/projects/index.astro`; detail route `src/pages/projects/[...slug].astro`; layout `src/layouts/ProjectLayout.astro`; card `src/components/projects/ProjectCard.astro`; tech/features components in same folder.
- Projects data: Astro Content Collections from `src/data/projects/<locale>/<slug>/index.mdx` + `image.png`. Schema in `src/content.config.ts` collection `projects` (title, description, image, technologies[], demoUrl?, githubUrl?, completionDate: date, keyFeatures[], order?, draft?).
- Data flow: list page `getCollection("projects")` -> filter drafts -> `filterCollectionByLanguage()` using locale from URL -> sort by `order` -> render `ProjectCard`. Detail page `getStaticPaths()` filters by defaultLocale, returns `props: project`; in page, `render(project)` to get `<Content />` (MDX body) and pass to `ProjectLayout`.
- Slugs/locales: content files live under `src/data/projects/<locale>/...`; `filterCollectionByLanguage` removes locale prefix from `id` so routes are `/projects/<slug>`. Use `slugify` for card links.
- Images: use `astro:assets` Image with MDX-imported `image` path; see `.astro/content-assets.mjs` mapping.
- i18n: configured in `astro.config.mjs` (defaultLocale "en"); keep `siteSettings.json.ts` locales aligned; use `getLocaleFromUrl()` for runtime locale.
- Imports: use tsconfig aliases (`@components/*`, `@js/*`, `@layouts/*`, `@config/*`, `@assets/*`, `@images/*`, `@videos/*`, `@/*`). Order: std, third-party, internal. Prefer `import type` for types.
- Formatting: Prettier is source of truth; run `bun run format`. Keep Tailwind classes tidy; extract repeated patterns.
- Linting: ESLint 9 with astro/typescript-eslint. Relaxed rules: no-explicit-any OFF, no-unused-vars OFF, ban-ts-comment OFF; in .astro, anchor-is-valid OFF. Fix a11y issues regardless.
- Naming: files/folders kebab-case; components PascalCase; vars/functions camelCase; constants UPPER_SNAKE. Astro pages define routes under `src/pages`.
- Types: strictNullChecks on. Prefer explicit return types for exported functions; narrow unknown; avoid any except template glue. Use discriminated unions for variants.
- Error handling: fail fast for config/content issues; show friendly UI messages. Avoid throwing in Astro frontmatter unless build should fail.
- Performance: keep islands small; prefer SSR/static; dynamic import heavy React; images via Astro assets; don’t enable CSS compression in compress() without testing.
- Accessibility: maintain focus states and aria-\* on interactive elements.
- Commit hygiene: small, focused commits; no secrets; run lint+format before commit; respect Docker/Netlify configs.
- Cursor/Copilot: none found (.cursor/rules, .cursorrules, .github/copilot-instructions.md absent). Mirror them here if added later.
