# AWS Amplify Deployment Guide

## 🚀 Complete AWS Amplify Setup

### Step 1: Create AWS Account (if you don't have one)

1. Go to https://aws.amazon.com/amplify/
2. Click "Create an AWS Account"
3. Complete sign-up (requires credit card, but free tier is available)
4. Verify your email and phone number

---

### Step 2: Set Up AWS Amplify

1. **Sign in to AWS Console:** https://console.aws.amazon.com
2. **Search for "Amplify"** in the top search bar
3. **Click "AWS Amplify"**
4. **Click "Get Started"** under "Amplify Hosting"

---

### Step 3: Connect GitHub Repository

1. **Select "GitHub"** as your Git provider
2. **Click "Continue"**
3. **Authorize AWS Amplify** to access your GitHub
4. **Select Repository:**
   - Repository: `adedoyinyusuf/dataio`
   - Branch: `main`
5. **Click "Next"**

---

### Step 4: Configure Build Settings

Amplify will auto-detect your Next.js app and use the `amplify.yml` file.

**Verify the settings:**
- ✅ Build command: `npm run build`
- ✅ Output directory: `.next`
- ✅ Node version: 18 or higher

**Click "Next"**

---

### Step 5: Add Environment Variables

Before deploying, add these environment variables:

**In the Amplify Console:**
1. Go to **"Environment variables"** (left sidebar)
2. Click **"Add variable"**
3. Add each of these:

```
DB_HOST=ep-small-feather-abzcsms0-pooler.eu-west-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_ThE6zGt2RxSI
ADMIN_EMAIL=admin@dataio.com
ADMIN_PASSWORD=YourSecurePassword123!
AUTH_SECRET=ZhQEL9Ee8knikX1a8PU2gUByGUa112N5qPL9TgtBiSu4=
NODE_ENV=production
```

**Important:** For `AUTH_URL`, wait until after first deployment to get your Amplify URL, then add:
```
AUTH_URL=https://main.xxxxx.amplifyapp.com
```

---

### Step 6: Deploy

1. **Review all settings**
2. **Click "Save and Deploy"**
3. **Wait 5-10 minutes** for the build to complete

**Build Stages:**
- ⏳ Provision (1-2 min)
- ⏳ Build (3-5 min)
- ⏳ Deploy (1-2 min)
- ✅ Complete

---

### Step 7: Get Your App URL

Once deployed:
1. You'll see your app URL: `https://main.xxxxx.amplifyapp.com`
2. **Copy this URL**
3. **Go back to Environment Variables**
4. **Add AUTH_URL** with your Amplify URL
5. **Redeploy** (Amplify → Select your app → Click "Redeploy this version")

---

### Step 8: Test Your Deployment

1. **Visit your Amplify URL**
2. **Go to `/admin/login`**
3. **Login with:**
   - Email: admin@dataio.com
   - Password: (your ADMIN_PASSWORD)
4. **Verify data loads**

---

## 🔧 Advanced Configuration

### Custom Domain (Optional)

1. In Amplify Console, go to **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update AUTH_URL to use custom domain

### Auto-Deploy on Git Push

Already enabled by default! Every push to `main` branch will auto-deploy.

### Branch Deployments

To deploy other branches:
1. Go to **"App settings"** → **"Branch deployments"**
2. Click **"Connect branch"**
3. Select branch to deploy

---

## 📊 Cost Estimate

### AWS Amplify Free Tier (First 12 Months):
- ✅ 1,000 build minutes/month
- ✅ 15 GB storage/month
- ✅ 15 GB data transfer/month

### After Free Tier:
- Build: $0.01/minute
- Storage: $0.023/GB/month
- Data transfer: $0.15/GB

**Expected Monthly Cost (after free tier):**
- Small traffic: ~$5-10/month
- Medium traffic: ~$10-20/month

### Neon Database:
- Free tier: $0/month (included)

**Total: $0-20/month** depending on traffic

---

## 🐛 Troubleshooting

### Build Fails: "npm ci failed"

**Solution:** Update `amplify.yml`:
```yaml
preBuild:
  commands:
    - npm install
```

### Error: "Cannot connect to database"

**Check:**
- ✅ All DB_ environment variables are set
- ✅ SSL is enabled in `lib/db.ts`
- ✅ Neon database is running

### Error: "AUTH_SECRET not found"

**Solution:**
- Add AUTH_SECRET to environment variables
- Redeploy

### 500 Errors

**Check build logs:**
1. Go to build details
2. Check for errors in logs
3. Most common: missing environment variables

---

## 🔄 Updating Your App

1. **Make changes locally**
2. **Commit:** `git add . && git commit -m "description"`
3. **Push:** `git push`
4. **Amplify auto-deploys!** (2-5 minutes)

---

## 📈 Monitoring

### View Logs:
1. Amplify Console → Your App
2. Click on a deployment
3. View build logs and server logs

### Performance Monitoring:
- Go to "Monitoring" tab
- View requests, errors, latency

---

## 🆚 Amplify vs Vercel Comparison

| Feature | AWS Amplify | Vercel |
|---------|-------------|---------|
| **Free Tier** | 1000 build min | Unlimited |
| **Cost (paid)** | ~$5-20/mo | ~$20/mo |
| **AWS Integration** | ✅ Excellent | ❌ None |
| **Next.js Support** | ✅ Good | ✅ Perfect |
| **Auto-deploy** | ✅ Yes | ✅ Yes |
| **Custom domains** | ✅ Yes | ✅ Yes |

---

## 🎯 Quick Commands

### View deployment status:
```bash
# Install AWS CLI (optional)
npm install -g @aws-amplify/cli

# Check status
amplify status
```

### Manual deploy:
- Amplify Console → Redeploy

---

## ✅ Post-Deployment Checklist

- [ ] App deployed successfully
- [ ] All environment variables set
- [ ] AUTH_URL updated with Amplify URL
- [ ] Redeployed after adding AUTH_URL
- [ ] Admin login works
- [ ] Data loads correctly
- [ ] Database connection works
- [ ] SSL enabled for Neon

---

## 📞 Support

- **AWS Amplify Docs:** https://docs.amplify.aws
- **AWS Support:** https://console.aws.amazon.com/support
- **Neon Support:** https://neon.tech/docs

---

## 🔐 Security Notes

- ✅ All environment variables encrypted
- ✅ HTTPS automatically enabled
- ✅ Database uses SSL
- ✅ Secrets not in git repository
- ✅ Admin routes protected

---

**Ready to deploy? Follow the steps above!** 🚀
