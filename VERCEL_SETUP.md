# Complete Vercel Deployment Setup

## ✅ Step 1: Environment Variables (In Vercel Dashboard)

Go to: **Your Project → Settings → Environment Variables**

Add these (copy-paste each):

### Database Connection:
```
DB_HOST=ep-small-feather-abzcsms0-pooler.eu-west-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_ThE6zGt2RxSI
```

### Admin Credentials:
```
ADMIN_EMAIL=admin@dataio.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### Auth Configuration:
```
AUTH_SECRET=<GENERATE_THIS>
AUTH_URL=https://your-vercel-url.vercel.app
```

**To generate AUTH_SECRET**, run in your local terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📊 Step 2: Import Database Schema to Neon

### Method A: Using Neon Console (Recommended)

1. Go to https://console.neon.tech
2. Select your project
3. Click "SQL Editor"
4. Copy the schema from `neon_schema.sql` (in your project root)
5. Paste and run in SQL Editor

### Method B: Using psql Command Line

```bash
psql "postgresql://neondb_owner:npg_ThE6zGt2RxSI@ep-small-feather-abzcsms0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require" < neon_schema.sql
```

### Method C: Using PgAdmin or DBeaver

Connection details:
- Host: `ep-small-feather-abzcsms0-pooler.eu-west-2.aws.neon.tech`
- Port: `5432`
- Database: `neondb`
- User: `neondb_owner`
- Password: `npg_ThE6zGt2RxSI`
- SSL: Required

Then import `neon_schema.sql`

---

## 🚀 Step 3: Redeploy

After adding all environment variables:

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click "..." on latest deployment
4. Click "Redeploy"

OR use CLI:
```bash
vercel --prod
```

---

## 📝 Step 4: Import Your Data (Optional)

If you want to transfer your local data to production:

### Export local data:
```bash
pg_dump -U postgres -h localhost -d niep_db --data-only --no-owner --no-acl > neon_data.sql
```

### Import to Neon:
Use SQL Editor or psql to run `neon_data.sql`

---

## ✅ Step 5: Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test public pages work
3. Go to `/admin/login`
4. Login with your ADMIN_EMAIL and ADMIN_PASSWORD
5. Verify data loads correctly

---

## 🔧 Troubleshooting

### "Cannot connect to database"
- Ensure all DB_ environment variables are set
- Check there are no typos in connection details
- Redeploy after adding variables

### "Invalid credentials" on admin login
- Check ADMIN_EMAIL and ADMIN_PASSWORD are set
- Ensure AUTH_SECRET is generated and set
- Redeploy

### "Empty database / No data"
- Import schema first (neon_schema.sql)
- Then import data (neon_data.sql) if needed
- Check tables exist in Neon SQL Editor

### 500 Errors
- Check deployment logs in Vercel
- Look for database connection errors
- Ensure SSL mode is enabled (?sslmode=require)

---

## 🎯 Quick Checklist

- [ ] All environment variables added to Vercel
- [ ] AUTH_SECRET generated (32+ characters)
- [ ] AUTH_URL matches your Vercel domain
- [ ] Database schema imported to Neon
- [ ] Redeployed after adding env vars
- [ ] Can access site at Vercel URL
- [ ] Admin login works
- [ ] Data displays correctly

---

## 📞 Need Help?

- Neon Dashboard: https://console.neon.tech
- Vercel Dashboard: https://vercel.com/dashboard
- Check deployment logs in Vercel for specific errors
