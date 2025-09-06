# Deployment and Environment Setup

## Deployment Overview

Voyager is configured for multiple deployment strategies, with Netlify as the primary target. The application supports containerized deployment, traditional hosting, and various cloud platforms through its static site generation capabilities.

## Netlify Deployment (Primary)

### Configuration

The application is pre-configured for Netlify deployment with the `@astrojs/netlify` adapter.

#### Netlify Settings
- **Build Command**: `bun run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+ (Bun preferred)

#### Netlify Configuration (`astro.config.mjs`)
```javascript
import netlify from "@astrojs/netlify";

export default defineConfig({
  adapter: netlify({
    imageCDN: false,  // Use Astro's image optimization instead of Netlify's
  }),
  site: "https://voyager.cosmicthemes.com",  // Update to your domain
});
```

#### Automatic Headers Configuration
Cache headers are automatically configured in `.netlify/v1/config.json`:
```json
{
  "headers": [
    {
      "for": "/_astro/*",
      "values": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

### Deployment Steps

#### 1. Repository Setup
```bash
# Connect your repository to Netlify
# Either through the Netlify dashboard or Netlify CLI

# Install Netlify CLI (optional)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init
```

#### 2. Environment Variables
Configure in Netlify dashboard under Site Settings > Environment Variables:

**Required for Keystatic CMS**:
- `KEYSTATIC_GITHUB_CLIENT_ID`: GitHub OAuth app client ID
- `KEYSTATIC_GITHUB_CLIENT_SECRET`: GitHub OAuth app secret
- `KEYSTATIC_SECRET`: Random secret for signing sessions

**Optional**:
- `ASTRO_STUDIO_APP_TOKEN`: If using Astro Studio (database)

#### 3. Build Settings
In Netlify dashboard under Site Settings > Build & Deploy:
- **Build Command**: `bun run build`
- **Publish Directory**: `dist`
- **Package Manager**: Bun (if available) or npm

#### 4. Domain Configuration
1. **Custom Domain**: Set up your domain in Site Settings > Domain Management
2. **Update Site URL**: Update `site` field in `astro.config.mjs`
3. **Update Site Data**: Update URLs in `src/config/en/siteData.json.ts`

### Netlify Features

#### Automatic SSL
- SSL certificates automatically provisioned
- HTTPS redirects enabled by default

#### Form Handling
Built-in form processing (if using Netlify forms):
```html
<form netlify>
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <button type="submit">Submit</button>
</form>
```

#### Edge Functions (Optional)
Support for Netlify Edge Functions for dynamic functionality:
```typescript
// netlify/edge-functions/hello.ts
export default async (request: Request) => {
  return new Response("Hello from the edge!");
};
```

## Docker Deployment

### Docker Configuration

#### Dockerfile
Multi-stage build for optimal image size:
```dockerfile
# Stage 1: Build with Bun
FROM oven/bun:1.2 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
services:
  astro-app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:80"  # Map port 3000 to container port 80
```

### Docker Deployment Steps

#### 1. Build and Run
```bash
# Build the Docker image
docker build -t voyager-portfolio .

# Run the container
docker run -p 3000:80 voyager-portfolio

# Or use Docker Compose
docker-compose up -d
```

#### 2. Production Docker Deployment
```bash
# Build for production
docker build -t voyager-portfolio:latest .

# Tag for registry
docker tag voyager-portfolio:latest your-registry.com/voyager-portfolio:latest

# Push to registry
docker push your-registry.com/voyager-portfolio:latest

# Deploy to production server
docker run -d \
  --name voyager-portfolio \
  -p 80:80 \
  --restart unless-stopped \
  your-registry.com/voyager-portfolio:latest
```

## Alternative Deployment Platforms

### Vercel Deployment

#### 1. Install Vercel Adapter
```bash
bun add @astrojs/vercel
```

#### 2. Update Astro Config
```javascript
import vercel from "@astrojs/vercel/static";

export default defineConfig({
  adapter: vercel(),
  site: "https://your-app.vercel.app",
});
```

#### 3. Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### GitHub Pages Deployment

#### 1. Install GitHub Pages Adapter
```bash
bun add @astrojs/github-pages
```

#### 2. Update Configuration
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://username.github.io',
  base: '/repository-name',  // If deploying to a project page
});
```

#### 3. GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: oven-sh/setup-bun@v1
    - run: bun install
    - run: bun run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Cloudflare Pages Deployment

#### 1. Install Cloudflare Adapter
```bash
bun add @astrojs/cloudflare
```

#### 2. Update Configuration
```javascript
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare(),
  site: "https://your-app.pages.dev",
});
```

#### 3. Deploy via Dashboard
1. Connect GitHub repository in Cloudflare Pages dashboard
2. Set build command: `bun run build`
3. Set output directory: `dist`

## Environment Management

### Development Environment

#### Local Setup
```bash
# Clone repository
git clone <repository-url>
cd voyager-portfolio

# Install dependencies
bun install

# Start development server
bun run dev
```

#### Environment Variables
Create `.env.local` for local development:
```bash
# Keystatic CMS (optional for local development)
KEYSTATIC_GITHUB_CLIENT_ID=your_github_client_id
KEYSTATIC_GITHUB_CLIENT_SECRET=your_github_client_secret
KEYSTATIC_SECRET=your_random_secret

# Other environment variables
ASTRO_STUDIO_APP_TOKEN=your_astro_studio_token
```

### Staging Environment

#### Branch-Based Deployment
Set up automatic staging deployments:

**Netlify Branch Deploys**:
1. Enable branch deploys in Site Settings
2. Configure branch deploy contexts
3. Set environment variables for staging

**Preview URLs**:
- Main branch: `https://main--your-site.netlify.app`
- Feature branches: `https://feature-branch--your-site.netlify.app`

### Production Environment

#### Pre-deployment Checklist
- [ ] Update `site` URL in `astro.config.mjs`
- [ ] Configure production environment variables
- [ ] Test build locally: `bun run build && bun run preview`
- [ ] Verify all images and assets load correctly
- [ ] Test form submissions (if applicable)
- [ ] Check SEO meta tags and Open Graph data

#### Performance Monitoring
```bash
# Audit production build
bun run build
npx lighthouse http://localhost:4321 --view

# Analyze bundle size
bun run build --analyze
```

## SSL and Security

### SSL Configuration

#### Netlify SSL
- Automatic SSL certificates via Let's Encrypt
- Custom domain SSL included
- HTTPS redirects enabled by default

#### Custom SSL
For custom hosting, ensure:
1. Valid SSL certificate installation
2. HTTPS redirects configured
3. Security headers properly set

### Security Headers

#### Netlify Headers
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

#### Nginx Security Headers
```nginx
# For custom Nginx deployment
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## Content Delivery Network (CDN)

### Built-in CDN Features

#### Netlify CDN
- Global edge locations
- Automatic asset optimization
- Image transformation on-demand
- Asset fingerprinting for cache busting

#### Asset Optimization
```javascript
// astro.config.mjs - Assets automatically optimized
integrations: [
  compress({
    HTML: true,
    JavaScript: true,
    CSS: false,  // Handled by Tailwind
    Image: false,  // Handled by astro:assets
  }),
],
```

### Performance Optimization

#### Cache Strategy
- **Static Assets**: 1 year cache (`_astro/*` files)
- **HTML Pages**: Short cache with revalidation
- **Images**: Optimized and cached at CDN edge

#### Performance Monitoring
```bash
# Production performance audit
npx lighthouse https://your-site.com --view

# Core Web Vitals monitoring
npx @lhci/cli autorun
```

## Backup and Recovery

### Content Backup

#### Git-Based Content
All content is stored in Git, providing automatic versioning and backup:
```bash
# Content is automatically backed up in Git
git log --oneline src/data/  # View content change history
```

#### Database Backup (if applicable)
```bash
# If using external databases
# Set up regular automated backups
# Document restoration procedures
```

### Disaster Recovery

#### Site Restoration
1. **Repository Recovery**: Clone from backup repository
2. **Environment Setup**: Restore environment variables
3. **Deployment**: Deploy to new environment
4. **DNS Update**: Point domain to new deployment

#### Recovery Testing
```bash
# Test restoration process
git clone <backup-repository>
cd restored-site
bun install
bun run build
bun run preview  # Verify everything works
```

## Monitoring and Maintenance

### Uptime Monitoring
- **Netlify Analytics**: Built-in uptime monitoring
- **Third-party Services**: UptimeRobot, Pingdom, etc.
- **Status Checks**: Automated health checks

### Performance Monitoring
```bash
# Regular performance audits
npm install -g lighthouse
lighthouse https://your-site.com --output=json > performance-report.json

# Bundle size monitoring
npm install -g bundlesize
bundlesize  # Configure in package.json
```

### Update Management
```bash
# Regular dependency updates
bun update

# Security audits
bun audit

# Build verification after updates
bun run build
bun run preview
```

This comprehensive deployment guide ensures engineers can successfully deploy and maintain the Voyager portfolio application across various platforms while maintaining optimal performance and security.