# Configuration and Customization Guide

## Configuration Architecture

Voyager uses a layered configuration system that separates site settings, content configuration, framework configuration, and styling configuration. This allows for flexible customization while maintaining type safety and consistency.

## Core Configuration Files

### Site Settings (`src/config/siteSettings.json.ts`)

**Primary Configuration**: Contains global site behavior settings and internationalization setup.

```typescript
// Site behavior configuration
export const siteSettings: SiteSettingsProps = {
  useViewTransitions: false,  // Enable/disable Astro view transitions
  useAnimations: true,        // Enable/disable animations globally
};

// Internationalization configuration
export const locales = ["en"] as const;
export const defaultLocale = "en" as const;

// Locale mapping for date formatting
export const localeMap = {
  en: "en-US",
} as const;

// Language switcher display text
export const languageSwitcherMap = {
  en: "EN",
} as const;
```

**Key Configuration Options**:
- **`useViewTransitions`**: Controls Astro's View Transitions API (may cause performance issues in development)
- **`useAnimations`**: Global animation toggle for performance optimization
- **`locales`**: Array of supported locales (must match `astro.config.mjs`)
- **`defaultLocale`**: Primary language for the site

### Site Data (`src/config/en/siteData.json.ts`)

**Content Configuration**: Contains site metadata and author information.

```typescript
const siteData: SiteDataProps = {
  name: "{ Andrew Gluck }",           // Site branding name
  title: "Andrew Gluck",              // HTML title and meta title
  description: "Building your digital future one line of code at a time",
  
  // Author information for blog posts and meta tags
  author: {
    name: "Andrew Gluck",
    email: "andrew.gluck@glucktek.com",
    twitter: "",                      // Used for Twitter Cards
  },
  
  // Default Open Graph image
  defaultImage: {
    src: "/images/logo.png",
    alt: "Andrew Gluck",
  },
};
```

### Social Links (`src/config/socialLinks.json.ts`)

**Social Media Configuration**: Defines social media profiles and contact links.

```typescript
export const socialLinks: SocialLink[] = [
  { 
    name: "Twitter", 
    url: "https://x.com/glucktek", 
    icon: "tabler/brand-x" 
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/andrew-gluck-452ab295",
    icon: "tabler/brand-linkedin",
  },
  {
    name: "GitHub",
    url: "https://github.com/glucktek",
    icon: "tabler/brand-github",
  },
];
```

**Icon System**: Uses `astro-icon` with Tabler Icons. Available icons: `tabler/*`, `logos/*`, and custom icons in `src/icons/`.

### Navigation Configuration (`src/config/en/navData.json.ts`)

**Navigation Structure**: Defines site navigation with support for dropdowns and mega menus.

```typescript
// Basic navigation link
interface navLinkItem {
  text: string;
  link: string;
  newTab?: boolean;  // Opens in new tab
  icon?: string;     // Astro icon name
}

// Dropdown navigation
interface navDropdownItem {
  text: string;
  dropdown: navLinkItem[];
}

// Mega menu navigation
interface navMegaDropdownItem {
  text: string;
  megaMenuColumns: {
    title: string;
    items: navLinkItem[];
  }[];
}
```

## Framework Configuration

### Astro Configuration (`astro.config.mjs`)

**Primary Framework Settings**: Core Astro configuration including integrations, adapters, and build settings.

```javascript
export default defineConfig({
  // Production site URL (important for SEO)
  site: "https://voyager.cosmicthemes.com",
  
  // Deployment adapter
  adapter: netlify({
    imageCDN: false,  // Use Astro's image optimization instead
  }),
  
  // URL redirects
  redirects: {
    "/admin": "/keystatic",
  },
  
  // Internationalization (must match siteSettings.json.ts)
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: {
      prefixDefaultLocale: false,  // No /en/ prefix for default locale
    },
  },
  
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: "css-variables",  // Uses CSS variables for syntax highlighting
      wrap: true,
    },
  },
  
  // Integrations
  integrations: [
    // Auto-import components into MDX
    AutoImport({
      imports: ["@components/admonition/Admonition.astro"],
    }),
    mdx(),            // MDX support
    react(),          // React islands
    icon(),           // Icon system
    keystatic(),      // CMS integration
    sitemap(),        // Automatic sitemap generation
    compress({        // Asset compression
      HTML: true,
      JavaScript: true,
      CSS: false,     // Can cause issues, disabled
      Image: false,   // Handled by astro:assets
      SVG: false,     // Handled by astro-icon
    }),
  ],
  
  // Vite configuration
  vite: {
    plugins: [tailwindcss()],  // Tailwind CSS v4 integration
  },
});
```

### Content Collections Configuration (`src/content.config.ts`)

**Content Schema Definition**: Defines data structures and validation for all content types.

```typescript
import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// Blog posts schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      authors: z.array(reference("authors")),  // References authors collection
      pubDate: z.string().or(z.date()).transform((val) => new Date(val)),
      updatedDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
      heroImage: image(),  // Optimized image handling
      categories: z.array(z.string().optional()).optional(),
      draft: z.boolean().optional(),
    }),
});

// Export all collections
export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
  otherPages: pagesCollection,
  projects: projectsCollection,
  resume: resumeCollection,
};
```

### TypeScript Configuration (`tsconfig.json`)

**Type System Setup**: Configures TypeScript with strict settings and path aliases.

```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@config/*": ["src/config/*"],
      "@assets/*": ["src/assets/*"],
      "@images/*": ["src/assets/images/*"],
      "@js/*": ["src/js/*"],
      "@/*": ["src/*"]
    }
  }
}
```

## Styling Configuration

### Tailwind CSS Theme (`src/styles/tailwind-theme.css`)

**Design System Configuration**: Defines the visual design system using Tailwind v4's new `@theme` directive.

```css
@theme {
  /* Primary Brand Colors (Generated with OKLCH for better color science) */
  --color-primary-50: oklch(97.29% 0.0149 235.37);
  --color-primary-100: oklch(93.88% 0.0341 235.86);
  --color-primary-500: oklch(67.38% 0.1797 249.79);  /* Main brand color */
  --color-primary-950: oklch(30% 0.0961 260.53);
  
  /* Typography */
  --font-heading: "Archivo Black", var(--font-fallback);
  --font-sans: "InterVariable", var(--font-fallback);
  --font-mono: "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace";
  
  /* Custom Animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-marquee: marquee 70s linear infinite;
  --animate-float: float 6s ease-in-out infinite;
}
```

**Color System Features**:
- **OKLCH Color Space**: Better perceptual uniformity and accessibility
- **CSS Variables**: Dynamic theming support
- **Consistent Scale**: 50-950 range for all color families

### Global Styles (`src/styles/global.css`)

**Base Styling**: Contains CSS reset, typography, and global component styles.

```css
/* CSS Custom Properties for theming */
:root {
  /* Theme colors that adapt to light/dark mode */
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --primary: 262.1 83.3% 57.8%;
  --border: 214.3 31.8% 91.4%;
  /* ... more theme variables */
}

/* Dark theme overrides */
.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  --primary: 263.4 70% 50.4%;
  /* ... dark mode color overrides */
}
```

## CMS Configuration

### Keystatic Configuration (`keystatic.config.tsx`)

**Content Management Setup**: Configures the headless CMS for content editing.

```typescript
export default config({
  // Development: local files, Production: Keystatic Cloud
  storage: import.meta.env.DEV === true 
    ? { kind: "local" } 
    : { kind: "cloud" },
  
  // Keystatic Cloud project configuration
  cloud: { project: "cosmic-themes/voyager" },
  
  // CMS branding
  ui: {
    brand: { name: "Cosmic Themes" },
  },
  
  // Content collections (must match content.config.ts)
  collections: {
    blogEN: Collections.Blog("en"),
    authors: Collections.Authors(""),
    projectsEN: Collections.Projects("en"),
    otherPagesEN: Collections.OtherPages("en"),
  },
  
  // Single-instance content
  singletons: {
    resumeEN: Collections.Resume("en"),
  },
});
```

## Customization Workflows

### Brand Customization

#### 1. Update Site Identity
```typescript
// src/config/en/siteData.json.ts
const siteData: SiteDataProps = {
  name: "Your Name",
  title: "Your Professional Title",
  description: "Your professional tagline",
  author: {
    name: "Your Name",
    email: "your.email@domain.com",
    twitter: "@yourusername",
  },
  defaultImage: {
    src: "/images/your-logo.png",
    alt: "Your Name",
  },
};
```

#### 2. Update Social Links
```typescript
// src/config/socialLinks.json.ts
export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", url: "https://linkedin.com/in/yourprofile", icon: "tabler/brand-linkedin" },
  { name: "GitHub", url: "https://github.com/yourusername", icon: "tabler/brand-github" },
  { name: "Twitter", url: "https://twitter.com/yourusername", icon: "tabler/brand-x" },
];
```

#### 3. Customize Colors
```css
/* src/styles/tailwind-theme.css */
@theme {
  /* Generate your colors at https://uicolors.app/create */
  /* Convert to OKLCH at https://oklch.com/ */
  --color-primary-500: oklch(67.38% 0.1797 249.79);
  /* Update all primary-* variations */
}
```

### Adding New Pages

#### 1. Create Page Component
```astro
---
// src/pages/services.astro
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout 
  title="Services" 
  description="Professional services I offer"
>
  <h1>My Services</h1>
  <!-- Page content -->
</BaseLayout>
```

#### 2. Update Navigation
```typescript
// src/config/en/navData.json.ts
export const navData = [
  { text: "Home", link: "/" },
  { text: "Services", link: "/services" },  // Add new page
  { text: "Projects", link: "/projects" },
  // ... other nav items
];
```

### Internationalization Setup

#### 1. Add New Locale
```typescript
// src/config/siteSettings.json.ts
export const locales = ["en", "es"] as const;  // Add Spanish

export const localeMap = {
  en: "en-US",
  es: "es-ES",  // Add Spanish locale mapping
} as const;

export const languageSwitcherMap = {
  en: "EN",
  es: "ES",  // Add Spanish display text
} as const;
```

#### 2. Update Astro Config
```javascript
// astro.config.mjs
i18n: {
  defaultLocale: "en",
  locales: ["en", "es"],  // Add Spanish
  routing: {
    prefixDefaultLocale: false,
  },
},
```

#### 3. Create Locale-Specific Content
```bash
mkdir -p src/data/blog/es
mkdir -p src/data/projects/es
mkdir -p src/config/es
```

#### 4. Run i18n Configuration Script
```bash
bun run config-i18n
```

### Theme Customization

#### Dark/Light Mode Configuration
The theme system uses CSS custom properties that automatically adapt based on the `.dark` class:

```css
/* Light theme (default) */
:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
}

/* Dark theme */
.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
}
```

#### Custom Animation Configuration
```css
/* src/styles/tailwind-theme.css */
@theme {
  /* Add custom animations */
  --animate-slide-up: slide-up 0.3s ease-out;
  --animate-fade-in: fade-in 0.5s ease-in;
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Performance Configuration

#### Build Optimization
```javascript
// astro.config.mjs
integrations: [
  compress({
    HTML: true,
    JavaScript: true,
    CSS: false,        // Disable if issues occur
    Image: false,      // Let astro:assets handle this
    SVG: false,        // Let astro-icon handle this
  }),
],
```

#### Image Optimization Settings
```typescript
// Built-in optimization via astro:assets
// Configure in astro.config.mjs if needed
experimental: {
  assets: {
    // Image optimization settings
  }
}
```

## Environment Variables

### Development Environment
```bash
# .env.local (for local development)
KEYSTATIC_GITHUB_CLIENT_ID=your_github_client_id
KEYSTATIC_GITHUB_CLIENT_SECRET=your_github_client_secret
KEYSTATIC_SECRET=your_keystatic_secret
```

### Production Environment
Configure these in your deployment platform (Netlify, Vercel, etc.):
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`

## Validation and Type Safety

### Configuration Validation
All configuration files use TypeScript interfaces for type safety:

```typescript
// src/config/types/configDataTypes.ts
export interface SiteDataProps {
  name: string;
  title: string;
  description: string;
  author: {
    name: string;
    email: string;
    twitter: string;
  };
  defaultImage: {
    src: string;
    alt: string;
  };
}
```

### Runtime Validation
Content collections use Zod schemas for runtime validation:

```typescript
// Validation happens automatically during build
const blogPost = await getEntry('blog', 'my-post');  // Fully typed
```

This comprehensive configuration guide provides engineers with complete control over customizing the Voyager portfolio application while maintaining type safety and performance optimization.