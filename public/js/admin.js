/**
 * SyntaxBots Admin Panel - JavaScript
 * Handles Discord OAuth authentication and bot management
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const DISCORD_CLIENT_ID = '1397679023659683840'; // Replace with your Discord app client ID
const REDIRECT_URI = window.location.origin + '/admin.html';
const API_BASE_URL = window.location.origin + '/api';

// =============================================================================
// STATE MANAGEMENT
// =============================================================================

let currentUser = null;
let adminBots = [];
let editingBot = null;

// =============================================================================
// DOM ELEMENTS
// =============================================================================
const loginSection = document.getElementById('loginSection');
const dashboard = document.getElementById('dashboard');
const userMenu = document.getElementById('userMenu');
const discordLoginBtn = document.getElementById('discordLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addBotBtn = document.getElementById('addBotBtn');
const searchInput = document.getElementById('searchBots');

// Modal elements
const botModalOverlay = document.getElementById('botModalOverlay');
const botModalClose = document.getElementById('botModalClose');
const cancelBotBtn = document.getElementById('cancelBotBtn');
const saveBotBtn = document.getElementById('saveBotBtn');
const botForm = document.getElementById('botForm');

const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const deleteModalClose = document.getElementById('deleteModalClose');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Authentication Functions
function initializeAuth() {
    // Check if user is returning from Discord OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        console.log('OAuth code found, exchanging for token...');
        exchangeCodeForToken(code);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // Check for stored session
        const storedUser = localStorage.getItem('discord_user');
        const storedToken = localStorage.getItem('discord_token');
        
        console.log('Checking stored session...', { 
            hasUser: !!storedUser, 
            hasToken: !!storedToken 
        });
        
        if (storedUser && storedToken) {
            try {
                currentUser = JSON.parse(storedUser);
                console.log('Valid session found for user:', currentUser.username);
                // Verify the token is still valid by making a test API call
                verifyTokenAndShowDashboard();
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear invalid data and show login
                localStorage.removeItem('discord_user');
                localStorage.removeItem('discord_token');
                showLogin();
            }
        } else {
            console.log('No valid session found, showing login');
            showLogin();
        }
    }
}

async function verifyTokenAndShowDashboard() {
    try {
        const token = localStorage.getItem('discord_token');
        const response = await fetch(`${API_BASE_URL}/admin/bots`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            console.log('Token is valid, showing dashboard');
            showDashboard();
        } else if (response.status === 401 || response.status === 403) {
            console.log('Token is invalid or expired, clearing session');
            localStorage.removeItem('discord_user');
            localStorage.removeItem('discord_token');
            currentUser = null;
            showLogin();
        } else {
            console.log('API error, but showing dashboard anyway');
            showDashboard();
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        // On network error, still show dashboard if we have user data
        showDashboard();
    }
}

async function exchangeCodeForToken(code) {
    try {
        // In a real implementation, this should be done on your backend
        // This is a simplified example
        const response = await fetch(`${API_BASE_URL}/auth/discord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('discord_user', JSON.stringify(currentUser));
            localStorage.setItem('discord_token', data.token);
            showDashboard();
        } else if (response.status === 403) {
            const errorData = await response.json();
            showAuthorizationError(errorData.message);
        } else {
            console.error('Failed to authenticate');
            showLogin();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showLogin();
    }
}

function loginWithDiscord() {
    const scopes = 'identify email';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`;
    window.location.href = discordAuthUrl;
}

function logout() {
    localStorage.removeItem('discord_user');
    localStorage.removeItem('discord_token');
    currentUser = null;
    showLogin();
}

function showLogin() {
    loginSection.style.display = 'block';
    dashboard.style.display = 'none';
    userMenu.style.display = 'none';
}

function showAuthorizationError(message) {
    loginSection.style.display = 'block';
    dashboard.style.display = 'none';
    userMenu.style.display = 'none';
    
    // Show error message in login card
    const loginCard = document.querySelector('.login-card');
    const existingError = loginCard.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Access Denied</h3>
        <p>${message}</p>
    `;
    
    const loginHeader = loginCard.querySelector('.login-header');
    loginHeader.appendChild(errorDiv);
}

function showDashboard() {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
    userMenu.style.display = 'flex';
    
    // Update user menu
    document.getElementById('userAvatar').src = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`;
    document.getElementById('userName').textContent = currentUser.username;
    
    // Update welcome message
    document.getElementById('welcomeUserName').textContent = currentUser.username;
    
    // Scroll to dashboard section smoothly
    setTimeout(() => {
        const dashboardElement = document.getElementById('dashboard');
        if (dashboardElement) {
            dashboardElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
    
    // Show success notification only for new logins
    const isNewLogin = !adminBots || adminBots.length === 0;
    if (isNewLogin) {
        setTimeout(() => {
            showNotification(`Welcome back, ${currentUser.username}! 🎉`, 'success');
        }, 800);
    }
    
    // Load admin data only if not already loaded
    if (!adminBots || adminBots.length === 0) {
        loadAdminBots();
    } else {
        updateDashboardStats();
        renderBotsTable();
    }
}

// API Functions
async function loadAdminBots() {
    try {
        const token = localStorage.getItem('discord_token');
        const response = await fetch(`${API_BASE_URL}/admin/bots`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            adminBots = await response.json();
            updateDashboardStats();
            renderBotsTable();
        } else if (response.status === 403 || response.status === 401) {
            // Token is invalid - redirect to login
            console.log('Authentication failed, redirecting to login');
            localStorage.removeItem('discord_user');
            localStorage.removeItem('discord_token');
            currentUser = null;
            showLogin();
        } else {
            console.error('Failed to load bots, status:', response.status);
            adminBots = [];
            updateDashboardStats();
            renderBotsTable();
        }
    } catch (error) {
        console.error('Error loading bots:', error);
        // On network error, show empty state
        adminBots = [];
        updateDashboardStats();
        renderBotsTable();
    }
}

async function saveBot(botData) {
    try {
        const token = localStorage.getItem('discord_token');
        const url = editingBot ? 
            `${API_BASE_URL}/admin/bots/${editingBot.id}` : 
            `${API_BASE_URL}/admin/bots`;
        
        const method = editingBot ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(botData)
        });
        
        if (response.ok) {
            const savedBot = await response.json();
            
            if (editingBot) {
                const index = adminBots.findIndex(bot => bot.id === editingBot.id);
                if (index !== -1) {
                    adminBots[index] = savedBot;
                }
            } else {
                adminBots.push(savedBot);
            }
            
            updateDashboardStats();
            renderBotsTable();
            closeBotModal();
            showNotification('Bot saved successfully!', 'success');
        } else if (response.status === 403) {
            logout();
            showAuthorizationError('You are not authorized to perform this action');
        } else {
            throw new Error('Failed to save bot');
        }
    } catch (error) {
        console.error('Error saving bot:', error);
        showNotification('Failed to save bot. Please try again.', 'error');
    }
}

async function deleteBot(botId) {
    try {
        const token = localStorage.getItem('discord_token');
        const response = await fetch(`${API_BASE_URL}/admin/bots/${botId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            adminBots = adminBots.filter(bot => bot.id !== botId);
            updateDashboardStats();
            renderBotsTable();
            closeDeleteModal();
            showNotification('Bot deleted successfully!', 'success');
        } else if (response.status === 403) {
            logout();
            showAuthorizationError('You are not authorized to perform this action');
        } else {
            throw new Error('Failed to delete bot');
        }
    } catch (error) {
        console.error('Error deleting bot:', error);
        showNotification('Failed to delete bot. Please try again.', 'error');
    }
}

// UI Functions
function updateDashboardStats() {
    const totalBots = adminBots.length;
    const totalServers = adminBots.reduce((sum, bot) => {
        const servers = parseInt(bot.servers?.replace(/,/g, '') || '0');
        return sum + servers;
    }, 0);
    const totalUsers = adminBots.reduce((sum, bot) => {
        const users = parseInt(bot.users?.replace(/,/g, '') || '0');
        return sum + users;
    }, 0);
    
    document.getElementById('totalBots').textContent = totalBots;
    document.getElementById('totalServers').textContent = totalServers.toLocaleString();
    document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
}

function renderBotsTable() {
    const tbody = document.getElementById('botsTableBody');
    
    if (adminBots.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-robot"></i>
                    <h3>No bots found</h3>
                    <p>Add your first Discord bot to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminBots.map(bot => `
        <tr>
            <td>
                <div class="bot-info-cell">
                    <div class="bot-table-icon">
                        <i class="${bot.icon || 'fas fa-robot'}"></i>
                    </div>
                    <div>
                        <div class="bot-name">${bot.name}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge status-${bot.status?.toLowerCase() || 'offline'}">
                    ${bot.status || 'Offline'}
                </span>
            </td>
            <td>${bot.servers || '0'}</td>
            <td>${bot.users || '0'}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editBot('${bot.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="showDeleteModal('${bot.id}', '${bot.name}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddBotModal() {
    editingBot = null;
    document.getElementById('botModalTitle').textContent = 'Add New Bot';
    document.getElementById('saveBotBtn').innerHTML = '<i class="fas fa-plus"></i> Add Bot';
    clearBotForm();
    botModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function editBot(botId) {
    editingBot = adminBots.find(bot => bot.id === botId);
    if (!editingBot) return;
    
    document.getElementById('botModalTitle').textContent = 'Edit Bot';
    document.getElementById('saveBotBtn').innerHTML = '<i class="fas fa-save"></i> Update Bot';
    
    // Populate form with bot data
    document.getElementById('botName').value = editingBot.name || '';
    document.getElementById('botId').value = editingBot.id || '';
    document.getElementById('botDescription').value = editingBot.description || '';
    document.getElementById('botIcon').value = editingBot.icon || '';
    document.getElementById('botStatus').value = editingBot.status || 'Online';
    document.getElementById('botServers').value = editingBot.servers || '';
    document.getElementById('botUsers').value = editingBot.users || '';
    document.getElementById('botTags').value = editingBot.tags?.join(', ') || '';
    document.getElementById('botInviteUrl').value = editingBot.inviteUrl || '';
    document.getElementById('botFeatures').value = editingBot.features?.join('\n') || '';
    document.getElementById('botSupportUrl').value = editingBot.supportUrl || '';
    document.getElementById('botGithubUrl').value = editingBot.githubUrl || '';
    
    botModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function clearBotForm() {
    document.getElementById('botForm').reset();
}

function closeBotModal() {
    botModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    editingBot = null;
}

function showDeleteModal(botId, botName) {
    document.getElementById('deleteBotName').textContent = botName;
    confirmDeleteBtn.setAttribute('data-bot-id', botId);
    deleteModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    deleteModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function showNotification(message, type = 'info') {
    // Simple notification system - you can enhance this
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
discordLoginBtn.addEventListener('click', loginWithDiscord);
logoutBtn.addEventListener('click', logout);
addBotBtn.addEventListener('click', showAddBotModal);

// Modal event listeners
botModalClose.addEventListener('click', closeBotModal);
cancelBotBtn.addEventListener('click', closeBotModal);
deleteModalClose.addEventListener('click', closeDeleteModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

botModalOverlay.addEventListener('click', (e) => {
    if (e.target === botModalOverlay) {
        closeBotModal();
    }
});

deleteModalOverlay.addEventListener('click', (e) => {
    if (e.target === deleteModalOverlay) {
        closeDeleteModal();
    }
});

// Form submission
botForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(botForm);
    const botData = {
        name: formData.get('name'),
        id: formData.get('id'),
        description: formData.get('description'),
        icon: formData.get('icon') || 'fas fa-robot',
        status: formData.get('status'),
        servers: formData.get('servers'),
        users: formData.get('users'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        features: formData.get('features').split('\n').map(feature => feature.trim()).filter(feature => feature),
        inviteUrl: formData.get('inviteUrl'),
        supportUrl: formData.get('supportUrl'),
        githubUrl: formData.get('githubUrl')
    };
    
    saveBot(botData);
});

// Delete confirmation
confirmDeleteBtn.addEventListener('click', (e) => {
    const botId = e.target.getAttribute('data-bot-id');
    if (botId) {
        deleteBot(botId);
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBots = adminBots.filter(bot => 
        bot.name.toLowerCase().includes(searchTerm) ||
        bot.description.toLowerCase().includes(searchTerm) ||
        bot.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    // Temporarily update the displayed bots
    const originalBots = adminBots;
    adminBots = filteredBots;
    renderBotsTable();
    adminBots = originalBots;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (botModalOverlay.classList.contains('active')) {
            closeBotModal();
        }
        if (deleteModalOverlay.classList.contains('active')) {
            closeDeleteModal();
        }
    }
});

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', () => {
    // Add debug info to console
    console.log('=== Admin Panel Debug Info ===');
    console.log('Current URL:', window.location.href);
    console.log('Stored user:', localStorage.getItem('discord_user'));
    console.log('Stored token exists:', !!localStorage.getItem('discord_token'));
    console.log('==============================');
    
    initializeAuth();
    
    // Apply theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        // Add theme toggle functionality
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            if (newTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
