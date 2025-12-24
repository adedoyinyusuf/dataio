# Vercel Deployment Guide

## Prerequisites
1. Vercel account (sign up at https://vercel.com)
2. Production PostgreSQL database (Neon, Supabase, or Vercel Postgres)

## Quick Deploy Steps

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? dataio
- Directory? ./
- Override settings? No

### 4. Set Environment Variables

After deployment, go to your project dashboard:
https://vercel.com/[your-username]/dataio

Navigate to: **Settings → Environment Variables**

Add these variables:

#### DATABASE CONNECTION
```
DB_HOST=your-production-db-host.neon.tech
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

#### ADMIN CREDENTIALS
```
ADMIN_EMAIL=admin@dataio.com
ADMIN_PASSWORD=your_secure_password_here
```

#### AUTHENTICATION
```
AUTH_SECRET=your_generated_secret_here
AUTH_URL=https://your-project.vercel.app
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Redeploy After Adding Variables
```bash
vercel --prod
```

## Database Setup

### Option 1: Using Neon (Recommended)

1. Go to https://neon.tech
2. Sign up/login
3. Create new project
4. Copy connection string
5. Use the connection string in Vercel environment variables

Connection string format:
```
postgres://user:password@host/database?sslmode=require
```

Parse it into individual variables:
- DB_HOST: Extract hostname
- DB_USER: Extract username
- DB_PASSWORD: Extract password
- DB_NAME: Extract database name

### Option 2: Using Vercel Postgres

1. In Vercel dashboard, go to "Storage"
2. Create Postgres database
3. Connect it to your project
4. Environment variables are auto-added

### Import Your Schema

Once database is created, import your schema:

```bash
psql "your-connection-string" < schema.sql
```

Or use the provider's web interface to run your SQL.

## Post-Deployment Checklist

- [ ] Database created and connected
- [ ] Schema imported
- [ ] Environment variables set
- [ ] AUTH_SECRET generated
- [ ] Admin credentials configured
- [ ] Site deployed successfully
- [ ] Can access at https://your-project.vercel.app
- [ ] Admin login works at /admin/login
- [ ] Data displays correctly

## Troubleshooting

### Error: "Cannot connect to database"
- Check DB_HOST, DB_USER, DB_PASSWORD are correct
- Ensure database allows connections from Vercel IPs
- Most providers require SSL: append `?sslmode=require` to connection

### Error: "AUTH_SECRET not found"
- Add AUTH_SECRET to environment variables
- Redeploy after adding variables

### 500 Error on Pages
- Check Vercel deployment logs
- Ensure all environment variables are set
- Check database connection

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# View environment variables
vercel env ls
```

## Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update AUTH_URL to your custom domain

## Performance Tips

1. **Enable caching**: Already handled by Next.js
2. **Use Edge Functions**: Vercel auto-optimizes
3. **Database connection pooling**: Already implemented in your code
4. **Monitor performance**: Use Vercel Analytics

## Security Notes

- ✅ .env.local is gitignored (secrets safe)
- ✅ All environment variables encrypted by Vercel
- ✅ Use strong ADMIN_PASSWORD
- ✅ Regenerate AUTH_SECRET for production
- ✅ Enable SSL for database connection

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/adedoyinyusuf/dataio/issues
