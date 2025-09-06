# Content Management and Data Structure

## Content Collections Overview

Voyager uses Astro's Content Collections API to manage structured content with TypeScript schemas. All content is stored as MDX files with frontmatter metadata, providing type safety and validation.

## Content Collection Architecture

### Collection Definitions

#### Blog Collection
**Location**: `src/data/blog/`
**Schema**: Located in `src/content.config.ts:5-27`

```typescript
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      authors: z.array(reference("authors")),
      pubDate: z.string().or(z.date()).transform((val) => new Date(val)),
      updatedDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
      heroImage: image(),
      categories: z.array(z.string().optional()).optional(),
      draft: z.boolean().optional(),
    }),
});
```

**Structure Example**:
```
src/data/blog/en/
├── k3s-raspberry-pi-the-perfect-diy-kubernetes-cluster/
│   ├── index.mdx          # Blog post content
│   └── heroImage.png      # Featured image
└── why-split-dns-is-a-trap/
    ├── index.mdx
    └── heroImage.jpg
```

#### Authors Collection
**Location**: `src/data/authors/`
**Schema**: Located in `src/content.config.ts:30-40`

```typescript
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      avatar: image(),
      about: z.string(),
      email: z.string(),
      authorLink: z.string(),
    }),
});
```

**Structure Example**:
```
src/data/authors/
└── main-author/
    ├── index.mdx          # Author bio and details
    └── avatar.jpeg        # Author profile image
```

#### Projects Collection
**Location**: `src/data/projects/`
**Schema**: Located in `src/content.config.ts:54-69`

```typescript
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      technologies: z.array(z.string()),
      demoUrl: z.string().url().optional(),
      githubUrl: z.string().url().optional(),
      completionDate: z.date(),
      keyFeatures: z.array(z.string()),
      order: z.number().optional(),
      draft: z.boolean().optional(),
    }),
});
```

**Structure Example**:
```
src/data/projects/en/
├── argocd-hub-spoke-automation/
│   ├── index.mdx          # Project details
│   └── image.png          # Project showcase image
├── custom-report-generator/
│   ├── index.mdx
│   └── image.png
└── portfolio-website/
    ├── index.mdx
    └── image.png
```

#### Resume Collection
**Location**: `src/data/resume/`
**Schema**: Located in `src/content.config.ts:72-126`

```typescript
const resumeCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{json,jsonc}", base: "./src/data/resume" }),
  schema: ({ image }) =>
    z.object({
      diplomas: z.array(z.object({
        title: z.string(),
        school: z.string(),
        year: z.number(),
      })),
      certifications: z.array(z.object({
        title: z.string(),
        year: z.number(),
      })),
      experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        companyImage: image(),
        dates: z.string(),
        location: z.string(),
        responsibilities: z.array(z.string()),
      })),
      hardSkills: z.array(z.object({
        skill: z.string(),
        percentage: z.number().min(0).max(100),
      })),
      softSkills: z.array(z.object({
        skill: z.string(),
        icon: z.string(),
      })),
      languages: z.array(z.object({
        language: z.string(),
        level: z.number().min(1).max(10),
      })),
      tools: z.array(z.object({
        name: z.string(),
        category: z.string(),
        image: image(),
        link: z.string().url(),
      })),
    }),
});
```

**Structure Example**:
```
src/data/resume/en/
└── resume/
    └── index.json         # Structured resume data
```

#### Other Pages Collection
**Location**: `src/data/otherPages/`
**Schema**: Located in `src/content.config.ts:43-51`

Simple pages for general content like privacy policies, about pages, etc.

## Content Creation Workflows

### Using Keystatic CMS

#### Local Development Mode
1. **Start Development Server**:
   ```bash
   bun run dev
   ```

2. **Access CMS Interface**:
   - Navigate to `http://localhost:4321/keystatic`
   - Or use the `/admin` redirect

3. **Content Management**:
   - Create new content using the visual editor
   - Edit existing content with live preview
   - Upload and manage images
   - Set content status (draft/published)

#### Cloud Mode (Production)
- **Keystatic Cloud**: Integrated with GitHub for content management
- **Authentication**: GitHub OAuth for secure access
- **Collaboration**: Multiple editors can work simultaneously
- **Version Control**: All changes tracked in Git

### Manual Content Creation

#### Blog Post Creation
1. **Create Directory Structure**:
   ```bash
   mkdir -p src/data/blog/en/my-new-post
   cd src/data/blog/en/my-new-post
   ```

2. **Create Content File** (`index.mdx`):
   ```mdx
   ---
   title: "My New Blog Post"
   description: "A compelling description of the post content"
   draft: false
   authors:
     - main-author
   pubDate: 2024-01-15
   heroImage: ./heroImage.jpg
   categories:
     - Technology
     - Tutorial
   ---

   ## Introduction
   
   Your blog content goes here...
   ```

3. **Add Featured Image**:
   - Add `heroImage.jpg` (or .png) to the same directory
   - Image will be automatically optimized during build

#### Project Creation
1. **Create Project Directory**:
   ```bash
   mkdir -p src/data/projects/en/my-project
   cd src/data/projects/en/my-project
   ```

2. **Create Project File** (`index.mdx`):
   ```mdx
   ---
   title: "My Awesome Project"
   description: "Brief project description for listings"
   image: ./image.png
   technologies:
     - React
     - TypeScript
     - Tailwind CSS
   demoUrl: "https://demo.example.com"
   githubUrl: "https://github.com/user/project"
   completionDate: 2024-01-15
   keyFeatures:
     - "Feature one description"
     - "Feature two description"
     - "Feature three description"
   order: 1
   draft: false
   ---

   ## Project Overview
   
   Detailed project description...
   ```

## Data Access Patterns

### Querying Collections

#### Getting All Items
```typescript
import { getCollection } from 'astro:content';

// Get all published blog posts
const blogPosts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});

// Get all projects, sorted by order
const projects = await getCollection('projects', ({ data }) => {
  return data.draft !== true;
}).sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
```

#### Getting Single Items
```typescript
import { getEntry } from 'astro:content';

// Get specific blog post
const post = await getEntry('blog', 'en/my-post-slug');

// Get author information
const author = await getEntry('authors', 'main-author');
```

#### Collection References
```typescript
// Blog posts reference authors
const post = await getEntry('blog', 'my-post');
const authorData = await getEntry('authors', post.data.authors[0]);
```

### Utility Functions

#### Blog Utilities (`src/js/blogUtils.ts`)
- **Post Filtering**: Filter by category, author, date
- **Pagination**: Generate paginated post lists
- **Related Posts**: Find related content
- **Category Management**: Extract and organize categories

#### Locale Utilities (`src/js/localeUtils.ts`)
- **Language Filtering**: Filter content by locale
- **Date Formatting**: Locale-aware date formatting
- **URL Generation**: Locale-specific URLs

#### Asset Utilities (`src/js/assetUtils.ts`)
- **Image Processing**: Optimize and resize images
- **Path Resolution**: Resolve asset paths
- **Format Conversion**: Convert image formats

## Image and Asset Management

### Image Optimization

#### Automatic Processing
- **Format Conversion**: Automatic WebP/AVIF generation
- **Responsive Images**: Multiple sizes generated
- **Lazy Loading**: Built-in lazy loading support
- **Compression**: Optimal compression for web delivery

#### Image Usage Patterns
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Optimized image with responsive sizes -->
<Image 
  src={heroImage} 
  alt="Hero image description"
  width={800}
  height={400}
  loading="lazy"
/>
```

### Asset Organization

#### Static Assets (`public/`)
- **Favicons**: `/public/favicons/`
- **Documents**: `/public/Andrew-Gluck-Resume-2025.pdf`
- **Root Files**: `robots.txt`, `sitemap.xml`

#### Source Assets (`src/assets/`)
- **Images**: Organized by feature/component
- **Icons**: SVG icons with categories
- **Fonts**: Local font files if needed

## Content Validation and Type Safety

### Schema Validation
All content is validated against Zod schemas during build:

```typescript
// Example validation error
Error: [object Object] does not match the collection schema.
  title: Required
  description: Required
  pubDate: Expected date, received string
```

### TypeScript Integration
Content collections provide full TypeScript support:

```typescript
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;
type Project = CollectionEntry<'projects'>;
type Author = CollectionEntry<'authors'>;

// Type-safe content access
function formatBlogPost(post: BlogPost) {
  return {
    title: post.data.title,        // ✅ Type-safe
    publishDate: post.data.pubDate, // ✅ Already a Date object
    author: post.data.authors[0],   // ✅ Reference type
  };
}
```

### Draft Content Handling
Content marked as `draft: true` is excluded from production builds:

```typescript
// Filter out draft content
const publishedPosts = await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
});
```

## Internationalization (i18n) Structure

### Current Setup
- **Default Locale**: English (`en`)
- **Content Structure**: All content organized by locale
- **Extensible**: Ready for additional languages

### Adding New Locales

1. **Update Configuration**:
   ```typescript
   // src/config/siteSettings.json.ts
   export const locales = ["en", "es", "fr"] as const;
   ```

2. **Create Locale Content**:
   ```bash
   mkdir -p src/data/blog/es
   mkdir -p src/data/projects/es
   mkdir -p src/data/resume/es
   ```

3. **Update Astro Config**:
   ```javascript
   // astro.config.mjs
   i18n: {
     defaultLocale: "en",
     locales: ["en", "es", "fr"],
   }
   ```

## Performance Considerations

### Content Loading
- **Static Generation**: All content pre-processed at build time
- **Incremental Builds**: Only changed content reprocessed
- **Asset Optimization**: Images optimized during build
- **Memory Efficiency**: Large collections processed in chunks

### Caching Strategy
- **Build Cache**: Content collections cached between builds
- **Asset Cache**: Processed images cached
- **Browser Cache**: Optimized cache headers for static content

This comprehensive content management documentation provides engineers with everything needed to understand, create, and manage content within the Voyager portfolio application.