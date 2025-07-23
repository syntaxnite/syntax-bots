# Project Structure

```
syntaxbotsweb/
├── src/                        # Backend source code
│   └── server.js              # Main Express server
├── public/                     # Frontend files (served statically)
│   ├── index.html             # Main website homepage
│   ├── admin.html             # Admin panel
│   ├── css/                   # Stylesheets
│   │   ├── styles.css         # Main website styles
│   │   └── admin.css          # Admin panel styles
│   ├── js/                    # JavaScript files
│   │   ├── script.js          # Main website JavaScript
│   │   ├── admin.js           # Admin panel JavaScript
│   │   └── icon.js            # Icon utility class
│   └── pages/                 # Legal and static pages
│       ├── privacy.html       # Privacy Policy
│       ├── terms.html         # Terms of Service
│       └── contact.html       # Contact page
├── docs/                      # Documentation
│   ├── README.md              # Main documentation
│   ├── API.md                 # API documentation
│   ├── ICON-DOCS.md           # Icon class documentation
│   └── SETUP.md               # Setup instructions
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js dependencies
├── package-lock.json          # Locked dependencies
├── bots.db                    # SQLite database (auto-generated)
└── start-server.bat           # Windows start script
```

## Key Changes Made:

1. **Organized Frontend Files**: Moved all public-facing files to `public/` directory
2. **Separated Backend**: Moved server code to `src/` directory  
3. **Categorized Assets**: CSS files in `css/`, JavaScript in `js/`, pages in `pages/`
4. **Documentation**: Moved all docs to `docs/` directory
5. **Updated Paths**: Fixed all file references in HTML files
6. **Server Configuration**: Updated Express to serve from `public/` directory

## Benefits:

- **Cleaner Structure**: Logical separation of concerns
- **Better Deployment**: Clear separation of what's served vs backend code
- **Easier Maintenance**: Files are organized by type and purpose
- **Professional Layout**: Follows industry standards for full-stack projects
