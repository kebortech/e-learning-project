# LearnHub - E-Learning Platform

Professional File & Folder Structure Documentation

## 📁 Project Structure

```
learnhub/
├── public/                 # Static assets (images, icons, favicon)
│   ├── images/            # Image files
│   └── icons/             # Icon assets
│
├── src/                   # Source code (organized by type)
│   ├── pages/            # HTML pages
│   │   ├── index.html                 # Homepage
│   │   ├── login.html                 # Login page
│   │   ├── register.html              # Registration page
│   │   ├── courses.html               # Courses listing page
│   │   ├── student-dashboard.html     # Student dashboard
│   │   ├── instructor-dashboard.html  # Instructor dashboard
│   │   ├── admin-dashboard.html       # Admin dashboard
│   │   └── checkout.html              # Checkout page
│   │
│   ├── styles/           # CSS stylesheets
│   │   ├── main.css      # Global/main styles
│   │   ├── auth.css      # Authentication styles
│   │   ├── courses.css   # Courses page styles
│   │   ├── dashboard.css # Dashboard styles
│   │   └── payment.css   # Payment styles
│   │
│   ├── scripts/          # JavaScript files
│   │   ├── main.js                   # Main/global scripts
│   │   ├── auth.js                   # Authentication logic
│   │   ├── courses.js                # Courses logic
│   │   ├── dashboard.js              # General dashboard logic
│   │   ├── student-dashboard.js      # Student dashboard logic
│   │   ├── instructor-dashboard.js   # Instructor dashboard logic
│   │   ├── admin-dashboard.js        # Admin dashboard logic
│   │   └── payment.js                # Payment handling
│   │
│   └── data/             # Data & utilities
│       └── data.js       # Mock data, constants, utilities
│
├── config/               # Configuration files (for future use)
│   └── [reserved for config files]
│
├── docs/                 # Documentation
│   ├── README.md        # Original project README
│   └── ARCHITECTURE.md  # [Optional] Architecture notes
│
├── .gitignore           # Git ignore rules
├── .vercel/             # Vercel configuration
│   └── project.json
│
└── [Other root files like package.json, index.html redirector, etc.]
```

## 📝 File Organization Rules

### Pages (src/pages/)
- All HTML pages go here
- Use semantic naming: `page-name.html`
- Each page should have a corresponding CSS and JS file

### Styles (src/styles/)
- Global styles in `main.css`
- Feature-specific or page-specific styles in separate files
- Follow naming convention: `feature-name.css`

### Scripts (src/scripts/)
- Modular JavaScript files organized by functionality
- File naming matches related HTML page or feature
- Each module should have a single responsibility

### Data (src/data/)
- Mock data and constants
- Utility functions used across multiple files
- API endpoints configuration

### Assets (public/)
- Images, SVGs, icons, and other media files
- Keep organized in subdirectories (images/, icons/)

## 🔗 File Path References

When linking between files, use relative paths:

**From pages to styles:**
```html
<link rel="stylesheet" href="../styles/main.css">
<link rel="stylesheet" href="../styles/auth.css">
```

**From pages to scripts:**
```html
<script src="../scripts/main.js"></script>
<script src="../scripts/auth.js"></script>
```

**From pages to data:**
```html
<script src="../data/data.js"></script>
```

**From pages to assets:**
```html
<img src="../public/images/logo.png" alt="Logo">
```

**Navigation between pages:**
```html
<a href="./login.html">Login</a>
<a href="./courses.html">Courses</a>
```

## 🎯 Best Practices

1. **Keep files modular** - Each file should have a single, clear purpose
2. **Use consistent naming** - Use kebab-case for filenames (e.g., `my-component.js`)
3. **Organize by feature** - Group related files together
4. **Avoid duplication** - Reuse code through data.js and utility functions
5. **Clear separation of concerns**:
   - HTML: Structure only
   - CSS: Styling and layout
   - JS: Logic and interactivity
   - Data: Constants and mock data

## 📦 Future Enhancements

- Add `components/` folder for reusable HTML components
- Add `utils/` folder for helper functions
- Add `tests/` folder for unit and integration tests
- Consider migrating to a modern framework (React, Vue, or Next.js) as the project grows

## 🚀 Getting Started

1. All HTML pages are located in `src/pages/`
2. Start with `src/pages/index.html` as the entry point
3. Each page automatically loads required CSS from `src/styles/`
4. Each page automatically loads required JS from `src/scripts/`
5. Shared data/utilities are in `src/data/data.js`

---

**Last Updated:** 2026-05-11
**Structure Version:** 1.0
