/**
 * SyntaxBots Website - Main JavaScript
 * Handles theme management, bot data loading, and user interactions
 */

// =============================================================================
// THEME MANAGEMENT
// =============================================================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

/**
 * Updates the theme toggle icon based on current theme
 */
function updateThemeIcon() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const iconName = isDark ? 'sun' : 'moon';
    
    // Clear existing icon and create new one
    themeToggle.innerHTML = '';
    const themeIcon = new Icon(iconName, {
        size: 'lg',
        title: `Switch to ${isDark ? 'light' : 'dark'} theme`,
        ariaLabel: 'Toggle theme'
    });
    
    themeToggle.appendChild(themeIcon.createElement());
}

// Initialize theme
updateThemeIcon();

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// =============================================================================
// BOT DATA MANAGEMENT
// =============================================================================

// Bot data - Will be loaded from API
let botData = [];

// API Configuration
const MAIN_API_BASE_URL = window.location.origin + '/api';

/**
 * Loads bot data from the API
 */
async function loadBots() {
    try {
        const response = await fetch(`${MAIN_API_BASE_URL}/bots`);
        if (response.ok) {
            botData = await response.json();
            generateBotCards();
        } else {
            console.error('Failed to load bots');
            showNoBots();
        }
    } catch (error) {
        console.error('Error loading bots:', error);
        showNoBots();
    }
}

function showNoBots() {
    const botsGrid = document.getElementById('botsGrid');
    botsGrid.innerHTML = `
        <div class="no-bots">
            <i class="fas fa-robot"></i>
            <h3>No bots available</h3>
            <p>Check back later for new Discord bots!</p>
        </div>
    `;
}

// =============================================================================
// BOT CARD GENERATION
// =============================================================================

/**
 * Generates and displays bot cards from bot data
 */
function generateBotCards() {
    const botsGrid = document.getElementById('botsGrid');
    botsGrid.innerHTML = ''; // Clear existing cards
    
    if (botData.length === 0) {
        showNoBots();
        return;
    }
    
    botData.forEach(bot => {
        const botCard = document.createElement('div');
        botCard.className = 'bot-card';
        botCard.setAttribute('data-bot-id', bot.id);
        
        // Create bot icon using Icon class
        const botIcon = new Icon(bot.icon || 'robot', {
            size: '2xl',
            title: `${bot.name} Icon`
        });
        
        // Create status indicator using Icon class
        const statusIcon = new Icon('circle', {
            size: 'xs',
            color: bot.status === 'Online' ? 'var(--success)' : 'var(--danger)',
            className: 'status-dot',
            title: `Status: ${bot.status}`
        });
        
        botCard.innerHTML = `
            <div class="bot-header">
                <div class="bot-icon">
                    ${botIcon.toHTML()}
                </div>
                <div class="bot-info">
                    <h3>${bot.name}</h3>
                    <div class="bot-status">
                        ${statusIcon.toHTML()}
                        ${bot.status}
                    </div>
                </div>
            </div>
            <p class="bot-description">${bot.description}</p>
            <div class="bot-stats">
                <div class="stat">
                    <span class="stat-value">${bot.servers}</span>
                    <span class="stat-label">
                        ${Icon.html('server', { size: 'xs' })} Servers
                    </span>
                </div>
                <div class="stat">
                    <span class="stat-value">${bot.users}</span>
                    <span class="stat-label">
                        ${Icon.html('users', { size: 'xs' })} Users
                    </span>
                </div>
            </div>
            <div class="bot-tags">
                ${bot.tags.map(tag => `<span class="tag">${Icon.html('tag', { size: 'xs' })} ${tag}</span>`).join('')}
            </div>
        `;
        
        botCard.addEventListener('click', () => openBotModal(bot));
        botsGrid.appendChild(botCard);
    });
    
    // Add animation after cards are generated
    setTimeout(() => {
        const botCards = document.querySelectorAll('.bot-card');
        botCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }, 100);
}

// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

// Only initialize modal functionality if elements exist (main page)
if (modalOverlay && modalClose) {
    function openBotModal(bot) {
        // Populate modal content
        document.getElementById('modalTitle').textContent = bot.name;
        
        // Update modal icon using Icon class
        const modalIconContainer = document.getElementById('modalIcon');
        modalIconContainer.innerHTML = '';
        const modalIcon = new Icon(bot.icon || 'robot', {
            size: '3xl',
            title: `${bot.name} Icon`
        });
        modalIconContainer.appendChild(modalIcon.createElement());
        
        document.getElementById('modalDescription').textContent = bot.description;
        document.getElementById('modalServers').textContent = bot.servers;
        document.getElementById('modalUsers').textContent = bot.users;
        
        // Populate features list with icons
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        bot.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `${Icon.html('check', { size: 'xs', color: 'var(--success)' })} ${feature}`;
            featuresList.appendChild(li);
        });
        
        // Update action buttons with icons
        const inviteBtn = document.getElementById('modalInviteBtn');
        const supportBtn = document.getElementById('modalSupportBtn');
        const githubBtn = document.getElementById('modalGithubBtn');
        
        inviteBtn.href = bot.inviteUrl;
        inviteBtn.innerHTML = `${Icon.html('external', { size: 'sm' })} Invite Bot`;
        
        supportBtn.href = bot.supportUrl;
        supportBtn.innerHTML = `${Icon.html('heart', { size: 'sm' })} Support`;
        
        // Show/hide GitHub button based on availability
        if (bot.githubUrl && bot.githubUrl.trim() !== '') {
            githubBtn.href = bot.githubUrl;
            githubBtn.innerHTML = `${Icon.html('github', { size: 'sm' })} View Source`;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }
        
        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBotModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Modal event listeners
    modalClose.addEventListener('click', closeBotModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeBotModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeBotModal();
        }
    });
}

// Smooth scrolling function
function scrollToBots() {
    const botsSection = document.getElementById('bots');
    if (botsSection) {
        botsSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Header scroll effect (only on main page)
if (document.querySelector('.hero')) {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = document.body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.background = document.body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(15, 23, 42, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)';
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadBots(); // Load bots from API instead of generating static cards
    
    // Observe bot cards for animation (will be called after bots are loaded)
    // Animation logic moved to generateBotCards function
});

// Add some interactive effects (only on main page)
if (document.querySelector('.hero')) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.bot-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            } else {
                card.style.transform = '';
            }
        });
    });

    // Reset card transforms when mouse leaves
    document.addEventListener('mouseleave', () => {
        const cards = document.querySelectorAll('.bot-card');
        cards.forEach(card => {
            card.style.transform = '';
        });
    });
}
