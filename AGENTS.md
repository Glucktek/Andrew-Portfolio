# AGENTS.md - Development Guide

## Available Tools by Category

### 1. File & Code Operations
```json
{
  "file_operations": {
    "read": "Read file contents with line numbers",
    "write": "Write/create new files (requires reading first for existing files)",
    "edit": "Make exact string replacements in files",
    "list": "List files and directories with optional ignore patterns",
    "glob": "Fast file pattern matching with glob patterns",
    "grep": "Search file contents using regex patterns"
  }
}
```

### 2. Development & Build Tools
```json
{
  "development_tools": {
    "bash": "Execute commands, run builds, tests, linting, git operations",
    "task": "Launch specialized agents for complex multi-step tasks",
    "todowrite": "Create and manage structured task lists",
    "todoread": "Read current todo list status"
  }
}
```

### 3. External Resources & Documentation
```json
{
  "external_resources": {
    "webfetch": "Fetch and analyze web content (HTML to markdown)",
    "context7_resolve_library_id": "Resolve package names to Context7 library IDs",
    "context7_get_library_docs": "Fetch up-to-date library documentation",
    "grep_searchGitHub": "Search real-world code examples from GitHub repos"
  }
}
```

### 4. Project-Specific Commands
```json
{
  "project_commands": {
    "build": "bun run build",
    "dev": "bun run dev", 
    "lint": "bun run lint",
    "format": "bun run format",
    "preview": "bun run preview",
    "typecheck": "bun run typecheck"
  }
}
```

### 5. Code Style & Conventions
```json
{
  "code_conventions": {
    "framework": "Astro with TypeScript, React components, TailwindCSS",
    "import_paths": "Use aliases: @components/*, @js/*, @layouts/*, @config/*, @assets/*, @/*",
    "file_structure": "Components in src/components/, utilities in src/js/, layouts in src/layouts/",
    "naming": "kebab-case for files/folders, PascalCase for components, camelCase for variables",
    "eslint_rules": "@typescript-eslint/no-explicit-any: off, @typescript-eslint/no-unused-vars: off",
    "astro_components": "Use --- frontmatter for imports/logic, follow existing patterns",
    "typescript": "Strict null checks enabled, JSX with React import source",
    "comments": "JSDoc style for functions with examples (see blogUtils.ts pattern)"
  }
}
```

## Project Architecture

- **Base**: Astro SSG portfolio with Keystatic CMS
- **Features**: i18n support, blog functionality, resume system
- **Package Manager**: bun for all operations
- **Styling**: TailwindCSS v4 with custom theme and animations
- **Testing**: No framework configured - add tests when implementing new features
- **Deployment**: Netlify-ready with Docker support

## Tools and Technologies

### Frontend Technologies
```json
{
  "core_frameworks": {
    "astro": "Static site generator with island architecture",
    "react": "Component library for interactive elements",
    "typescript": "Type-safe JavaScript with strict null checks",
    "tailwindcss": "Utility-first CSS framework v4"
  },
  "ui_libraries": {
    "starwind": "Custom component library (accordion, tabs, etc.)",
    "tabler_icons": "Icon system for UI elements",
    "aos": "Animate on scroll library"
  }
}
```

### Backend & Content Management
```json
{
  "cms_and_content": {
    "keystatic": "Git-based CMS for content management",
    "markdown": "Content format with frontmatter",
    "i18n": "Internationalization support",
    "rss": "RSS feed generation"
  },
  "data_handling": {
    "json_ld": "Structured data for SEO",
    "astro_collections": "Type-safe content collections",
    "dynamic_imports": "Code splitting and lazy loading"
  }
}
```

### Development Infrastructure
```json
{
  "build_tools": {
    "bun": "Fast JavaScript runtime and package manager",
    "astro_build": "Static site generation and optimization",
    "eslint": "Code linting with TypeScript rules",
    "typescript_compiler": "Type checking and compilation"
  },
  "deployment": {
    "netlify": "Primary deployment platform",
    "docker": "Containerization support",
    "static_hosting": "CDN-optimized static files"
  }
}
```

### SEO & Performance
```json
{
  "seo_optimization": {
    "meta_tags": "Dynamic meta tag generation",
    "sitemap": "Automatic sitemap generation",
    "robots_txt": "Search engine crawling rules",
    "canonical_urls": "Duplicate content prevention"
  },
  "performance": {
    "image_optimization": "Astro Image component",
    "code_splitting": "Dynamic imports and lazy loading",
    "css_optimization": "Tailwind purging and minification",
    "static_generation": "Pre-built pages for fast loading"
  }
}
```

### Analytics & Monitoring
```json
{
  "tracking": {
    "cookie_consent": "GDPR-compliant cookie management",
    "social_sharing": "Share buttons for content",
    "contact_forms": "Form handling and validation"
  },
  "quality_assurance": {
    "typescript_strict": "Strict type checking",
    "eslint_rules": "Code quality enforcement",
    "build_validation": "Compile-time error checking"
  }
}
```

## Workflow Guidelines

1. **Planning**: Use `todowrite` for complex multi-step tasks
2. **Search**: Use `grep` and `glob` for code exploration
3. **Implementation**: Follow existing patterns in `src/components/`
4. **Quality**: Always run `bun run lint` and `bun run format` after changes
5. **Testing**: Add appropriate tests for new features
6. **Documentation**: Update this file when adding new tools or conventions

