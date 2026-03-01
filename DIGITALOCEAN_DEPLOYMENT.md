# DigitalOcean Deployment Guide

This guide covers deploying the Dataio Next.js application to a DigitalOcean Ubuntu Droplet using PM2 as a process manager and Nginx as a reverse proxy, while connecting to your external Neon PostgreSQL database.

## Prerequisites
- A DigitalOcean account
- A registered domain name (optional but recommended for SSL)
- Your connection details for Neon DB and other environment variables

## Step 1: Provision a Droplet
1. Log in to DigitalOcean and click **Create -> Droplets**.
2. **Image**: Choose **Ubuntu** (24.04 LTS or 22.04 LTS).
3. **Size**: Basic Plan. Depending on your needs, a $6/mo or $12/mo Premium Intel/AMD droplet is recommended for building Next.js apps.
4. **Authentication**: Add your SSH keys.
5. **Hostname**: Name it `dataio-production` or similar.
6. Click **Create Droplet**.

## Step 2: Connect and Setup Server
Once the Droplet is ready, SSH into it:
```bash
ssh root@your_droplet_ip
```

### Update System and Install Dependencies
```bash
apt update && apt upgrade -y
apt install curl git nginx -y
```

### Install Node.js (v20 LTS recommended)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

### Install PM2
```bash
npm install pm2@latest -g
```

## Step 3: Clone Application and Setup
Navigate to the web directory and clone your repository:
```bash
cd /var/www
git clone https://github.com/adedoyinyusuf/dataio.git
cd dataio
```

### Install Project Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the project root:
```bash
nano .env
```
Add your production variables:
```env
DB_HOST=ep-small-feather-abzcsms0-pooler.eu-west-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your_neon_password
ADMIN_EMAIL=admin@dataio.com
ADMIN_PASSWORD=your_secure_password
AUTH_SECRET=generate_this_with_openssl_rand_base64_32
AUTH_URL=https://yourdomain.com
NODE_ENV=production
```
*(Save and exit: `Ctrl+O`, `Enter`, `Ctrl+X`)*

## Step 4: Build and Start the Application
Build the Next.js application:
```bash
npm run build
```

Start the application with PM2:
```bash
pm2 start npm --name "dataio" -- start
```

Ensure PM2 restarts the app automatically if the server reboots:
```bash
pm2 startup
# Follow the command PM2 prints out, then run:
pm2 save
```

## Step 5: Configure Nginx Reverse Proxy
We need Nginx to forward port 80/443 traffic to the Next.js app running on port 3000.

Create an Nginx configuration file:
```bash
nano /etc/nginx/sites-available/dataio
```

Add the following configuration (replace `yourdomain.com` with your actual domain or Droplet IP):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/dataio /etc/nginx/sites-enabled/
# Test Nginx config
nginx -t
# Restart Nginx
systemctl restart nginx
```

## Step 6: Secure with SSL (Optional but Recommended)
If you have a domain pointed to your Droplet IP, secure it using Certbot:
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Select the option to automatically redirect HTTP traffic to HTTPS.

## Step 7: Verify
Navigate to `http://yourdomain.com` (or `https://` if SSL is enabled). 
Your Dataio platform should be live and ready for production!
