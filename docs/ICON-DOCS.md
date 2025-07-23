# Icon Class Documentation

The Icon class is a powerful utility for managing icons in the Discord Bot Showcase website. It provides a clean, object-oriented way to create and manage Font Awesome icons with additional customization options.

## Features

- ✅ Full Font Awesome icon support
- ✅ Customizable size, color, and styling
- ✅ Accessibility attributes
- ✅ Click handlers
- ✅ Common icon mappings for bot showcase
- ✅ Static methods for quick usage
- ✅ DOM manipulation methods
- ✅ CSS custom property support

## Basic Usage

### Creating an Icon

```javascript
// Basic icon
const robotIcon = new Icon('robot');

// Icon with options
const discordIcon = new Icon('discord', {
    size: 'lg',
    color: '#5865f2',
    title: 'Discord Bot',
    ariaLabel: 'Discord Bot Icon'
});
```

### Adding to DOM

```javascript
// Method 1: Create element and append
const icon = new Icon('settings');
document.body.appendChild(icon.createElement());

// Method 2: Use appendTo method
const icon = new Icon('heart').appendTo('#like-button');

// Method 3: Get HTML string
document.getElementById('container').innerHTML = Icon.html('star', { color: 'gold' });
```

## Static Methods

### Quick Creation

```javascript
// Render directly to DOM
const element = Icon.render('robot', { size: 'xl' });
document.body.appendChild(element);

// Get HTML string
const html = Icon.html('discord', { color: 'blue' });
document.querySelector('.container').innerHTML = html;

// Create instance
const icon = Icon.create('settings', { size: 'lg' });
```

## Configuration Options

### Size Options

```javascript
// Predefined sizes
new Icon('robot', { size: 'xs' });    // 0.75rem
new Icon('robot', { size: 'sm' });    // 0.875rem
new Icon('robot', { size: 'md' });    // 1rem (default)
new Icon('robot', { size: 'lg' });    // 1.25rem
new Icon('robot', { size: 'xl' });    // 1.5rem
new Icon('robot', { size: '2xl' });   // 2rem
new Icon('robot', { size: '3xl' });   // 3rem
new Icon('robot', { size: '4xl' });   // 4rem

// Custom sizes
new Icon('robot', { size: '1.5rem' });
new Icon('robot', { size: '24px' });
new Icon('robot', { size: 2 });       // 2rem
```

### Color Options

```javascript
// CSS custom properties (recommended)
new Icon('robot', { color: 'var(--primary)' });
new Icon('robot', { color: 'var(--success)' });

// Hex colors
new Icon('robot', { color: '#3b82f6' });

// Named colors
new Icon('robot', { color: 'red' });
new Icon('robot', { color: 'inherit' }); // Default
```

### Additional Options

```javascript
new Icon('robot', {
    size: 'lg',
    color: 'var(--primary)',
    className: 'custom-class another-class',
    title: 'Tooltip text',
    ariaLabel: 'Screen reader text',
    style: {
        marginRight: '8px',
        cursor: 'pointer'
    },
    clickHandler: () => console.log('Icon clicked!')
});
```

## Icon Name Mappings

The Icon class includes built-in mappings for common bot showcase icons:

```javascript
// These all work the same way:
new Icon('robot');        // Maps to 'fas fa-robot'
new Icon('bot');          // Maps to 'fas fa-robot'
new Icon('discord');      // Maps to 'fab fa-discord'
new Icon('users');        // Maps to 'fas fa-users'
new Icon('server');       // Maps to 'fas fa-server'
new Icon('settings');     // Maps to 'fas fa-cog'
new Icon('admin');        // Maps to 'fas fa-crown'
new Icon('theme');        // Maps to 'fas fa-palette'

// Full list available in icon.js file
```

## Common Use Cases

### Bot Cards

```javascript
function createBotCard(bot) {
    const card = document.createElement('div');
    card.className = 'bot-card';
    
    const botIcon = new Icon(bot.icon || 'robot', {
        size: '2xl',
        title: `${bot.name} Icon`
    });
    
    const statusIcon = new Icon('circle', {
        size: 'xs',
        color: bot.status === 'Online' ? 'var(--success)' : 'var(--danger)'
    });
    
    card.innerHTML = `
        <div class="bot-header">
            <div class="bot-icon">${botIcon.toHTML()}</div>
            <div class="bot-info">
                <h3>${bot.name}</h3>
                <div class="bot-status">
                    ${statusIcon.toHTML()}
                    ${bot.status}
                </div>
            </div>
        </div>
        <div class="bot-stats">
            <div class="stat">
                <span class="stat-value">${bot.servers}</span>
                <span class="stat-label">
                    ${Icon.html('server', { size: 'xs' })} Servers
                </span>
            </div>
        </div>
    `;
    
    return card;
}
```

### Theme Toggle

```javascript
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
```

### Admin Buttons

```javascript
function createActionButton(text, iconName, onClick, type = 'primary') {
    const button = document.createElement('button');
    button.className = `btn btn-${type}`;
    
    const icon = new Icon(iconName, { size: 'sm' });
    button.appendChild(icon.createElement());
    button.appendChild(document.createTextNode(` ${text}`));
    button.onclick = onClick;
    
    return button;
}

// Usage:
const editBtn = createActionButton('Edit', 'edit', () => editBot(id), 'secondary');
const deleteBtn = createActionButton('Delete', 'trash', () => deleteBot(id), 'danger');
```

### Feature Tags

```javascript
function createFeatureTags(features) {
    const featureIconMap = {
        'Music': 'music',
        'Moderation': 'shield',
        'Games': 'gamepad',
        'Utility': 'cog'
    };
    
    return features.map(feature => {
        const iconName = featureIconMap[feature] || 'tag';
        return `<span class="feature-tag">
            ${Icon.html(iconName, { size: 'xs' })}
            ${feature}
        </span>`;
    }).join('');
}
```

## Dynamic Updates

```javascript
const icon = new Icon('robot', { size: 'lg', color: 'blue' });
document.body.appendChild(icon.createElement());

// Update the icon
icon.update({
    iconName: 'discord',
    color: 'purple',
    size: 'xl'
});
```

## Accessibility

The Icon class automatically handles accessibility:

```javascript
// Icons with semantic meaning
new Icon('settings', {
    title: 'Open settings',
    ariaLabel: 'Settings button'
});

// Decorative icons (default)
new Icon('sparkles'); // Automatically gets aria-hidden="true"
```

## Integration with CSS Custom Properties

The Icon class works seamlessly with your CSS theme system:

```javascript
// Uses theme colors
new Icon('heart', { color: 'var(--primary)' });
new Icon('star', { color: 'var(--warning)' });
new Icon('check', { color: 'var(--success)' });
new Icon('x', { color: 'var(--danger)' });
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Font Awesome 6.0.0+
- Works with both module systems and global scope

## Performance Notes

- Icons are created only when needed
- Reuses created elements when possible
- Minimal DOM manipulation
- Supports efficient batch operations

## Migration from Font Awesome

Replace existing Font Awesome usage:

```javascript
// Old way:
element.innerHTML = '<i class="fas fa-robot"></i>';

// New way:
element.appendChild(Icon.render('robot'));

// Or:
element.innerHTML = Icon.html('robot');
```
