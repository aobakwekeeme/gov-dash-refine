# Security Documentation

This document outlines the security architecture, best practices, and policies for the SSRMS application.

## Table of Contents

- [Security Architecture](#security-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Row-Level Security](#row-level-security)
- [Input Validation](#input-validation)
- [Data Protection](#data-protection)
- [Security Best Practices](#security-best-practices)
- [Incident Response](#incident-response)

## Security Architecture

### Multi-Layer Security Model

SSRMS implements defense-in-depth with multiple security layers:

```
┌─────────────────────────────────────┐
│        Client Layer                  │
│  • Input Validation                  │
│  • XSS Prevention                    │
│  • CSRF Protection                   │
└─────────────────────────────────────┘
           ↓ HTTPS
┌─────────────────────────────────────┐
│      Application Layer               │
│  • Authentication                    │
│  • Authorization                     │
│  • Session Management                │
└─────────────────────────────────────┘
           ↓ Secure API
┌─────────────────────────────────────┐
│       Database Layer                 │
│  • Row-Level Security (RLS)          │
│  • Encrypted at Rest                 │
│  • Audit Logging                     │
└─────────────────────────────────────┘
```

### Key Security Features

1. **Authentication**: Email/password with secure hashing
2. **Authorization**: Role-based access control (RBAC)
3. **Data Encryption**: TLS in transit, AES-256 at rest
4. **RLS Policies**: Database-level access control
5. **Input Validation**: Client and server-side
6. **Audit Logging**: Activity tracking

## Authentication & Authorization

### Password Requirements

**Minimum Requirements:**
- At least 6 characters (enforced by Supabase)
- Recommended: 8+ characters with mixed case, numbers, symbols

**Implementation:**
```typescript
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^A-Za-z0-9]/, "Must contain special character");
```

### Session Management

**Session Configuration:**
- Access token expiry: 1 hour
- Refresh token expiry: 30 days
- Auto-refresh before expiry
- Secure cookie storage (HttpOnly, Secure, SameSite)

**Session Validation:**
```typescript
// Validate session on protected routes
const validateSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect to login
    window.location.href = '/signin';
    return false;
  }
  
  // Check token expiry
  const expiresAt = session.expires_at * 1000;
  if (Date.now() >= expiresAt) {
    // Token expired, refresh
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      // Redirect to login
      window.location.href = '/signin';
      return false;
    }
  }
  
  return true;
};
```

### Role-Based Access Control (RBAC)

**Roles:**
1. **Customer**: Browse shops, leave reviews, manage favorites
2. **Shop Owner**: Manage shop profile, documents, view analytics
3. **Government**: Review applications, schedule inspections, monitor compliance

**Role Enforcement:**

**Frontend:**
```typescript
// Protect routes by role
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, profile } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  if (!allowedRoles.includes(profile?.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Usage
<Route path="/shop-management" element={
  <ProtectedRoute allowedRoles={['shop_owner']}>
    <ShopManagementPage />
  </ProtectedRoute>
} />
```

**Backend (RLS):**
```sql
-- Only shop owners can update their shops
CREATE POLICY "Shop owners can update their shops" ON shops
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only government officials can approve shops
CREATE POLICY "Government can approve shops" ON shops
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'government'
    )
  );
```

## Row-Level Security

### RLS Policy Patterns

#### 1. Own Data Access
Users can only access their own data.

```sql
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### 2. Related Data Access
Users can access data related to their records.

```sql
CREATE POLICY "Shop owners can view their documents" ON documents
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
  );
```

#### 3. Public Read, Authenticated Write
Anyone can read, only authenticated users can write.

```sql
CREATE POLICY "Anyone can view approved shops" ON shops
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### 4. Role-Based Access
Access based on user role.

```sql
-- Use security definer function to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Apply in policy
CREATE POLICY "Government can update shop status" ON shops
  FOR UPDATE USING (public.has_role(auth.uid(), 'government'));
```

### Testing RLS Policies

**Test as specific user:**
```sql
-- Set user context
SET LOCAL ROLE authenticated;
SET request.jwt.claim.sub = 'user-uuid-here';

-- Test query
SELECT * FROM shops;

-- Reset
RESET ROLE;
```

**Test all policies:**
```typescript
// Test suite for RLS policies
describe('RLS Policies', () => {
  it('should allow shop owner to view own shop', async () => {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', ownShopId);
    
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });
  
  it('should deny shop owner viewing other shops', async () => {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', otherShopId)
      .eq('status', 'pending');
    
    expect(data).toHaveLength(0);
  });
});
```

## Input Validation

### Client-Side Validation

**Always validate user input before sending to server.**

```typescript
import { z } from 'zod';

// Define validation schema
const shopFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Shop name is required")
    .max(100, "Shop name must be less than 100 characters"),
  
  address: z.string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address must be less than 500 characters"),
  
  phone: z.string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  
  email: z.string()
    .email("Invalid email address")
    .optional()
    .or(z.literal('')),
  
  province: z.enum([
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
  ]),
});

// Validate form data
const validateShopForm = (formData: unknown) => {
  try {
    const validated = shopFormSchema.parse(formData);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    throw error;
  }
};
```

### Server-Side Validation

**Always re-validate on the server (Edge Functions).**

```typescript
// In edge function
import { z } from 'zod';

const requestSchema = z.object({
  shopId: z.string().uuid(),
  documentType: z.enum(['business_license', 'health_certificate']),
});

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    
    // Validate request
    const validated = requestSchema.parse(body);
    
    // Process request
    // ...
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: error.errors }),
        { status: 400 }
      );
    }
    throw error;
  }
});
```

### Sanitization

**Prevent XSS attacks by sanitizing user input.**

```typescript
// Never use dangerouslySetInnerHTML with user content
// ❌ DANGEROUS
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// ✅ SAFE - Let React escape content
<div>{userComment}</div>

// For rich text, use sanitization library
import DOMPurify from 'dompurify';

const SafeHTML = ({ content }: { content: string }) => {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

## Data Protection

### Encryption

**Data at Rest:**
- Database: AES-256 encryption (handled by Lovable Cloud)
- File storage: Encrypted automatically
- Backups: Encrypted

**Data in Transit:**
- HTTPS/TLS 1.3 for all connections
- Certificate pinning recommended for mobile apps

### Sensitive Data Handling

**Never log sensitive data:**
```typescript
// ❌ BAD
console.log('User password:', password);
console.log('Auth token:', session.access_token);

// ✅ GOOD
console.log('User login attempt for:', email);
console.log('Session established:', session.user.id);
```

**PII Protection:**
```typescript
// Mask sensitive data in logs
const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  return `${name[0]}***@${domain}`;
};

const maskPhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
};
```

### Data Retention

**Automatic Cleanup:**
```sql
-- Delete old notifications (90 days)
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '90 days';

-- Archive old activities (1 year)
INSERT INTO activities_archive
SELECT * FROM activities
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM activities
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Security Best Practices

### 1. Secrets Management

**Never commit secrets:**
```bash
# .gitignore
.env
.env.local
.env.production
*.key
*.pem
```

**Use environment variables:**
```typescript
// ✅ GOOD
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ BAD
const apiKey = "hardcoded-api-key-12345";
```

### 2. HTTPS Enforcement

**Redirect HTTP to HTTPS:**
```typescript
// In production, redirect to HTTPS
if (import.meta.env.PROD && window.location.protocol === 'http:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}
```

### 3. CORS Configuration

**Restrict allowed origins:**
```typescript
// In edge functions
const corsHeaders = {
  'Access-Control-Allow-Origin': import.meta.env.PROD 
    ? 'https://yourdomain.com' 
    : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### 4. Rate Limiting

**Implement rate limiting for sensitive operations:**
```typescript
const rateLimit = new Map();

const checkRateLimit = (userId: string, limit = 10, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = rateLimit.get(userId) || [];
  
  // Filter requests within window
  const recentRequests = userRequests.filter((time: number) => now - time < windowMs);
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  recentRequests.push(now);
  rateLimit.set(userId, recentRequests);
};
```

### 5. SQL Injection Prevention

**Always use parameterized queries:**
```typescript
// ✅ SAFE - Parameterized query
const { data } = await supabase
  .from('shops')
  .select('*')
  .eq('name', userInput);

// ❌ DANGEROUS - SQL injection risk
const { data } = await supabase.rpc('raw_sql', {
  query: `SELECT * FROM shops WHERE name = '${userInput}'`
});
```

### 6. File Upload Security

**Validate file uploads:**
```typescript
const validateFileUpload = (file: File) => {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  // Check file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  // Check file extension
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension');
  }
};
```

### 7. Secure Headers

**Configure security headers:**
```typescript
// In edge functions or server config
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
};
```

## Incident Response

### Security Incident Procedure

**1. Detection**
- Monitor error logs
- Review security alerts
- Track unusual activity

**2. Assessment**
- Determine severity
- Identify affected systems
- Assess data exposure

**3. Containment**
- Isolate affected systems
- Revoke compromised credentials
- Block malicious IPs

**4. Eradication**
- Remove malicious code
- Patch vulnerabilities
- Reset passwords

**5. Recovery**
- Restore from backups
- Verify system integrity
- Monitor for recurrence

**6. Post-Incident**
- Document incident
- Update security measures
- Train team

### Reporting Security Issues

**Contact:**
- Email: security@ssrms.co.za
- Response time: Within 24 hours
- Encrypted communication available

**What to Include:**
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Security Audits

**Regular Audits:**
- Monthly: RLS policy review
- Quarterly: Full security audit
- Annual: Penetration testing

**Audit Checklist:**
- [ ] RLS policies are correct and tested
- [ ] All inputs are validated
- [ ] Secrets are properly managed
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Rate limiting is in place
- [ ] Error messages don't leak information
- [ ] Logs don't contain sensitive data
- [ ] Dependencies are up to date
- [ ] Backups are tested and encrypted

---

For security concerns: security@ssrms.co.za

**Last Updated:** January 2025
