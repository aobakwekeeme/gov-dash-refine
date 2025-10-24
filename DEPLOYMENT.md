# Deployment Guide

This guide covers deploying the Spaza Shop Registration & Management System (SSRMS) to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Deployment Platforms](#deployment-platforms)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js v18 or higher
- [ ] Access to Lovable Cloud (Supabase backend)
- [ ] Production domain (optional)
- [ ] SSL certificate (usually provided by hosting platform)

## Build Configuration

### 1. Configure Build Script

Ensure `package.json` includes:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

### 2. Configure Vite

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: "::",
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Set to true for debugging production issues
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment Platforms

### Option 1: Lovable Cloud (Recommended)

Lovable provides automatic deployment for projects:

1. **Automatic Deployment**
   - Push changes to your repository
   - Lovable automatically builds and deploys
   - No manual configuration needed

2. **Custom Domain** (Paid plans)
   - Navigate to Project > Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed
   - SSL certificates are automatic

3. **Environment Variables**
   - Already configured automatically
   - No manual setup needed
   - Includes Supabase integration

### Option 2: Vercel

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Configure Project**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   
   Add in Vercel Dashboard > Project Settings > Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: Netlify

1. **Via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build project
   npm run build
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

2. **Via Netlify Dashboard**
   - Connect your Git repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables
   - Deploy

3. **netlify.toml Configuration**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [build.environment]
     NODE_VERSION = "18"
   ```

### Option 4: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/The-Genesis",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Configure vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/The-Genesis/',
     // ... other config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 5: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Environment Variables

### Required Variables

All deployment platforms need these environment variables:

```bash
# Supabase Configuration (Auto-configured with Lovable Cloud)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Setting Environment Variables

#### Lovable Cloud
- Automatically configured
- No manual setup needed

#### Vercel
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
vercel env add VITE_SUPABASE_PROJECT_ID
```

#### Netlify
```bash
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your_value"
netlify env:set VITE_SUPABASE_PROJECT_ID "your_value"
```

#### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
  VITE_SUPABASE_PROJECT_ID: ${{ secrets.VITE_SUPABASE_PROJECT_ID }}
```

## Database Setup

### Lovable Cloud

Backend is automatically configured with:
- Database tables with RLS policies
- Authentication system
- Edge functions
- Storage buckets

No manual setup required.

### Production Database Checklist

- [ ] All tables have appropriate RLS policies
- [ ] Email confirmation is configured
- [ ] Password requirements are enforced
- [ ] Edge functions are deployed
- [ ] Database backups are enabled
- [ ] Connection pooling is configured

### Email Configuration

Configure email settings in backend settings:
- SMTP provider (if not using default)
- Email templates customization
- Sender email address
- Email confirmation settings

## Post-Deployment

### Verification Checklist

After deployment, verify:

#### Functionality
- [ ] Landing page loads correctly
- [ ] Authentication (signup/login) works
- [ ] All three role dashboards are accessible
- [ ] Shop registration flow works
- [ ] Document uploads function
- [ ] Notifications display properly
- [ ] Reviews and ratings work

#### Performance
- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] JavaScript bundle size is reasonable
- [ ] No console errors

#### Security
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] RLS policies are active
- [ ] Authentication is required for protected routes
- [ ] No secrets exposed in client code

#### SEO
- [ ] Meta tags are present
- [ ] robots.txt is configured
- [ ] Sitemap is generated
- [ ] Open Graph tags work
- [ ] Page titles are descriptive

### Performance Optimization

1. **Enable Gzip/Brotli Compression**
   - Most platforms enable this by default
   - Reduces bundle size by 70-80%

2. **Configure Caching Headers**
   ```
   # Static assets
   Cache-Control: public, max-age=31536000, immutable
   
   # HTML files
   Cache-Control: no-cache
   ```

3. **Optimize Images**
   - Use WebP format where possible
   - Implement lazy loading
   - Compress images before upload

4. **Monitor Bundle Size**
   ```bash
   npm run build -- --stats
   ```

## Monitoring & Maintenance

### Application Monitoring

1. **Error Tracking**
   - Monitor console errors in production
   - Set up error reporting (e.g., Sentry)
   - Track failed API calls

2. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Track page load times
   - Monitor API response times

3. **Analytics**
   - Set up Google Analytics or similar
   - Track user flows
   - Monitor conversion rates

### Database Monitoring

1. **Query Performance**
   - Monitor slow queries
   - Optimize indexes
   - Review RLS policy performance

2. **Backup Strategy**
   - Automatic daily backups (Lovable Cloud)
   - Point-in-time recovery enabled
   - Regular backup testing

### Regular Maintenance

#### Weekly
- [ ] Review error logs
- [ ] Check application performance
- [ ] Monitor user feedback

#### Monthly
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Audit database performance
- [ ] Review and optimize edge functions

#### Quarterly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Database cleanup (old records)
- [ ] Documentation updates

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Rebuild after changing environment variables
- Verify variables are set in hosting platform

#### 404 Errors on Refresh

Configure rewrite rules to serve `index.html` for all routes:

**Netlify**: Add to `netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel**: Add `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Database Connection Issues

- Verify Supabase URL is correct
- Check API keys are valid
- Ensure RLS policies allow the operation
- Verify network connectivity

## Rollback Procedure

If deployment fails:

### Lovable Cloud
- Use the revert feature in the Lovable interface
- Revert to previous working version

### Other Platforms
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Manual
git revert HEAD
git push origin main
```

## Security Best Practices

### Deployment Security

1. **Environment Variables**
   - Never commit secrets to version control
   - Use platform-provided secret management
   - Rotate secrets regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Configure proper SSL/TLS

3. **Headers**
   Configure security headers:
   ```
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

4. **Rate Limiting**
   - Configure rate limiting on API endpoints
   - Protect authentication endpoints
   - Monitor for abuse

## Support

For deployment issues:
- Check platform-specific documentation
- Review error logs carefully
- Contact support@ssrms.co.za
- Check GitHub Issues for similar problems

---

**Deployed successfully?** Don't forget to update your README with the production URL! 🚀
