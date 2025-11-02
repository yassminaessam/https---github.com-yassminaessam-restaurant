# Vercel Environment Variables Setup

## Method 1: Import via Vercel Dashboard (Recommended)

### Step 1: Prepare the Environment Variables File
Copy the content from `.env` file (this file contains your actual values).

### Step 2: Import to Vercel
1. Go to: https://vercel.com/dashboard
2. Select your project (`restaurant`)
3. Navigate to: **Settings** → **Environment Variables**
4. Click **Import** button (top right)
5. Paste the content of `.env` file
6. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
7. Click **Import**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button

---

## Method 2: Add Manually (Alternative)

If import doesn't work, add each variable manually:

### Required Variables:

#### DATABASE_URL
```
postgresql://neondb_owner:npg_FhlVRP0a1Trx@ep-dawn-salad-a4r9effk-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```
- **Environments**: Production, Preview, Development
- **Description**: Neon PostgreSQL database connection string

#### NODE_ENV
```
production
```
- **Environments**: Production
- **Description**: Node.js environment mode

#### PING_MESSAGE (Optional)
```
ping pong
```
- **Environments**: All
- **Description**: Custom message for health check endpoint

---

## Method 3: Using Vercel CLI

First, link your project:
```bash
vercel link
```

Then add variables one by one:
```bash
vercel env add DATABASE_URL production preview development
# When prompted, paste the database URL

vercel env add NODE_ENV production
# When prompted, type: production

vercel env add PING_MESSAGE production preview development
# When prompted, type: ping pong
```

---

## Removing Old Variables

To clean up the old unused variables from Vercel Dashboard:

1. Go to: **Settings** → **Environment Variables**
2. Delete these old variables (if they exist):
   - `restaurant_PGPASSWORD`
   - `restaurant_PGHOST_UNPOOLED`
   - `NEXT_PUBLIC_restaurant_STACK_PROJE...`
   - `restaurant_PGUSER`
   - `restaurant_POSTGRES_URL_NO_SSL`
   - `restaurant_POSTGRES_HOST`
   - `NEXT_PUBLIC_restaurant_STACK_PUBLI...`
   - `restaurant_NEON_PROJECT_ID`
   - `VITE_PUBLIC_BUILDER_KEY`

3. Keep only:
   - `DATABASE_URL`
   - `NODE_ENV`
   - `PING_MESSAGE` (optional)

---

## Verification

After importing and redeploying, test your endpoints:

### Local Testing:
```bash
pnpm check-db
```

### Production Testing:
Visit these URLs:
- https://restro.elforsanhotel.com/api/health
- https://restro.elforsanhotel.com/api/inventory/stock-summary
- https://restro.elforsanhotel.com/api/inventory/topology

All should return JSON responses without 500 errors.

---

## Troubleshooting

If you still see 500 errors after importing:

1. **Check if DATABASE_URL was imported correctly:**
   - Go to Settings → Environment Variables
   - Look for `DATABASE_URL`
   - Verify it's enabled for Production environment

2. **Force a fresh deployment:**
   - Go to Deployments
   - Click on latest deployment
   - Click "Redeploy" button

3. **Check deployment logs:**
   - Go to Deployments
   - Click on latest deployment
   - Look for any errors in the logs

4. **Verify locally first:**
   ```bash
   pnpm check-db
   pnpm check-vercel-env
   ```
