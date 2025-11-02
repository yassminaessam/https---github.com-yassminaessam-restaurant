# Database & Environment Check Scripts

This folder contains utility scripts for verifying database connectivity and environment configuration.

## Available Scripts

### 1. Database Health Check (`check-db.ts`)

Tests connection to Neon PostgreSQL database and verifies setup.

```bash
pnpm check-db
```

**What it checks:**
- ✅ DATABASE_URL environment variable is set
- ✅ Connection parameters (host, database, user, SSL)
- ✅ Database connectivity and response time
- ✅ Database version and user info
- ✅ Existing tables in the database

**Output:**
- Green ✅ = Success
- Red ❌ = Error (with troubleshooting hints)
- Yellow ⚠️ = Warning

### 2. Vercel Environment Check (`check-vercel-env.ts`)

Verifies that required environment variables are set locally and provides instructions for Vercel setup.

```bash
pnpm check-vercel-env
```

**What it checks:**
- ✅ Required variables (DATABASE_URL)
- ⚠️ Optional variables (PING_MESSAGE)
- 📝 Provides instructions for adding to Vercel

**Output:**
- Lists all required and optional environment variables
- Shows which ones are set locally
- Provides step-by-step instructions for Vercel setup

## Setup Instructions

### Local Development

1. Ensure `.env` file exists in project root:
```env
DATABASE_URL=postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require
```

2. Run health check:
```bash
pnpm check-db
```

### Vercel Production

1. **Via Vercel Dashboard** (Recommended):
   - Go to https://vercel.com/dashboard
   - Select your project
   - Navigate to: **Settings** → **Environment Variables**
   - Add `DATABASE_URL` with the Neon connection string
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Save and redeploy

2. **Via Vercel CLI**:
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add DATABASE_URL

# Pull env vars to local for testing
vercel env pull .env.local
```

3. **Trigger Redeploy**:
```bash
git commit --allow-empty -m "trigger redeploy with env vars"
git push
```

## Troubleshooting

### Database Connection Fails (P1001)
- Verify DATABASE_URL is correct
- Check network connectivity
- Ensure Neon database is running
- Verify SSL mode is set to `require`

### Database Server Closed Connection (P1017)
- Add or adjust `connect_timeout` parameter
- Example: `?connect_timeout=15&sslmode=require`

### No Tables Found
Run Prisma migrations:
```bash
pnpm prisma migrate deploy
```

### Environment Variable Not Found in Vercel
1. Double-check it's added in Vercel Dashboard
2. Ensure correct environment is selected (Production/Preview/Development)
3. Redeploy after adding variables

## Testing Production API

After deploying with environment variables:

```bash
# Test API health
curl https://your-app.vercel.app/api/ping

# Test database connection
curl https://your-app.vercel.app/api/db/health
```

Expected response from `/api/db/health`:
```json
{
  "env": true,
  "db": "ok",
  "result": [{"ok": 1}]
}
```

## Common Issues

### Issue: "DATABASE_URL is not set"
**Solution**: Add to `.env` locally or Vercel Dashboard for production

### Issue: "Connection timeout"
**Solution**: Add `connect_timeout=15` to connection string

### Issue: "SSL connection required"
**Solution**: Ensure connection string includes `sslmode=require`

### Issue: Vercel shows 500 error
**Solutions**:
1. Check Vercel function logs: **Functions** → **api/index** → **Logs**
2. Verify DATABASE_URL is set in Vercel
3. Check database is accessible from internet
4. Verify connection string format

## Neon Connection String Format

For Vercel (use pooler):
```
postgresql://user:password@host-pooler.region.aws.neon.tech/database?connect_timeout=15&sslmode=require
```

For local development:
```
postgresql://user:password@host-pooler.region.aws.neon.tech/database?sslmode=require
```

## Files

- `check-db.ts` - Database connectivity test
- `check-vercel-env.ts` - Environment variable checker
- `README.md` - This file
