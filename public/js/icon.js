/**
 * Icon Class for managing icons in the Discord Bot Showcase
 * Supports Font Awesome icons with customization options
 */
class Icon {
    constructor(iconName, options = {}) {
        this.iconName = iconName;
        this.options = {
            size: options.size || 'inherit',
            color: options.color || 'inherit',
            className: options.className || '',
            style: options.style || {},
            title: options.title || '',
            ariaLabel: options.ariaLabel || '',
            clickHandler: options.clickHandler || null,
            ...options
        };
        
        this.element = null;
        this.created = false;
    }

    /**
     * Create the icon element
     * @returns {HTMLElement} The created icon element
     */
    createElement() {
        if (this.created && this.element) {
            return this.element;
        }

        const icon = document.createElement('i');
        
        // Set icon classes
        const iconClasses = this.parseIconName(this.iconName);
        icon.className = `${iconClasses} ${this.options.className}`.trim();
        
        // Set size
        if (this.options.size !== 'inherit') {
            icon.style.fontSize = this.getSizeValue(this.options.size);
        }
        
        // Set color
        if (this.options.color !== 'inherit') {
            icon.style.color = this.options.color;
        }
        
        // Apply custom styles
        Object.assign(icon.style, this.options.style);
        
        // Set accessibility attributes
        if (this.options.title) {
            icon.title = this.options.title;
        }
        
        if (this.options.ariaLabel) {
            icon.setAttribute('aria-label', this.options.ariaLabel);
        } else {
            icon.setAttribute('aria-hidden', 'true');
        }
        
        // Add click handler if provided
        if (this.options.clickHandler && typeof this.options.clickHandler === 'function') {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', this.options.clickHandler);
        }
        
        this.element = icon;
        this.created = true;
        
        return icon;
    }

    /**
     * Parse icon name to proper Font Awesome classes
     * @param {string} iconName - The icon name (supports various formats)
     * @returns {string} Proper Font Awesome classes
     */
    parseIconName(iconName) {
        // If already has font awesome prefix, return as is
        if (iconName.includes('fa-')) {
            return iconName;
        }
        
        // Common icon mappings for the bot showcase
        const iconMappings = {
            'robot': 'fas fa-robot',
            'bot': 'fas fa-robot',
            'discord': 'fab fa-discord',
            'server': 'fas fa-server',
            'users': 'fas fa-users',
            'user': 'fas fa-user',
            'cog': 'fas fa-cog',
            'settings': 'fas fa-cog',
            'plus': 'fas fa-plus',
            'edit': 'fas fa-edit',
            'trash': 'fas fa-trash',
            'delete': 'fas fa-trash',
            'eye': 'fas fa-eye',
            'view': 'fas fa-eye',
            'link': 'fas fa-external-link-alt',
            'external': 'fas fa-external-link-alt',
            'heart': 'fas fa-heart',
            'star': 'fas fa-star',
            'home': 'fas fa-home',
            'dashboard': 'fas fa-tachometer-alt',
            'chart': 'fas fa-chart-bar',
            'shield': 'fas fa-shield-alt',
            'lock': 'fas fa-lock',
            'unlock': 'fas fa-unlock',
            'key': 'fas fa-key',
            'crown': 'fas fa-crown',
            'admin': 'fas fa-crown',
            'moon': 'fas fa-moon',
            'sun': 'fas fa-sun',
            'theme': 'fas fa-palette',
            'palette': 'fas fa-palette',
            'close': 'fas fa-times',
            'x': 'fas fa-times',
            'check': 'fas fa-check',
            'save': 'fas fa-save',
            'download': 'fas fa-download',
            'upload': 'fas fa-upload',
            'search': 'fas fa-search',
            'filter': 'fas fa-filter',
            'sort': 'fas fa-sort',
            'menu': 'fas fa-bars',
            'hamburger': 'fas fa-bars',
            'bell': 'fas fa-bell',
            'notification': 'fas fa-bell',
            'mail': 'fas fa-envelope',
            'email': 'fas fa-envelope',
            'phone': 'fas fa-phone',
            'mobile': 'fas fa-mobile-alt',
            'computer': 'fas fa-desktop',
            'laptop': 'fas fa-laptop',
            'tablet': 'fas fa-tablet-alt',
            'gaming': 'fas fa-gamepad',
            'game': 'fas fa-gamepad',
            'music': 'fas fa-music',
            'video': 'fas fa-video',
            'image': 'fas fa-image',
            'file': 'fas fa-file',
            'folder': 'fas fa-folder',
            'calendar': 'fas fa-calendar',
            'clock': 'fas fa-clock',
            'time': 'fas fa-clock',
            'globe': 'fas fa-globe',
            'world': 'fas fa-globe',
            'map': 'fas fa-map',
            'location': 'fas fa-map-marker-alt',
            'pin': 'fas fa-map-marker-alt',
            'tag': 'fas fa-tag',
            'tags': 'fas fa-tags',
            'bookmark': 'fas fa-bookmark',
            'flag': 'fas fa-flag',
            'trophy': 'fas fa-trophy',
            'award': 'fas fa-award',
            'medal': 'fas fa-medal',
            'gift': 'fas fa-gift',
            'surprise': 'fas fa-surprise',
            'magic': 'fas fa-magic',
            'wand': 'fas fa-magic',
            'sparkles': 'fas fa-sparkles',
            'fire': 'fas fa-fire',
            'lightning': 'fas fa-bolt',
            'bolt': 'fas fa-bolt',
            'zap': 'fas fa-bolt'
        };
        
        // Check if it's in our mapping
        if (iconMappings[iconName.toLowerCase()]) {
            return iconMappings[iconName.toLowerCase()];
        }
        
        // Default to solid Font Awesome icon
        return `fas fa-${iconName}`;
    }

    /**
     * Convert size option to CSS value
     * @param {string|number} size - Size option
     * @returns {string} CSS size value
     */
    getSizeValue(size) {
        const sizeMap = {
            'xs': '0.75rem',
            'sm': '0.875rem',
            'md': '1rem',
            'lg': '1.25rem',
            'xl': '1.5rem',
            '2xl': '2rem',
            '3xl': '3rem',
            '4xl': '4rem',
            'small': '0.875rem',
            'medium': '1rem',
            'large': '1.5rem'
        };
        
        if (sizeMap[size]) {
            return sizeMap[size];
        }
        
        // If it's a number, assume it's rem
        if (typeof size === 'number') {
            return `${size}rem`;
        }
        
        // If it already has units, return as is
        if (typeof size === 'string' && (size.includes('px') || size.includes('rem') || size.includes('em') || size.includes('%'))) {
            return size;
        }
        
        return size;
    }

    /**
     * Update the icon's properties
     * @param {Object} newOptions - New options to apply
     */
    update(newOptions = {}) {
        Object.assign(this.options, newOptions);
        
        if (this.element) {
            // Update classes if icon name changed
            if (newOptions.iconName) {
                this.iconName = newOptions.iconName;
                const iconClasses = this.parseIconName(this.iconName);
                this.element.className = `${iconClasses} ${this.options.className}`.trim();
            }
            
            // Update size
            if (newOptions.size !== undefined) {
                this.element.style.fontSize = this.getSizeValue(this.options.size);
            }
            
            // Update color
            if (newOptions.color !== undefined) {
                this.element.style.color = this.options.color;
            }
            
            // Update custom styles
            if (newOptions.style) {
                Object.assign(this.element.style, newOptions.style);
            }
            
            // Update accessibility attributes
            if (newOptions.title !== undefined) {
                this.element.title = this.options.title;
            }
            
            if (newOptions.ariaLabel !== undefined) {
                this.element.setAttribute('aria-label', this.options.ariaLabel);
            }
        }
    }

    /**
     * Add the icon to a parent element
     * @param {HTMLElement|string} parent - Parent element or selector
     */
    appendTo(parent) {
        const parentElement = typeof parent === 'string' ? document.querySelector(parent) : parent;
        if (parentElement) {
            parentElement.appendChild(this.createElement());
        }
        return this;
    }

    /**
     * Remove the icon from the DOM
     */
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        return this;
    }

    /**
     * Get the HTML string representation
     * @returns {string} HTML string
     */
    toHTML() {
        const tempElement = this.createElement().cloneNode(true);
        return tempElement.outerHTML;
    }

    /**
     * Static method to create a quick icon
     * @param {string} iconName - Icon name
     * @param {Object} options - Icon options
     * @returns {Icon} New Icon instance
     */
    static create(iconName, options = {}) {
        return new Icon(iconName, options);
    }

    /**
     * Static method to create and immediately render an icon
     * @param {string} iconName - Icon name
     * @param {Object} options - Icon options
     * @returns {HTMLElement} The created icon element
     */
    static render(iconName, options = {}) {
        return new Icon(iconName, options).createElement();
    }

    /**
     * Static method to get just the HTML string
     * @param {string} iconName - Icon name
     * @param {Object} options - Icon options
     * @returns {string} HTML string
     */
    static html(iconName, options = {}) {
        return new Icon(iconName, options).toHTML();
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Icon;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.Icon = Icon;
}
