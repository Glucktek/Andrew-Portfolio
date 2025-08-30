import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import { parseString } from 'set-cookie-parser';
import { fields, singleton, collection, config as config$1 } from '@keystatic/core';
import { jsxs, jsx } from 'react/jsx-runtime';
import { wrapper } from '@keystatic/core/content-components';
/* empty css                                               */
export { renderers } from '../../../renderers.mjs';

function makeHandler(_config) {
  return async function keystaticAPIRoute(context) {
    var _context$locals, _ref, _config$clientId, _ref2, _config$clientSecret, _ref3, _config$secret;
    const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;
    const handler = makeGenericAPIRouteHandler({
      ..._config,
      clientId: (_ref = (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_ID) !== null && _ref !== void 0 ? _ref : tryOrUndefined(() => {
        return undefined                                          ;
      }),
      clientSecret: (_ref2 = (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_SECRET) !== null && _ref2 !== void 0 ? _ref2 : tryOrUndefined(() => {
        return undefined                                              ;
      }),
      secret: (_ref3 = (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_SECRET) !== null && _ref3 !== void 0 ? _ref3 : tryOrUndefined(() => {
        return undefined                                ;
      })
    }, {
      slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG"
    });
    const {
      body,
      headers,
      status
    } = await handler(context.request);
    let headersInADifferentStructure = /* @__PURE__ */ new Map();
    if (headers) {
      if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key.toLowerCase())) {
            headersInADifferentStructure.set(key.toLowerCase(), []);
          }
          headersInADifferentStructure.get(key.toLowerCase()).push(value);
        }
      } else if (typeof headers.entries === "function") {
        for (const [key, value] of headers.entries()) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
        if ("getSetCookie" in headers && typeof headers.getSetCookie === "function") {
          const setCookieHeaders2 = headers.getSetCookie();
          if (setCookieHeaders2 !== null && setCookieHeaders2 !== void 0 && setCookieHeaders2.length) {
            headersInADifferentStructure.set("set-cookie", setCookieHeaders2);
          }
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
      }
    }
    const setCookieHeaders = headersInADifferentStructure.get("set-cookie");
    headersInADifferentStructure.delete("set-cookie");
    if (setCookieHeaders) {
      for (const setCookieValue of setCookieHeaders) {
        var _options$sameSite;
        const {
          name,
          value,
          ...options
        } = parseString(setCookieValue);
        const sameSite = (_options$sameSite = options.sameSite) === null || _options$sameSite === void 0 ? void 0 : _options$sameSite.toLowerCase();
        context.cookies.set(name, value, {
          domain: options.domain,
          expires: options.expires,
          httpOnly: options.httpOnly,
          maxAge: options.maxAge,
          path: options.path,
          sameSite: sameSite === "lax" || sameSite === "strict" || sameSite === "none" ? sameSite : void 0
        });
      }
    }
    return new Response(body, {
      status,
      headers: [...headersInADifferentStructure.entries()].flatMap(([key, val]) => val.map((x) => [key, x]))
    });
  };
}
function tryOrUndefined(fn) {
  try {
    return fn();
  } catch {
    return void 0;
  }
}

const KeystaticAdmonition = ({
  variant,
  children
}) => {
  let color;
  if (variant === "tip") {
    color = "#6ee7b7";
  } else if (variant === "caution") {
    color = "#fcd34d";
  } else if (variant === "danger") {
    color = "#fca5a5";
  } else {
    color = "#7dd3fc";
  }
  return /* @__PURE__ */ jsxs("div", { className: "ks-admonition", style: { borderColor: color }, children: [
    /* @__PURE__ */ jsx("h5", { className: "ks-admonition__variant", children: variant }),
    /* @__PURE__ */ jsx("div", { children })
  ] });
};

const Admonition = wrapper({
  label: "Admonition",
  ContentView: (props) => /* @__PURE__ */ jsx(KeystaticAdmonition, { variant: props.value.variant, children: props.children }),
  schema: {
    variant: fields.select({
      label: "Variant",
      options: [
        { value: "info", label: "Info" },
        { value: "tip", label: "Tip" },
        { value: "caution", label: "Caution" },
        { value: "danger", label: "Danger" }
      ],
      defaultValue: "info"
    }),
    // This makes it so you can edit what is inside the admonition
    content: fields.child({
      kind: "block",
      formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
      links: "inherit",
      editIn: "both",
      label: "Admonition Content",
      placeholder: "Enter your admonition content here"
    })
  }
});
const ComponentBlocks = {
  Admonition
};

const Blog = (locale) => collection({
  label: `Blog (${locale.toUpperCase()})`,
  slugField: "title",
  path: `src/data/blog/${locale}/*/`,
  columns: ["title", "pubDate"],
  entryLayout: "content",
  format: { contentField: "content" },
  schema: {
    title: fields.slug({
      name: { label: "Title" },
      slug: {
        label: "SEO-friendly slug",
        description: "Never change the slug once a file is published!"
      }
    }),
    description: fields.text({
      label: "Description",
      validation: { isRequired: true, length: { min: 1, max: 160 } }
    }),
    draft: fields.checkbox({
      label: "Draft",
      description: "Set this post as draft to prevent it from being published."
    }),
    authors: fields.array(
      fields.relationship({
        label: "Post author",
        collection: `authors`
        // authors field in keystatic.config.tsx must match the collection name here (like "authorsEN" or "authorsFR")
        // collection: `authors${locale.toUpperCase()}`,
      }),
      {
        label: "Authors",
        validation: { length: { min: 1 } },
        itemLabel: (props) => props.value || "Please select an author"
      }
    ),
    pubDate: fields.date({ label: "Publish Date" }),
    updatedDate: fields.date({
      label: "Updated Date",
      description: "If you update this post at a later date, put that date here."
    }),
    heroImage: fields.image({
      label: "Hero Image",
      publicPath: "../",
      validation: { isRequired: true }
    }),
    categories: fields.array(fields.text({ label: "Category" }), {
      label: "Categories",
      description: "This is NOT case sensitive.",
      itemLabel: (props) => props.value
      // validation: { length: { min: 1 } },
    }),
    content: fields.mdx({
      label: "Content",
      options: {
        bold: true,
        italic: true,
        strikethrough: true,
        code: true,
        heading: [2, 3, 4, 5, 6],
        blockquote: true,
        orderedList: true,
        unorderedList: true,
        table: true,
        link: true,
        image: {
          directory: `src/data/blog/${locale}/`,
          publicPath: "../"
          // schema: {
          //   title: fields.text({
          //     label: "Caption",
          //     description:
          //       "The text to display under the image in a caption.",
          //   }),
          // },
        },
        divider: true,
        codeBlock: true
      },
      components: {
        Admonition: ComponentBlocks.Admonition
      }
    })
  }
});
const Authors = (locale) => collection({
  label: `Authors ${locale === "" ? "" : `(${locale.toUpperCase()})`} `,
  slugField: "name",
  path: `src/data/authors/${locale}/*/`,
  columns: ["name"],
  entryLayout: "content",
  format: { contentField: "bio" },
  schema: {
    name: fields.slug({
      name: {
        label: "Name",
        validation: {
          isRequired: true
        }
      },
      slug: {
        label: "SEO-friendly slug",
        description: "Never change the slug once this file is published!"
      }
    }),
    avatar: fields.image({
      label: "Author avatar",
      publicPath: "../",
      validation: { isRequired: true }
    }),
    about: fields.text({
      label: "About",
      description: "A short bio about the author",
      validation: { isRequired: true }
    }),
    email: fields.text({
      label: "The author's email",
      description: "This must look something like `you@email.com`",
      validation: { isRequired: true }
    }),
    authorLink: fields.url({
      label: "Author Website or Social Media Link",
      validation: { isRequired: true }
    }),
    bio: fields.mdx({
      label: "Full Bio",
      description: "The author's full bio",
      options: {
        bold: true,
        italic: true,
        strikethrough: true,
        code: true,
        heading: [2, 3, 4],
        blockquote: true,
        orderedList: true,
        unorderedList: true,
        table: false,
        link: true,
        image: {
          directory: "src/data/authors/",
          publicPath: "../"
        },
        divider: true,
        codeBlock: false
      }
    })
  }
});
const OtherPages = (locale) => collection({
  label: `Other Pages (${locale.toUpperCase()})`,
  slugField: "title",
  path: `src/data/otherPages/${locale}/*/`,
  columns: ["title"],
  entryLayout: "content",
  format: { contentField: "content" },
  schema: {
    title: fields.slug({
      name: { label: "Title" },
      slug: {
        label: "SEO-friendly slug",
        description: "Never change the slug once a file is published!"
      }
    }),
    description: fields.text({
      label: "Description",
      validation: { isRequired: true, length: { min: 1, max: 160 } }
    }),
    draft: fields.checkbox({
      label: "Draft",
      description: "Set this page as draft to prevent it from being published."
    }),
    content: fields.mdx({
      label: "Page Contents",
      options: {
        bold: true,
        italic: true,
        strikethrough: true,
        code: true,
        heading: [2, 3, 4, 5, 6],
        blockquote: true,
        orderedList: true,
        unorderedList: true,
        table: true,
        link: true,
        image: {
          directory: `src/data/otherPages/${locale}/`,
          publicPath: "../"
        },
        divider: true,
        codeBlock: true
      },
      components: {
        Admonition: ComponentBlocks.Admonition
      }
    })
  }
});
const Projects = (locale) => collection({
  label: `Projects (${locale.toUpperCase()})`,
  slugField: "title",
  path: `src/data/projects/${locale}/*/`,
  columns: ["title", "completionDate"],
  entryLayout: "content",
  format: { contentField: "content" },
  schema: {
    title: fields.slug({
      name: { label: "Title" },
      slug: {
        label: "SEO-friendly slug",
        description: "Never change the slug once a file is published!"
      }
    }),
    description: fields.text({
      label: "Description",
      validation: { isRequired: true }
    }),
    image: fields.image({
      label: "Project Image",
      publicPath: "../",
      validation: { isRequired: true }
    }),
    technologies: fields.array(fields.text({ label: "Technology" }), {
      label: "Technologies Used",
      itemLabel: (props) => props.value,
      validation: { length: { min: 1 } }
    }),
    demoUrl: fields.url({
      label: "Demo URL",
      description: "Link to live demo if available"
    }),
    githubUrl: fields.url({
      label: "GitHub URL",
      description: "Link to GitHub repository"
    }),
    completionDate: fields.date({
      label: "Completion Date",
      validation: { isRequired: true }
    }),
    keyFeatures: fields.array(fields.text({ label: "Feature" }), {
      label: "Key Features",
      itemLabel: (props) => props.value,
      validation: { length: { min: 1 } }
    }),
    order: fields.number({
      label: "Display Order",
      description: "Optional: Use to control the order of projects (lower numbers appear first)"
    }),
    draft: fields.checkbox({
      label: "Draft",
      description: "Set this project as draft to prevent it from being published."
    }),
    content: fields.mdx({
      label: "Content",
      options: {
        bold: true,
        italic: true,
        strikethrough: true,
        code: true,
        heading: [2, 3, 4, 5, 6],
        blockquote: true,
        orderedList: true,
        unorderedList: true,
        table: true,
        link: true,
        image: {
          directory: `src/data/projects/${locale}/`,
          publicPath: "../"
        },
        divider: true,
        codeBlock: true
      },
      components: {
        Admonition: ComponentBlocks.Admonition
      }
    })
  }
});
const Resume = (locale) => singleton({
  label: `Resume (${locale.toUpperCase()})`,
  path: `src/data/resume/${locale}/resume/index`,
  format: { data: "json" },
  schema: {
    diplomas: fields.array(
      fields.object({
        title: fields.text({ label: "Title" }),
        school: fields.text({ label: "School" }),
        year: fields.number({ label: "Year" })
      }),
      {
        label: "Diplomas",
        itemLabel: (props) => `${props.fields.title.value} - ${props.fields.school.value} (${props.fields.year.value})`
      }
    ),
    certifications: fields.array(
      fields.object({
        title: fields.text({ label: "Title" }),
        year: fields.number({ label: "Year" })
      }),
      {
        label: "Certifications",
        itemLabel: (props) => `${props.fields.title.value} (${props.fields.year.value})`
      }
    ),
    experience: fields.array(
      fields.object({
        title: fields.text({ label: "Title" }),
        company: fields.text({ label: "Company" }),
        companyImage: fields.image({
          label: "Company Logo",
          publicPath: "./index/",
          validation: { isRequired: true }
        }),
        dates: fields.text({ label: "Dates" }),
        location: fields.text({ label: "Location" }),
        responsibilities: fields.array(
          fields.text({ label: "Responsibility" }),
          {
            label: "Responsibilities",
            itemLabel: (props) => props.value
          }
        )
      }),
      {
        label: "Experience",
        itemLabel: (props) => `${props.fields.title.value} at ${props.fields.company.value}`
      }
    ),
    hardSkills: fields.array(
      fields.object({
        skill: fields.text({ label: "Skill" }),
        percentage: fields.number({
          label: "Level (%)",
          description: "Enter a percentage between 0 and 100",
          validation: {
            min: 0,
            max: 100,
            isRequired: true
          }
        })
      }),
      {
        label: "Hard Skills",
        itemLabel: (props) => `${props.fields.skill.value} - ${props.fields.percentage.value}%`
      }
    ),
    softSkills: fields.array(
      fields.object({
        skill: fields.text({
          label: "Skill",
          validation: { isRequired: true }
        }),
        icon: fields.text({
          label: "Icon Image",
          description: "Copy in your favorite emoji like 👑",
          validation: { isRequired: true }
        })
      }),
      {
        label: "Soft Skills",
        itemLabel: (props) => props.fields.skill.value
      }
    ),
    languages: fields.array(
      fields.object({
        language: fields.text({
          label: "Language",
          validation: { isRequired: true }
        }),
        level: fields.number({
          label: "Proficiency Level",
          description: "Enter a value between 1 (basic) and 10 (native)",
          validation: {
            min: 1,
            max: 10,
            isRequired: true
          }
        })
      }),
      {
        label: "Languages",
        itemLabel: (props) => `${props.fields.language.value} - Level ${props.fields.level.value}/10`
      }
    ),
    tools: fields.array(
      fields.object({
        name: fields.text({
          label: "Tool Name",
          validation: { isRequired: true }
        }),
        category: fields.text({
          label: "Category",
          description: "Tool category (e.g., 'Development', 'Design', 'DevOps')",
          validation: { isRequired: true }
        }),
        image: fields.image({
          label: "Tool Logo",
          description: "Logo or icon for the tool",
          publicPath: "./index/",
          validation: { isRequired: true }
        }),
        link: fields.url({
          label: "Tool Website",
          description: "Link to the tool's official website",
          validation: { isRequired: true }
        })
      }),
      {
        label: "Tools & Technologies",
        itemLabel: (props) => `${props.fields.name.value} (${props.fields.category.value})`
      }
    )
  }
});
const Collections = {
  Blog,
  Authors,
  OtherPages,
  Projects,
  Resume
};

const config = config$1({
  // works in local mode in dev, then cloud mode in prod
  storage: { kind: "cloud" },
  // cloud deployment is free to sign up (up to 3 users per team)
  // docs: https://keystatic.com/docs/cloud
  // create a Keystatic Cloud account here: https://keystatic.cloud/
  cloud: { project: "cosmic-themes/voyager" },
  ui: {
    brand: { name: "Cosmic Themes" }
  },
  collections: {
    blogEN: Collections.Blog("en"),
    // for now there is a limitation with keystatic where relationship fields don't work well with i18n features
    // If you need multiple languages here (you might not) just create multiple variants of the same author
    // this might look like "author-1-en" and "author-1-fr"
    authors: Collections.Authors(""),
    projectsEN: Collections.Projects("en"),
    otherPagesEN: Collections.OtherPages("en")
  },
  singletons: {
    resumeEN: Collections.Resume("en")
  }
});

const all = makeHandler({ config });
const ALL = all;

const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  all,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
