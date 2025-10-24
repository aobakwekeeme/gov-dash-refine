# Development Guide

Development setup and guidelines for SSRMS project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Architecture](#project-architecture)
- [Code Organization](#code-organization)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** v18 or higher
- **npm** v9 or higher (comes with Node.js)
- **Git** for version control
- **VS Code** (recommended) or your preferred editor

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tshimangadzo3v5/The-Genesis.git
   cd The-Genesis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure build script** 
   
   Add to `package.json` if not present:
   ```json
   {
     "scripts": {
       "build:dev": "vite build --mode development"
     }
   }
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:8080
   ```

## Development Environment

### VS Code Extensions (Recommended)

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **TypeScript Vue Plugin**: TypeScript support
- **GitLens**: Git visualization
- **Error Lens**: Inline error display

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Environment Variables

Variables are auto-configured by Lovable Cloud in `.env`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

**Never commit `.env` file to version control!**

### Browser DevTools Setup

1. **React Developer Tools**
   - Install React DevTools extension
   - Inspect component hierarchy
   - Monitor state and props

2. **Network Tab**
   - Monitor API calls
   - Check request/response
   - Debug failed requests

3. **Console**
   - View application logs
   - Debug errors
   - Test code snippets

## Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)          │
│  ┌────────────────────────────────────┐  │
│  │  Components & Pages                │  │
│  │  - Landing, Dashboards, etc        │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Contexts & Hooks                  │  │
│  │  - AuthContext, useAuth, etc       │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Supabase Client                   │  │
│  │  - API calls, real-time            │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↕ HTTPS/WSS
┌─────────────────────────────────────────┐
│    Lovable Cloud (Supabase Backend)     │
│  ┌────────────────────────────────────┐  │
│  │  PostgreSQL Database + RLS         │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Edge Functions                    │  │
│  │  - send-notification               │  │
│  │  - calculate-compliance            │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Authentication & Storage          │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.3.1 - UI library
- TypeScript 5.5.3 - Type safety
- Vite 5.4.2 - Build tool
- Tailwind CSS 3.4.1 - Styling
- React Router 7.8.2 - Routing
- Lucide React - Icons

**Backend:**
- Lovable Cloud (Supabase)
- PostgreSQL - Database
- Edge Functions - Server-side logic
- Row-Level Security - Authorization

## Code Organization

### Directory Structure

```
src/
├── components/              # Reusable UI components
│   ├── AuthModal.tsx
│   ├── LandingPage.tsx
│   ├── CustomerDashboard.tsx
│   ├── ShopOwnerDashboard.tsx
│   ├── GovernmentDashboard.tsx
│   └── ...
├── pages/                   # Page components
│   ├── AboutPage.tsx
│   ├── FeaturesPage.tsx
│   ├── ShopDetailPage.tsx
│   └── ...
├── contexts/                # React contexts
│   └── AuthContext.tsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useShops.ts
│   ├── useDocuments.ts
│   ├── useInspections.ts
│   ├── useNotifications.ts
│   └── ...
├── utils/                   # Utility functions
│   ├── inputValidation.ts
│   └── passwordValidation.ts
├── integrations/            # External integrations
│   └── supabase/
│       ├── client.ts        # Supabase client (auto-generated)
│       └── types.ts         # Database types (auto-generated)
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles

supabase/
├── config.toml              # Supabase configuration (auto-generated)
└── functions/               # Edge functions
    ├── send-notification/
    └── calculate-compliance/
```

### Component Patterns

**Functional Components with Hooks:**
```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ShopCardProps {
  shop: Shop;
  onSelect: (id: string) => void;
}

export const ShopCard = ({ shop, onSelect }: ShopCardProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if shop is favorite
  }, [shop.id]);

  return (
    <div onClick={() => onSelect(shop.id)}>
      {/* Component JSX */}
    </div>
  );
};
```

**Custom Hooks Pattern:**
```typescript
// hooks/useShops.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;
      setShops(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { shops, loading, error, refetch: fetchShops };
};
```

**Context Pattern:**
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Development Workflow

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/shop-search-filter
   ```

2. **Implement Feature**
   - Write code following patterns
   - Add proper TypeScript types
   - Use Tailwind for styling
   - Add error handling

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Lint and Format**
   ```bash
   npm run lint
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(shops): add search filter functionality"
   ```

6. **Push to Remote**
   ```bash
   git push origin feature/shop-search-filter
   ```

7. **Create Pull Request**
   - Provide clear description
   - Link related issues
   - Request review

### Database Changes

**Creating Migrations:**

When you need to modify the database:

1. **Plan the change**
   - Document table structure
   - Plan RLS policies
   - Consider data migration

2. **Write migration SQL**
   ```sql
   -- Add column to shops table
   ALTER TABLE public.shops
   ADD COLUMN operating_hours JSONB;

   -- Update RLS policy if needed
   CREATE POLICY "Shop owners can update operating hours" ON shops
     FOR UPDATE USING (auth.uid() = owner_id);
   ```

3. **Test migration**
   - Test on development environment
   - Verify RLS policies work correctly
   - Check data integrity

4. **Document changes**
   - Update DATABASE.md
   - Note breaking changes
   - Update API documentation

### Edge Functions Development

**Creating New Edge Function:**

1. **Create function directory**
   ```bash
   mkdir -p supabase/functions/my-function
   ```

2. **Create index.ts**
   ```typescript
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   };

   serve(async (req) => {
     // Handle CORS
     if (req.method === 'OPTIONS') {
       return new Response(null, { headers: corsHeaders });
     }

     try {
       const supabase = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_ANON_KEY') ?? ''
       );

       // Your function logic here

       return new Response(
         JSON.stringify({ success: true }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     } catch (error) {
       return new Response(
         JSON.stringify({ error: error.message }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
   });
   ```

3. **Update supabase/config.toml**
   ```toml
   [functions.my-function]
   verify_jwt = true  # or false for public functions
   ```

4. **Test locally**
   ```bash
   # Functions deploy automatically
   # Test via Supabase client
   ```

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with each role
- [ ] Sign in with valid credentials
- [ ] Sign in with invalid credentials
- [ ] Password reset flow
- [ ] Sign out

**Shop Management:**
- [ ] Create new shop
- [ ] Update shop details
- [ ] Upload documents
- [ ] View compliance score

**Customer Features:**
- [ ] Browse shops
- [ ] Filter/search shops
- [ ] View shop details
- [ ] Leave review
- [ ] Add/remove favorites

**Government Features:**
- [ ] Review applications
- [ ] Approve/reject shops
- [ ] Schedule inspections
- [ ] View reports

**Responsive Design:**
- [ ] Mobile (320px-767px)
- [ ] Tablet (768px-1023px)
- [ ] Desktop (1024px+)

### Testing Real-time Features

```typescript
// Test real-time subscription
const testRealtime = () => {
  const channel = supabase
    .channel('test-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
      },
      (payload) => {
        console.log('Change received:', payload);
      }
    )
    .subscribe();

  // Clean up
  return () => supabase.removeChannel(channel);
};
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load pages
const ShopDetailPage = lazy(() => import('./pages/ShopDetailPage'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <ShopDetailPage />
</Suspense>
```

### Image Optimization

```typescript
// Use proper image formats and lazy loading
<img
  src={shopImage}
  alt="Shop front"
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

### Memoization

```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Bundle Size Monitoring

```bash
# Analyze bundle size
npm run build -- --stats

# Check for large dependencies
npx vite-bundle-visualizer
```

---

For development questions: support@ssrms.co.za
