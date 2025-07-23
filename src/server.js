const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Environment variables
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ALLOWED_ADMIN_ID = '1385749774053146715'; // Only this Discord user can access admin

// App configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !JWT_SECRET) {
    console.error('❌ Missing required environment variables. Please check your .env file.');
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('./public'));

// Initialize SQLite database with error handling
const db = new sqlite3.Database('./bots.db', (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS bots (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            icon TEXT DEFAULT 'fas fa-robot',
            status TEXT DEFAULT 'Online',
            servers TEXT,
            users TEXT,
            tags TEXT,
            features TEXT,
            invite_url TEXT,
            support_url TEXT,
            github_url TEXT,
            owner_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            avatar TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Database helper functions
const formatBotResponse = (bot) => ({
    id: bot.id,
    name: bot.name,
    description: bot.description,
    icon: bot.icon,
    status: bot.status,
    servers: bot.servers,
    users: bot.users,
    tags: bot.tags ? JSON.parse(bot.tags) : [],
    features: bot.features ? JSON.parse(bot.features) : [],
    inviteUrl: bot.invite_url,
    supportUrl: bot.support_url,
    githubUrl: bot.github_url,
    createdAt: bot.created_at,
    updatedAt: bot.updated_at
});

const handleDatabaseError = (err, res, message = 'Database operation failed') => {
    console.error('Database error:', err);
    return res.status(500).json({ 
        error: 'Internal Server Error', 
        message 
    });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'Invalid or missing authentication token' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'Invalid token' 
            });
        }
        
        // Check if user is the authorized admin
        if (user.id !== ALLOWED_ADMIN_ID) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'You are not authorized to access admin features' 
            });
        }
        
        req.user = user;
        next();
    });
};

// Public Routes

// Get all published bots
app.get('/api/bots', (req, res) => {
    const query = `
        SELECT id, name, description, icon, status, servers, users, tags, features, 
               invite_url, support_url, github_url
        FROM bots 
        WHERE status != 'Private'
        ORDER BY created_at DESC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            return handleDatabaseError(err, res, 'Failed to fetch bots');
        }
        
        const bots = rows.map(formatBotResponse);
        res.json(bots);
    });
});

// Authentication Routes

// Discord OAuth callback
app.post('/api/auth/discord', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ 
            error: 'Bad Request', 
            message: 'Authorization code is required' 
        });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
            new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token } = tokenResponse.data;        // Get user info from Discord
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const discordUser = userResponse.data;

        // Check if user is authorized admin
        if (discordUser.id !== ALLOWED_ADMIN_ID) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'You are not authorized to access the admin panel' 
            });
        }

        // Save or update user in database
        db.run(`
            INSERT OR REPLACE INTO users (id, username, avatar, email)
            VALUES (?, ?, ?, ?)
        `, [discordUser.id, discordUser.username, discordUser.avatar, discordUser.email]);

        // Create JWT token
        const jwtToken = jwt.sign(
            { 
                id: discordUser.id, 
                username: discordUser.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token: jwtToken,
            user: {
                id: discordUser.id,
                username: discordUser.username,
                avatar: discordUser.avatar,
                email: discordUser.email,
            },
        });
    } catch (error) {
        console.error('Discord OAuth error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: 'Failed to authenticate with Discord' 
        });
    }
});

// Admin Routes (Protected)

// Get all bots for authenticated user
app.get('/api/admin/bots', authenticateToken, (req, res) => {
    const query = `
        SELECT * FROM bots 
        WHERE owner_id = ? 
        ORDER BY created_at DESC
    `;
    
    db.all(query, [req.user.id], (err, rows) => {
        if (err) {
            return handleDatabaseError(err, res, 'Failed to fetch bots');
        }
        
        const bots = rows.map(formatBotResponse);
        res.json(bots);
    });
});

// Create new bot
app.post('/api/admin/bots', authenticateToken, (req, res) => {
    const { id, name, description, icon, status, servers, users, tags, features, inviteUrl, supportUrl, githubUrl } = req.body;
    
    if (!id || !name || !description) {
        return res.status(400).json({ 
            error: 'Bad Request', 
            message: 'Bot ID, name, and description are required' 
        });
    }

    const now = new Date().toISOString();
    
    db.run(`
        INSERT INTO bots (
            id, name, description, icon, status, servers, users, tags, features, 
            invite_url, support_url, github_url, owner_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        id, name, description, icon || 'fas fa-robot', status || 'Online',
        servers || '0', users || '0', JSON.stringify(tags || []), 
        JSON.stringify(features || []), inviteUrl || '', supportUrl || '', githubUrl || '',
        req.user.id, now, now
    ], function(err) {
        if (err) {
            console.error('Database error:', err);
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ 
                    error: 'Bad Request', 
                    message: 'Bot with this ID already exists' 
                });
            }
            return res.status(500).json({ 
                error: 'Internal Server Error', 
                message: 'Failed to create bot' 
            });
        }
        
        // Return the created bot
        res.status(201).json({
            id, name, description, icon: icon || 'fas fa-robot', 
            status: status || 'Online', servers: servers || '0', 
            users: users || '0', tags: tags || [], features: features || [],
            inviteUrl: inviteUrl || '', supportUrl: supportUrl || '', githubUrl: githubUrl || '',
            createdAt: now, updatedAt: now
        });
    });
});

// Update bot
app.put('/api/admin/bots/:id', authenticateToken, (req, res) => {
    const botId = req.params.id;
    const { name, description, icon, status, servers, users, tags, features, inviteUrl, supportUrl, githubUrl } = req.body;
    
    if (!name || !description) {
        return res.status(400).json({ 
            error: 'Bad Request', 
            message: 'Name and description are required' 
        });
    }

    const now = new Date().toISOString();
    
    db.run(`
        UPDATE bots SET 
            name = ?, description = ?, icon = ?, status = ?, servers = ?, users = ?,
            tags = ?, features = ?, invite_url = ?, support_url = ?, github_url = ?, updated_at = ?
        WHERE id = ? AND owner_id = ?
    `, [
        name, description, icon, status, servers, users,
        JSON.stringify(tags || []), JSON.stringify(features || []),
        inviteUrl || '', supportUrl || '', githubUrl || '', now, botId, req.user.id
    ], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                error: 'Internal Server Error', 
                message: 'Failed to update bot' 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                error: 'Not Found', 
                message: 'Bot not found' 
            });
        }
        
        // Get and return the updated bot
        db.get(`
            SELECT * FROM bots WHERE id = ? AND owner_id = ?
        `, [botId, req.user.id], (err, row) => {
            if (err || !row) {
                return res.status(500).json({ 
                    error: 'Internal Server Error', 
                    message: 'Failed to fetch updated bot' 
                });
            }
            
            res.json({
                id: row.id,
                name: row.name,
                description: row.description,
                icon: row.icon,
                status: row.status,
                servers: row.servers,
                users: row.users,
                tags: row.tags ? JSON.parse(row.tags) : [],
                features: row.features ? JSON.parse(row.features) : [],
                inviteUrl: row.invite_url,
                supportUrl: row.support_url,
                githubUrl: row.github_url,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            });
        });
    });
});

// Delete bot
app.delete('/api/admin/bots/:id', authenticateToken, (req, res) => {
    const botId = req.params.id;
    
    db.run(`
        DELETE FROM bots WHERE id = ? AND owner_id = ?
    `, [botId, req.user.id], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                error: 'Internal Server Error', 
                message: 'Failed to delete bot' 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                error: 'Not Found', 
                message: 'Bot not found' 
            });
        }
        
        res.json({ message: 'Bot deleted successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: 'Something went wrong' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from current directory`);
    console.log(`🔐 Admin panel available at http://localhost:${PORT}/admin.html`);
    console.log(`🌐 Main website available at http://localhost:${PORT}/index.html`);
});
