# API Documentation

This document describes the backend API endpoints, edge functions, and data access patterns for the SSRMS application.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Database API](#database-api)
- [Edge Functions](#edge-functions)
- [Real-time Subscriptions](#real-time-subscriptions)
- [Error Handling](#error-handling)

## Overview

SSRMS uses Lovable Cloud (Supabase) for backend services, providing:
- RESTful API via PostgREST
- Real-time subscriptions
- Server-side functions (Edge Functions)
- Authentication & authorization
- Row-Level Security (RLS)

### Base Configuration

```typescript
import { supabase } from "@/integrations/supabase/client";
```

The Supabase client is pre-configured with:
- `VITE_SUPABASE_URL`: Backend API endpoint
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Public API key
- `VITE_SUPABASE_PROJECT_ID`: Project identifier

## Authentication

### Sign Up

Create a new user account with role-based metadata.

```typescript
const signUp = async (
  email: string,
  password: string,
  fullName: string,
  role: 'customer' | 'shop_owner' | 'government'
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) throw error;
  return data;
};
```

**Request:**
- `email`: Valid email address
- `password`: Minimum 6 characters
- `fullName`: User's full name
- `role`: User role type

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name: string;
      role: string;
    };
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}
```

### Sign In

Authenticate existing user.

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};
```

**Response:**
```typescript
{
  user: User;
  session: Session;
}
```

### Sign Out

End user session.

```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
```

### Get Current Session

Retrieve active session.

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

### Password Reset

Request password reset email.

```typescript
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
};
```

## Database API

### Shops

#### Get All Approved Shops

```typescript
const getShops = async () => {
  const { data, error } = await supabase
    .from('shops')
    .select(`
      *,
      profiles:owner_id(full_name),
      reviews(rating)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

**Response:**
```typescript
[
  {
    id: string;
    name: string;
    address: string;
    compliance_score: number;
    profiles: { full_name: string };
    reviews: { rating: number }[];
  }
]
```

#### Get Shop by ID

```typescript
const getShop = async (id: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select(`
      *,
      profiles:owner_id(full_name, phone, email),
      reviews(id, rating, comment, created_at, profiles(full_name)),
      documents(id, type, status, expiry_date)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};
```

#### Create Shop

```typescript
const createShop = async (shopData: {
  name: string;
  business_name?: string;
  address: string;
  province: string;
  phone: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  trading_hours?: object;
}) => {
  const { data, error } = await supabase
    .from('shops')
    .insert({
      ...shopData,
      owner_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

#### Update Shop

```typescript
const updateShop = async (id: string, updates: Partial<Shop>) => {
  const { data, error } = await supabase
    .from('shops')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Documents

#### Get Shop Documents

```typescript
const getDocuments = async (shopId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('shop_id', shopId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

#### Upload Document

```typescript
const uploadDocument = async (
  shopId: string,
  file: File,
  documentData: {
    type: string;
    name: string;
    expiry_date?: string;
  }
) => {
  // 1. Upload file to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${shopId}/${documentData.type}-${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  // 3. Create document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      shop_id: shopId,
      ...documentData,
      file_url: publicUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Reviews

#### Get Shop Reviews

```typescript
const getReviews = async (shopId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles(full_name)
    `)
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
```

#### Create Review

```typescript
const createReview = async (
  shopId: string,
  rating: number,
  comment?: string
) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      shop_id: shopId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Inspections

#### Get Shop Inspections

```typescript
const getInspections = async (shopId: string) => {
  const { data, error } = await supabase
    .from('inspections')
    .select(`
      *,
      inspector:inspector_id(full_name, department)
    `)
    .eq('shop_id', shopId)
    .order('scheduled_date', { ascending: false });

  if (error) throw error;
  return data;
};
```

#### Schedule Inspection

```typescript
const scheduleInspection = async (inspectionData: {
  shop_id: string;
  type: 'routine' | 'complaint' | 'follow_up' | 'renewal';
  scheduled_date: string;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('inspections')
    .insert({
      ...inspectionData,
      inspector_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Notifications

#### Get User Notifications

```typescript
const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
};
```

#### Mark Notification as Read

```typescript
const markAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
};
```

### Favorites

#### Get User Favorites

```typescript
const getFavorites = async () => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      shops(*)
    `)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  return data;
};
```

#### Add to Favorites

```typescript
const addFavorite = async (shopId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      shop_id: shopId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

#### Remove from Favorites

```typescript
const removeFavorite = async (shopId: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('shop_id', shopId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
};
```

## Edge Functions

Edge functions provide server-side logic for complex operations.

### Available Functions

#### 1. send-notification
Sends notifications via multiple channels.

**Endpoint:** `/functions/v1/send-notification`

**Request:**
```typescript
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: {
    userId: string,
    type: 'shop_approved' | 'document_expiring' | 'inspection_scheduled',
    title: string,
    message: string,
    shopId?: string,
    channels: ['email', 'sms', 'in_app'],
  },
});
```

**Response:**
```typescript
{
  success: boolean;
  notificationId: string;
  channelResults: {
    email?: { sent: boolean };
    sms?: { sent: boolean };
    in_app?: { sent: boolean };
  };
}
```

#### 2. calculate-compliance
Calculates shop compliance score based on multiple factors.

**Endpoint:** `/functions/v1/calculate-compliance`

**Request:**
```typescript
const { data, error } = await supabase.functions.invoke('calculate-compliance', {
  body: {
    shopId: string,
  },
});
```

**Response:**
```typescript
{
  score: number; // 0-100
  status: 'compliant' | 'non_compliant' | 'warning';
  factors: {
    documents: { score: number; weight: number };
    inspections: { score: number; weight: number };
    reviews: { score: number; weight: number };
    history: { score: number; weight: number };
  };
  recommendations: string[];
}
```

### Calling Edge Functions

```typescript
import { supabase } from "@/integrations/supabase/client";

// With error handling
const callEdgeFunction = async (functionName: string, body: object) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
};
```

## Real-time Subscriptions

Subscribe to database changes in real-time.

### Subscribe to Notifications

```typescript
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('New notification:', payload.new);
        // Update UI with new notification
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);
```

### Subscribe to Shop Updates

```typescript
useEffect(() => {
  const channel = supabase
    .channel('shop-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'shops',
        filter: `id=eq.${shopId}`,
      },
      (payload) => {
        console.log('Shop updated:', payload.new);
        // Update shop data in UI
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [shopId]);
```

## Error Handling

### Standard Error Format

```typescript
{
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
```

### Common Error Codes

- `PGRST116`: Row not found
- `23505`: Unique constraint violation
- `23503`: Foreign key violation
- `42501`: Insufficient privileges (RLS)

### Error Handling Pattern

```typescript
const handleDatabaseOperation = async () => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      // Handle Supabase errors
      if (error.code === 'PGRST116') {
        console.error('Record not found');
      } else if (error.code === '42501') {
        console.error('Permission denied');
      } else {
        console.error('Database error:', error.message);
      }
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors, etc.
    console.error('Operation failed:', error);
    throw error;
  }
};
```

### Validation Errors

Always validate data before sending to API:

```typescript
import { z } from 'zod';

const shopSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  phone: z.string().regex(/^[0-9]{10}$/),
  email: z.string().email().optional(),
});

const validateShop = (data: unknown) => {
  try {
    return shopSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
    }
    throw error;
  }
};
```

## Rate Limiting

Lovable Cloud implements rate limiting:
- **Anonymous requests**: 50 per minute
- **Authenticated requests**: 200 per minute
- **Edge functions**: 100 per minute

Handle rate limit errors:

```typescript
const handleRateLimit = (error: any) => {
  if (error.status === 429) {
    console.error('Rate limit exceeded. Please try again later.');
    // Implement exponential backoff
  }
};
```

## Best Practices

1. **Use TypeScript types** from `src/integrations/supabase/types.ts`
2. **Handle errors gracefully** with user-friendly messages
3. **Implement loading states** for async operations
4. **Use optimistic updates** for better UX
5. **Cache data appropriately** to reduce API calls
6. **Validate input data** before API calls
7. **Test RLS policies** thoroughly
8. **Monitor error logs** regularly

---

For API support: support@ssrms.co.za
