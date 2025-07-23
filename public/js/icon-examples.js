// Icon Class Usage Examples

// Basic usage examples for the Icon class

// 1. Simple icon creation
const robotIcon = new Icon('robot');
document.body.appendChild(robotIcon.createElement());

// 2. Icon with options
const discordIcon = new Icon('discord', {
    size: 'lg',
    color: '#5865f2',
    title: 'Discord Bot',
    ariaLabel: 'Discord Bot Icon'
});

// 3. Using the static methods
const quickIcon = Icon.render('settings', { size: 'md', color: 'var(--primary)' });
document.querySelector('#settings-button').appendChild(quickIcon);

// 4. Getting HTML string
const heartIconHTML = Icon.html('heart', { color: 'red', size: 'xl' });
document.querySelector('#like-button').innerHTML = heartIconHTML;

// 5. Bot card usage (replacing current icon system)
function createBotCard(bot) {
    const card = document.createElement('div');
    card.className = 'bot-card';
    
    // Create bot icon using the Icon class
    const botIcon = new Icon(bot.icon || 'robot', {
        size: '2xl',
        className: 'bot-icon',
        title: `${bot.name} Icon`
    });
    
    card.innerHTML = `
        <div class="bot-header">
            <div class="bot-icon-container">
                ${botIcon.toHTML()}
            </div>
            <div class="bot-info">
                <h3>${bot.name}</h3>
                <div class="bot-status">
                    ${Icon.html('circle', { color: 'var(--success)', size: 'xs' })}
                    ${bot.status}
                </div>
            </div>
        </div>
        <p class="bot-description">${bot.description}</p>
        <div class="bot-stats">
            <div class="stat">
                <span class="stat-value">${bot.servers}</span>
                <span class="stat-label">
                    ${Icon.html('server', { size: 'sm' })} Servers
                </span>
            </div>
            <div class="stat">
                <span class="stat-value">${bot.users}</span>
                <span class="stat-label">
                    ${Icon.html('users', { size: 'sm' })} Users
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// 6. Theme toggle button with icon class
function createThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    
    const themeIcon = new Icon(isDark ? 'sun' : 'moon', {
        size: 'lg',
        clickHandler: toggleTheme,
        title: `Switch to ${isDark ? 'light' : 'dark'} theme`,
        ariaLabel: 'Toggle theme'
    });
    
    return themeIcon.createElement();
}

// 7. Admin panel buttons with icons
function createAdminButtons(bot) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'admin-buttons';
    
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary';
    editBtn.appendChild(Icon.render('edit', { size: 'sm' }));
    editBtn.appendChild(document.createTextNode(' Edit'));
    editBtn.onclick = () => editBot(bot.id);
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.appendChild(Icon.render('trash', { size: 'sm' }));
    deleteBtn.appendChild(document.createTextNode(' Delete'));
    deleteBtn.onclick = () => deleteBot(bot.id);
    
    // View button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-primary';
    viewBtn.appendChild(Icon.render('eye', { size: 'sm' }));
    viewBtn.appendChild(document.createTextNode(' View'));
    viewBtn.onclick = () => viewBot(bot.id);
    
    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);
    buttonsContainer.appendChild(viewBtn);
    
    return buttonsContainer;
}

// 8. Status indicators with icons
function createStatusIndicator(status) {
    const statusMap = {
        'Online': { icon: 'circle', color: 'var(--success)' },
        'Offline': { icon: 'circle', color: 'var(--danger)' },
        'Maintenance': { icon: 'wrench', color: 'var(--warning)' },
        'Private': { icon: 'lock', color: 'var(--text-muted)' }
    };
    
    const statusConfig = statusMap[status] || statusMap['Offline'];
    
    return Icon.render(statusConfig.icon, {
        size: 'sm',
        color: statusConfig.color,
        title: `Status: ${status}`,
        ariaLabel: `Bot status: ${status}`
    });
}

// 9. Tag icons for bot features
function createFeatureTags(features) {
    const featureIcons = {
        'Music': 'music',
        'Moderation': 'shield',
        'Games': 'gamepad',
        'Utility': 'cog',
        'Fun': 'smile',
        'Economy': 'coins',
        'Social': 'users',
        'NSFW': 'eye-slash',
        'Anime': 'heart',
        'Memes': 'laugh'
    };
    
    return features.map(feature => {
        const icon = featureIcons[feature] || 'tag';
        return `<span class="feature-tag">
            ${Icon.html(icon, { size: 'xs' })}
            ${feature}
        </span>`;
    }).join('');
}

// 10. Navigation icons
function createNavigation() {
    const nav = document.querySelector('.nav-actions');
    
    // Admin link with icon
    const adminLink = document.createElement('a');
    adminLink.href = '/admin.html';
    adminLink.className = 'admin-link';
    adminLink.appendChild(Icon.render('crown', { size: 'sm' }));
    adminLink.appendChild(document.createTextNode(' Admin'));
    
    // Theme toggle
    const themeToggle = createThemeToggle();
    themeToggle.className = 'theme-toggle';
    
    nav.appendChild(adminLink);
    nav.appendChild(themeToggle);
}

// Example of integrating with existing code
function updateExistingIcons() {
    // Update all existing Font Awesome icons to use the Icon class
    document.querySelectorAll('i[class*="fa-"]').forEach(iconElement => {
        const classes = iconElement.className;
        const iconName = classes.split(' ').find(cls => cls.startsWith('fa-'))?.replace('fa-', '');
        
        if (iconName) {
            const icon = new Icon(iconName, {
                size: iconElement.style.fontSize || 'inherit',
                color: iconElement.style.color || 'inherit',
                className: iconElement.className.replace(/fa[sb]?\s+fa-\w+/g, '').trim()
            });
            
            const newElement = icon.createElement();
            iconElement.parentNode.replaceChild(newElement, iconElement);
        }
    });
}
