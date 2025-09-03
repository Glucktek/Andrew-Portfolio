import { renderers } from "./renderers.mjs";
import { s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs";
import { manifest } from "./manifest_DaneptbS.mjs";
import { createExports } from "@astrojs/netlify/ssr-function.js";

const serverIslandMap = new Map();

const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/404.astro.mjs");
const _page2 = () => import("./pages/api/keystatic/_---params_.astro.mjs");
const _page3 = () => import("./pages/blog.astro.mjs");
const _page4 = () => import("./pages/blog/_---slug_.astro.mjs");
const _page5 = () => import("./pages/categories/_category_.astro.mjs");
const _page6 = () => import("./pages/categories.astro.mjs");
const _page7 = () => import("./pages/contact.astro.mjs");
const _page8 = () => import("./pages/examples/blog-index-2.astro.mjs");
const _page9 = () => import("./pages/examples/blog-post-2.astro.mjs");
const _page10 = () => import("./pages/examples/blog2.astro.mjs");
const _page11 = () => import("./pages/examples/hero-sections.astro.mjs");
const _page12 = () => import("./pages/examples/landing2.astro.mjs");
const _page13 = () => import("./pages/examples/landing3.astro.mjs");
const _page14 = () => import("./pages/examples/pricing-faq.astro.mjs");
const _page15 = () => import("./pages/examples/project-process.astro.mjs");
const _page16 = () => import("./pages/examples/projects-index-2.astro.mjs");
const _page17 = () =>
  import("./pages/examples/testimonial-logo-sections.astro.mjs");
const _page18 = () => import("./pages/keystatic/_---params_.astro.mjs");
const _page19 = () => import("./pages/projects.astro.mjs");
const _page20 = () => import("./pages/projects/_---slug_.astro.mjs");
const _page21 = () => import("./pages/resume.astro.mjs");
const _page22 = () => import("./pages/rss.xml.astro.mjs");
const _page23 = () => import("./pages/work.astro.mjs");
const _page24 = () => import("./pages/index.astro.mjs");
const _page25 = () => import("./pages/_---page_.astro.mjs");
const pageMap = new Map([
  ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/404.astro", _page1],
  ["node_modules/@keystatic/astro/internal/keystatic-api.js", _page2],
  ["src/pages/blog/index.astro", _page3],
  ["src/pages/blog/[...slug].astro", _page4],
  ["src/pages/categories/[category].astro", _page5],
  ["src/pages/categories/index.astro", _page6],
  ["src/pages/contact.astro", _page7],
  ["src/pages/examples/blog-index-2.astro", _page8],
  ["src/pages/examples/blog-post-2.astro", _page9],
  ["src/pages/examples/blog2.astro", _page10],
  ["src/pages/examples/hero-sections.astro", _page11],
  ["src/pages/examples/landing2.astro", _page12],
  ["src/pages/examples/landing3.astro", _page13],
  ["src/pages/examples/pricing-faq.astro", _page14],
  ["src/pages/examples/project-process.astro", _page15],
  ["src/pages/examples/projects-index-2.astro", _page16],
  ["src/pages/examples/testimonial-logo-sections.astro", _page17],
  [
    "node_modules/@keystatic/astro/internal/keystatic-astro-page.astro",
    _page18,
  ],
  ["src/pages/projects/index.astro", _page19],
  ["src/pages/projects/[...slug].astro", _page20],
  ["src/pages/resume.astro", _page21],
  ["src/pages/rss.xml.ts", _page22],
  ["src/pages/work.astro", _page23],
  ["src/pages/index.astro", _page24],
  ["src/pages/[...page].astro", _page25],
]);

const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: () => import("./_noop-actions.mjs"),
  middleware: () => import("./_noop-middleware.mjs"),
});
const _args = {
  middlewareSecret: "0fa57a2e-04c0-4670-88a4-41b27aa274b1",
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = "start";
if (_start in serverEntrypointModule) {
  serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
