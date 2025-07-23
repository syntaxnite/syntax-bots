# SyntaxBots - Discord Bot Showcase Website

🌐 **Live Site**: [syntaxbots.live](https://syntaxbots.live)

A modern, responsive website for showcasing Discord bots with an admin panel for bot management.

## 🚀 Features

- 🎨 **Modern Design** - Clean, responsive interface with dark/light theme support
- 🤖 **Bot Showcase** - Display Discord bots with detailed information, stats, and features
- 🔐 **Admin Panel** - Secure Discord OAuth authentication for bot management
- 📱 **Mobile Friendly** - Fully responsive design optimized for all devices
- 🎯 **GitHub Integration** - Link bot source code repositories for transparency
- ⚡ **Fast & Lightweight** - Built with vanilla JavaScript and modern CSS
- 🌍 **Production Ready** - Deployed on syntaxbots.live with SSL

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3 with optimized queries
- **Authentication**: Discord OAuth2 with JWT tokens
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: Font Awesome 6.0 with custom Icon class
- **Deployment**: Production-ready with environment configurations

## 📁 Project Structure

```
syntax-bots/
├── src/
│   └── server.js              # Main Express server
├── public/
│   ├── index.html             # Main website
│   ├── admin.html             # Admin panel
│   ├── css/
│   │   ├── styles.css         # Main website styles
│   │   └── admin.css          # Admin panel styles
│   ├── js/
│   │   ├── script.js          # Main website JavaScript
│   │   ├── admin.js           # Admin panel JavaScript
│   │   └── icon.js            # Custom Icon class
│   └── pages/
│       ├── privacy.html       # Privacy Policy
│       ├── terms.html         # Terms of Service
│       └── contact.html       # Contact page
├── docs/                      # Documentation files
├── package.json               # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Discord Developer Application

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/syntaxnite/syntax-bots.git
   cd syntax-bots
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure:
   ```env
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   REDIRECT_URI=http://localhost:3000/admin.html
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Access the application**
   - Main website: http://localhost:3000
   - Admin panel: http://localhost:3000/admin.html

### Production Deployment

For production deployment to syntaxbots.live:

1. **Environment Configuration**
   ```env
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   REDIRECT_URI=https://syntaxbots.live/admin.html
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=80
   NODE_ENV=production
   ALLOWED_ORIGINS=https://syntaxbots.live
   ```

2. **SSL Certificate**
   - Ensure SSL certificate is configured for syntaxbots.live
   - Update redirect URIs in Discord Developer Portal

3. **Database**
   - SQLite database will be automatically created
   - Consider database backups for production

## 🔧 Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or use existing one
3. Navigate to OAuth2 settings
4. Add redirect URIs:
   - Development: `http://localhost:3000/admin.html`
   - Production: `https://syntaxbots.live/admin.html`
5. Copy Client ID and Client Secret to your `.env` file

## 📊 API Endpoints

### Public Endpoints
- `GET /api/bots` - Get all published bots with full details

### Protected Endpoints (Admin Only)
- `GET /api/admin/bots` - Get all bots for authenticated user
- `POST /api/admin/bots` - Create a new bot entry
- `PUT /api/admin/bots/:id` - Update existing bot
- `DELETE /api/admin/bots/:id` - Delete bot entry
- `POST /api/auth/discord` - Discord OAuth authentication

## 🗄️ Database Schema

### Bots Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique bot identifier (PRIMARY KEY) |
| name | TEXT | Bot display name |
| description | TEXT | Bot description |
| icon | TEXT | Font Awesome icon class |
| status | TEXT | Online/Offline status |
| servers | TEXT | Server count |
| users | TEXT | User count |
| tags | TEXT | JSON array of tags |
| features | TEXT | JSON array of features |
| invite_url | TEXT | Bot invite link |
| support_url | TEXT | Support server link |
| github_url | TEXT | Source code repository |
| owner_id | TEXT | Discord user ID of owner |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## 🎨 Customization

### Themes
- Built-in dark/light theme toggle
- Theme preference saved in localStorage
- CSS custom properties for easy theming

### Branding
- Update colors in CSS custom properties
- Replace logo and branding elements
- Customize Font Awesome icons

### Legal Pages
- Privacy Policy (GDPR, CCPA, COPPA compliant)
- Terms of Service
- Contact information

## 🔒 Security Features

- ✅ JWT-based authentication with secure tokens
- ✅ Discord OAuth2 integration
- ✅ Environment variable protection
- ✅ SQL injection prevention with parameterized queries
- ✅ Admin-only access control
- ✅ CORS configuration for production
- ✅ Input validation and sanitization

## 🌍 Production Features

- **Domain**: syntaxbots.live
- **SSL**: HTTPS encryption
- **Performance**: Optimized static file serving
- **SEO**: Meta tags and semantic HTML
- **Analytics**: Ready for Google Analytics integration
- **CDN**: Font Awesome and Google Fonts via CDN

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_CLIENT_ID` | Discord application client ID | `123456789012345678` |
| `DISCORD_CLIENT_SECRET` | Discord application secret | `abc123...` |
| `REDIRECT_URI` | OAuth redirect URI | `https://syntaxbots.live/admin.html` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://syntaxbots.live` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Website**: [syntaxbots.live](https://syntaxbots.live)
- **Issues**: [GitHub Issues](https://github.com/syntaxnite/syntax-bots/issues)
- **Contact**: Through the contact page on syntaxbots.live

## 🚀 Deployment Status

- ✅ Development environment configured
- ✅ Production environment ready
- ✅ Domain configured: syntaxbots.live
- ✅ SSL ready
- ✅ Database optimized
- ✅ Security hardened

---

**Made with ❤️ for the Discord bot community**

Visit us at [syntaxbots.live](https://syntaxbots.live)!
