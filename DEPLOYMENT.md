# Deployment Guide for syntaxbots.live

This guide covers deploying the SyntaxBots website to the production domain `syntaxbots.live`.

## Prerequisites

- ✅ Domain: syntaxbots.live (configured)
- ✅ Server with Node.js (v16+)
- ✅ SSL certificate for HTTPS
- ✅ Discord Developer Application

## Production Environment Setup

### 1. Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy (optional but recommended)
sudo apt install nginx
```

### 2. Domain & SSL Setup

```bash
# Install Certbot for Let's Encrypt SSL
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d syntaxbots.live -d www.syntaxbots.live
```

### 3. Application Deployment

```bash
# Clone the repository
git clone https://github.com/syntaxnite/syntax-bots.git
cd syntax-bots

# Install dependencies
npm install --production

# Create production environment file
cp .env.example .env
```

### 4. Environment Configuration

Edit `.env` file with production values:

```env
# Discord OAuth Configuration
DISCORD_CLIENT_ID=your_actual_client_id
DISCORD_CLIENT_SECRET=your_actual_client_secret

# Production URLs
REDIRECT_URI=https://syntaxbots.live/admin.html
ALLOWED_ORIGINS=https://syntaxbots.live,https://www.syntaxbots.live

# Security
JWT_SECRET=your_super_secure_random_jwt_secret

# Server Configuration
PORT=3000
NODE_ENV=production

# Admin Access
ADMIN_USER_ID=1385749774053146715
```

### 5. Discord Developer Portal Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to OAuth2 → General
4. Add redirect URI: `https://syntaxbots.live/admin.html`
5. Save changes

### 6. Nginx Configuration (Recommended)

Create `/etc/nginx/sites-available/syntaxbots.live`:

```nginx
server {
    listen 80;
    server_name syntaxbots.live www.syntaxbots.live;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name syntaxbots.live www.syntaxbots.live;

    ssl_certificate /etc/letsencrypt/live/syntaxbots.live/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/syntaxbots.live/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/syntaxbots.live /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Start the Application

```bash
# Start with PM2
pm2 start src/server.js --name "syntaxbots" --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### 8. Firewall Configuration

```bash
# Allow necessary ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

## Monitoring & Maintenance

### PM2 Commands

```bash
# View logs
pm2 logs syntaxbots

# Restart application
pm2 restart syntaxbots

# Stop application
pm2 stop syntaxbots

# Monitor resources
pm2 monit
```

### Database Backup

```bash
# Create backup script
echo '#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/syntax-bots/bots.db /path/to/backups/bots_backup_$DATE.db
find /path/to/backups -name "bots_backup_*.db" -mtime +7 -delete
' > backup_db.sh

chmod +x backup_db.sh

# Add to crontab for daily backup
crontab -e
# Add: 0 2 * * * /path/to/backup_db.sh
```

### SSL Certificate Renewal

SSL certificates will auto-renew with certbot. To test renewal:

```bash
sudo certbot renew --dry-run
```

## Security Checklist

- ✅ HTTPS enabled with valid SSL certificate
- ✅ Environment variables secured
- ✅ Firewall configured
- ✅ Security headers in Nginx
- ✅ Admin access restricted to specific Discord user
- ✅ Database file permissions restricted
- ✅ Regular backups scheduled

## Performance Optimization

1. **Enable Gzip in Nginx**
2. **Set appropriate cache headers**
3. **Use CDN for static assets** (optional)
4. **Monitor server resources with PM2**
5. **Database optimization** (indexes, cleanup)

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **SSL certificate issues**
   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

3. **Discord OAuth not working**
   - Check redirect URI in Discord Developer Portal
   - Verify HTTPS is properly configured
   - Check environment variables

4. **Database permissions**
   ```bash
   chown www-data:www-data bots.db
   chmod 664 bots.db
   ```

## Update Procedure

```bash
# Stop application
pm2 stop syntaxbots

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install --production

# Restart application
pm2 restart syntaxbots
```

---

**Production Site**: [syntaxbots.live](https://syntaxbots.live)

For support, create an issue on the GitHub repository or contact through the website.
