# Development Workflow and Build Process

## Development Environment Setup

### Prerequisites
- **Bun**: v1.0+ (recommended) or Node.js 18+
- **Git**: Version control
- **VS Code**: Recommended editor with Astro extension

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd Andrew-Portfolio

# Install dependencies
bun install

# Start development server
bun run dev
```

### Development Server
- **Local URL**: `http://localhost:4321`
- **CMS Access**: `http://localhost:4321/keystatic`
- **Hot Reload**: Automatic on file changes
- **Error Overlay**: Detailed error information in browser

## Development Scripts

### Core Scripts
```bash
# Development
bun run dev          # Start dev server with hot reload
bun run start        # Alias for dev

# Building
bun run build        # Production build
bun run preview      # Preview production build locally

# Code Quality
bun run lint         # ESLint code analysis
bun run format       # Prettier code formatting

# Configuration
bun run config-i18n     # Configure internationalization
bun run remove-keystatic # Remove Keystatic CMS integration
```

### Advanced Scripts
```bash
# TypeScript checking (manual)
bunx tsc --noEmit

# Dependency updates
bun update

# Cache clearing
rm -rf .astro dist node_modules/.cache
```

## File Watching and Hot Reload

### Watched Files
- **Astro Components**: `.astro` files
- **TypeScript**: `.ts`, `.tsx` files
- **Markdown**: `.md`, `.mdx` files
- **Styles**: `.css` files
- **Configuration**: `astro.config.mjs`, `tsconfig.json`

### Hot Reload Behavior
- **Component Changes**: Instant visual updates
- **Content Changes**: Automatic page refresh
- **Configuration Changes**: Server restart required
- **Asset Changes**: Cache invalidation and reload

## Build Process Deep Dive

### Development Build Pipeline

```
Source Files
    ↓
TypeScript Compilation
    ↓
Component Processing
    ↓
Asset Bundling
    ↓
Dev Server (Hot Reload)
```

#### Development Optimizations
- **Fast Refresh**: React component state preservation
- **Incremental Compilation**: Only changed files recompiled
- **Source Maps**: Debugging support
- **Error Boundaries**: Graceful error handling

### Production Build Pipeline

```
Source Files
    ↓
TypeScript Type Checking
    ↓
Content Collection Processing
    ↓
Component Compilation (Astro → HTML)
    ↓
Asset Optimization
    ↓
JavaScript Bundling & Minification
    ↓
CSS Processing & Optimization
    ↓
Static HTML Generation
    ↓
Build Artifacts (dist/)
```

#### Production Optimizations
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Automatic chunking
- **Asset Optimization**: Image compression and format conversion
- **Minification**: HTML, CSS, JavaScript compression
- **Cache Headers**: Optimal caching strategies

### Build Artifacts

#### Output Structure
```
dist/
├── _astro/          # Bundled assets with hashes
│   ├── *.css        # Optimized stylesheets
│   ├── *.js         # JavaScript bundles
│   └── *.woff2      # Font files
├── images/          # Optimized images
├── favicons/        # Favicon variants
├── *.html           # Static HTML pages
├── sitemap.xml      # Generated sitemap
└── rss.xml          # RSS feed
```

#### Asset Processing
- **Images**: WebP conversion, responsive sizes, lazy loading
- **Fonts**: Subsetting, preloading, optimization
- **Icons**: SVG optimization and sprite generation
- **CSS**: Purging, minification, critical CSS extraction

## Content Processing Workflow

### Content Collection Pipeline

```
Keystatic CMS
    ↓
MDX Files (src/data/)
    ↓
Schema Validation (Zod)
    ↓
Content Collection API
    ↓
Static Page Generation
```

### Content Processing Steps

1. **Content Creation**: Authors use Keystatic CMS interface
2. **File Generation**: Content saved as MDX files with frontmatter
3. **Schema Validation**: Zod schemas validate content structure
4. **Collection Building**: Astro processes collections during build
5. **Page Generation**: Static HTML pages generated for each piece of content

### MDX Processing
- **Frontmatter Parsing**: YAML metadata extraction
- **Component Integration**: Custom components in MDX
- **Syntax Highlighting**: Code blocks with Shiki
- **Image Optimization**: Automatic image processing

## Development Workflows

### Feature Development Workflow

1. **Branch Creation**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Development**
   ```bash
   bun run dev
   # Make changes, test in browser
   ```

3. **Code Quality**
   ```bash
   bun run lint
   bun run format
   ```

4. **Build Testing**
   ```bash
   bun run build
   bun run preview
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### Content Creation Workflow

1. **Local Development**
   ```bash
   bun run dev
   # Navigate to http://localhost:4321/keystatic
   ```

2. **Content Creation**
   - Use Keystatic interface to create/edit content
   - Preview changes in real-time
   - Content automatically saved to git

3. **Review and Publish**
   ```bash
   git add src/data/
   git commit -m "content: add new blog post"
   ```

### Chat API Development Mode

The portfolio includes a chat interface powered by AI that requires API authentication for security. For local development, you can enable dev mode to bypass authentication requirements:

#### Setup Dev Mode
1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Configure dev mode variables**:
   ```bash
   # In your .env file
   INTERNAL_API_TOKEN=your_secure_token_here
   PUBLIC_INTERNAL_API_TOKEN=your_secure_token_here  # Same as above
   PUBLIC_DEV_MODE=true  # Set to 'false' to disable dev mode
   INTERNAL_API_DEV_BYPASS=0  # Keep as 0 for header-based auth
   ```

#### How Dev Mode Works
- **Development Environment**: When `NODE_ENV !== "production"` AND `PUBLIC_DEV_MODE !== "false"`, authentication is completely skipped
- **Manual Override**: Set `PUBLIC_DEV_MODE=false` to disable dev mode even in development
- **Production Safety**: In production, authentication is always required
- **Clean Separation**: Dev mode check happens before any authentication logic runs

#### Testing Chat Functionality
- Open the chat interface in your browser
- Send test messages to verify API connectivity
- Check browser network tab for proper header transmission
- Monitor console for any authentication errors

### Bug Fix Workflow

1. **Issue Identification**
   - Reproduce bug in development environment
   - Check browser console for errors
   - Review build logs if build-related

2. **Debugging Tools**
   ```bash
   # Enable debug mode
   DEBUG=astro:* bun run dev
   
   # Type checking
   bunx tsc --noEmit
   
   # Lint checking
   bun run lint
   ```

3. **Fix Implementation**
   - Make minimal necessary changes
   - Test fix thoroughly
   - Verify no regressions

## Performance Monitoring

### Development Performance

#### Metrics to Monitor
- **Dev Server Startup Time**: Should be under 3 seconds
- **Hot Reload Speed**: Changes should reflect in under 1 second
- **TypeScript Compilation**: Should complete without errors
- **Memory Usage**: Monitor for memory leaks during development

#### Performance Tools
```bash
# Bundle analysis
bunx astro build --verbose

# Performance profiling
bun run build --analyze

# Memory monitoring
node --inspect bun run dev
```

### Build Performance

#### Build Metrics
- **Build Time**: Target under 2 minutes for full build
- **Bundle Size**: Monitor JavaScript bundle sizes
- **Image Optimization**: Track image compression ratios
- **Cache Hit Rates**: Monitor incremental build efficiency

#### Optimization Strategies
- **Incremental Builds**: Only rebuild changed content
- **Parallel Processing**: Utilize multiple CPU cores
- **Cache Optimization**: Leverage build caches effectively
- **Asset Preloading**: Optimize critical resource loading

## Testing Strategy

### Manual Testing Checklist

#### Development Testing
- [ ] Pages load correctly in dev server
- [ ] Hot reload works for all file types
- [ ] Navigation functions properly
- [ ] Forms submit successfully
- [ ] Mobile responsiveness
- [ ] Dark/light theme switching

#### Build Testing
```bash
# Full build test
bun run build

# Preview production build
bun run preview

# Check for build warnings/errors
# Verify all pages accessible
# Test performance with dev tools
```

#### Cross-Browser Testing
- **Chrome**: Primary development browser
- **Firefox**: Secondary testing
- **Safari**: Mac/iOS compatibility
- **Edge**: Windows compatibility

### Automated Testing Setup

While no testing framework is currently configured, here's how to add testing:

#### Adding Vitest
```bash
bun add -d vitest @vitest/ui
```

#### Test Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## Troubleshooting Guide

### Common Development Issues

#### Port Conflicts
```bash
# Check what's using port 4321
lsof -i :4321

# Use different port
bun run dev --port 3000
```

#### Cache Issues
```bash
# Clear Astro cache
rm -rf .astro

# Clear all caches
rm -rf .astro dist node_modules/.cache
bun install
```

#### TypeScript Errors
```bash
# Check types manually
bunx tsc --noEmit

# Restart TypeScript in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### Build Failures
```bash
# Verbose build output
bun run build --verbose

# Check for memory issues
node --max-old-space-size=4096 $(which bun) run build
```

### Performance Issues

#### Slow Development Server
1. **Check File Watchers**: Ensure file watcher limits aren't exceeded
2. **Disable Extensions**: Temporarily disable VS Code extensions
3. **Clear Cache**: Remove `.astro` directory
4. **Check Memory**: Monitor RAM usage

#### Slow Builds
1. **Analyze Bundle**: Use `--verbose` flag to identify bottlenecks
2. **Optimize Images**: Reduce image sizes before processing
3. **Check Dependencies**: Remove unused dependencies
4. **Parallel Processing**: Ensure multi-core utilization

### Debugging Tools

#### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor asset loading performance
- **Performance**: Profile page load times
- **Lighthouse**: Audit performance, accessibility, SEO

#### VS Code Debugging
- **Astro Extension**: Syntax highlighting and IntelliSense
- **TypeScript**: Real-time type checking
- **Error Lens**: Inline error display
- **Auto Import**: Automatic import suggestions

This comprehensive development workflow documentation ensures engineers can efficiently work with the Voyager portfolio application while maintaining code quality and performance standards.