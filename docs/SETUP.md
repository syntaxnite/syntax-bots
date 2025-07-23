# Setup Guide - Discord OAuth & Admin Dashboard

This guide will help you set up the Discord OAuth authentication and get the admin dashboard running.

## Prerequisites

- Node.js (v16 or higher)
- A Discord application (we'll create this)

## Step 1: Install Dependencies

Open PowerShell in your project directory and run:

```powershell
npm install
```

## Step 2: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "SyntaxBots Website")
4. Go to the "OAuth2" section
5. Add redirect URI: `http://localhost:3000/admin.html`
6. Copy your **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit the `.env` file with your Discord app details:
   ```env
   DISCORD_CLIENT_ID=your_actual_client_id_here
   DISCORD_CLIENT_SECRET=your_actual_client_secret_here
   REDIRECT_URI=http://localhost:3000/admin.html
   JWT_SECRET=your-super-secret-random-string-here
   PORT=3000
   ```

3. Update `admin.js` with your Discord Client ID:
   - Open `admin.js`
   - Replace `YOUR_DISCORD_CLIENT_ID` with your actual client ID

## Step 4: Start the Server

Run the development server:

```powershell
npm run dev
```

Or for production:

```powershell
npm start
```

## Step 5: Test the Setup

1. **Main Website**: Open http://localhost:3000/index.html
2. **Admin Panel**: Open http://localhost:3000/admin.html
3. Click "Login with Discord" and authorize the application
4. You should be redirected back to the admin dashboard

## Step 6: Add Your First Bot

1. In the admin dashboard, click "Add New Bot"
2. Fill in the bot details:
   - **Bot ID**: Your Discord bot's client ID
   - **Name**: Display name for your bot
   - **Description**: What your bot does
   - **Icon**: Font Awesome icon class (e.g., `fas fa-music`)
   - **Status**: Online/Offline/Maintenance
   - **Servers/Users**: Current statistics
   - **Tags**: Comma-separated features
   - **Features**: One feature per line
   - **Invite URL**: Your bot's invite link
   - **Support URL**: Your Discord server invite

3. Click "Save Bot"
4. Check the main website to see your bot displayed

## Troubleshooting

### OAuth Issues
- Make sure your Discord app redirect URI exactly matches: `http://localhost:3000/admin.html`
- Ensure your Client ID and Secret are correct in the `.env` file
- Check browser console for any JavaScript errors

### Database Issues
- The SQLite database (`bots.db`) will be created automatically
- If you need to reset it, just delete the `bots.db` file and restart the server

### Port Issues
- If port 3000 is in use, change the `PORT` in `.env` file
- Update the Discord redirect URI to match the new port

## File Structure After Setup

```
syntaxbotsweb/
├── node_modules/       # Dependencies (created after npm install)
├── bots.db            # SQLite database (created automatically)
├── .env               # Your environment variables (create from .env.example)
├── package.json       # Node.js dependencies
├── server.js          # Backend API server
├── index.html         # Main website
├── admin.html         # Admin panel
├── styles.css         # Main styles
├── admin.css          # Admin styles
├── script.js          # Main website JavaScript
├── admin.js           # Admin panel JavaScript
└── API.md            # API documentation
```

## Next Steps

1. **Customize**: Update the website branding and colors to match your style
2. **Deploy**: When ready, deploy to a hosting service like Heroku, Railway, or DigitalOcean
3. **Domain**: Update Discord OAuth redirect URI to your production domain
4. **SSL**: Use HTTPS in production for security

## Development Commands

```powershell
# Install dependencies
npm install

# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start

# View logs
# The server will show all requests and any errors in the console
```

## Production Deployment Notes

When deploying to production:

1. Update Discord OAuth redirect URI to your domain
2. Set environment variables on your hosting platform
3. Use a proper database (PostgreSQL, MySQL) instead of SQLite
4. Enable HTTPS
5. Set up proper logging and monitoring

That's it! Your Discord bot showcase website with OAuth authentication is now ready to use. 🚀
