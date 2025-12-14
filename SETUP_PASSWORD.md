# Password-Protected Admin Setup

## Overview

The admin panel is protected by a password system using Supabase RPC functions. No Supabase Auth is used.

## Setup Steps

### 1. Run SQL Scripts in Order

1. **Schema** (`supabase/schema.sql`)
   - Creates tables and enums

2. **RLS Policies** (`supabase/rls_policies.sql`)
   - Sets up read-only access for public users

3. **RPC Functions** (`supabase/rpc_functions.sql`)
   - Creates password verification function
   - Creates all CRUD RPC functions
   - Sets up admin_config table

### 2. Change Default Password

**IMPORTANT**: The default password is `Silk@8123`. Change it immediately!

#### Option A: Update in Supabase SQL Editor

```sql
UPDATE admin_config 
SET password_hash = 'your_new_password_here'
WHERE id = 1;
```

#### Option B: Use Environment Variable (Recommended for Production)

Modify `verify_admin_password` function to use Supabase Vault or environment variables.

### 3. Test Admin Login

1. Start the frontend: `npm run dev`
2. Navigate to `/admin-login`
3. Enter password: `Silk@8123` (or your custom password)
4. You should be redirected to `/admin`

## How It Works

### Authentication Flow

1. User enters password on `/admin-login`
2. Frontend calls `verify_admin_password` RPC function
3. If valid, session stored in `sessionStorage`
4. Admin panel checks `sessionStorage` for access
5. All write operations require password in RPC calls

### Security Features

- ✅ Password verified server-side (RPC functions)
- ✅ No password stored in frontend code
- ✅ Session stored in sessionStorage (cleared on browser close)
- ✅ All writes go through password-protected RPC functions
- ✅ Public users can only read data

### RPC Functions

All write operations use these RPC functions:

- `verify_admin_password(p_password)` - Verify admin password
- `insert_cocoon_rate(...)` - Insert cocoon rate
- `update_cocoon_rate(...)` - Update cocoon rate
- `delete_cocoon_rate(...)` - Delete cocoon rate
- `insert_silk_price(...)` - Insert silk price
- `update_silk_price(...)` - Update silk price
- `delete_silk_price(...)` - Delete silk price

## Production Recommendations

1. **Use Password Hashing**
   - Replace plain text comparison with bcrypt
   - Store hashed password in admin_config table

2. **Add Rate Limiting**
   - Prevent brute force attacks
   - Limit login attempts per IP

3. **Use Supabase Vault**
   - Store password hash in Supabase Vault
   - More secure than plain table storage

4. **Session Management**
   - Consider adding session expiration
   - Add refresh token mechanism

5. **Audit Logging**
   - Log all admin actions
   - Track login attempts

## Troubleshooting

### "Invalid admin password" error
- Check password in admin_config table
- Verify RPC function is working: `SELECT verify_admin_password('your_password');`

### "Permission denied" errors
- Check RLS policies are applied
- Verify RPC functions have SECURITY DEFINER
- Check function grants are set correctly

### Session not persisting
- Check browser allows sessionStorage
- Verify sessionStorage.setItem is working
- Check for browser extensions blocking storage

