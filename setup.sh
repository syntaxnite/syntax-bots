#!/bin/bash

# SyntaxBots Production Setup Script for syntaxbots.live
# Run this script on your production server

set -e

echo "🚀 Setting up SyntaxBots for syntaxbots.live..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Nginx...${NC}"
    sudo apt install nginx -y
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}🔒 Installing Certbot for SSL...${NC}"
    sudo apt install certbot python3-certbot-nginx -y
fi

# Clone repository if not present
if [ ! -d "syntax-bots" ]; then
    echo -e "${YELLOW}📁 Cloning repository...${NC}"
    git clone https://github.com/syntaxnite/syntax-bots.git
    cd syntax-bots
else
    echo -e "${YELLOW}📁 Repository already exists, updating...${NC}"
    cd syntax-bots
    git pull origin main
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production

# Create environment file if not exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️ Creating environment file...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  IMPORTANT: Edit .env file with your actual Discord credentials!${NC}"
    echo -e "${YELLOW}   - DISCORD_CLIENT_ID${NC}"
    echo -e "${YELLOW}   - DISCORD_CLIENT_SECRET${NC}"
    echo -e "${YELLOW}   - JWT_SECRET (generate a strong random string)${NC}"
fi

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw --force enable

# Create backup directory
mkdir -p ~/backups

# Create backup script
cat > ~/backup_syntaxbots.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp ~/syntax-bots/bots.db ~/backups/bots_backup_$DATE.db
find ~/backups -name "bots_backup_*.db" -mtime +7 -delete
echo "Database backup completed: bots_backup_$DATE.db"
EOF

chmod +x ~/backup_syntaxbots.sh

echo -e "${GREEN}✅ Basic setup completed!${NC}"
echo
echo -e "${YELLOW}🔧 Next steps:${NC}"
echo "1. Edit .env file with your Discord credentials:"
echo "   nano .env"
echo
echo "2. Set up SSL certificate:"
echo "   sudo certbot --nginx -d syntaxbots.live -d www.syntaxbots.live"
echo
echo "3. Configure Nginx (see DEPLOYMENT.md for config)"
echo
echo "4. Start the application:"
echo "   pm2 start src/server.js --name syntaxbots --env production"
echo "   pm2 save"
echo "   pm2 startup"
echo
echo "5. Set up daily database backup:"
echo "   crontab -e"
echo "   Add: 0 2 * * * /home/$(whoami)/backup_syntaxbots.sh"
echo
echo -e "${GREEN}🌐 Your site will be available at: https://syntaxbots.live${NC}"
echo
echo "For detailed instructions, see DEPLOYMENT.md"
