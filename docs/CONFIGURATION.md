# LearnHub Configuration Guide

## Project Metadata
- **Project Name:** LearnHub - E-Learning Platform
- **Type:** Vanilla HTML/CSS/JavaScript Application
- **Theme:** Dark mode with modern glassmorphism design
- **Entry Point:** `index.html` (redirects to `src/pages/index.html`)

## Key Technologies
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Icons:** Font Awesome 6.5.0
- **Fonts:** Google Fonts (Inter, Playfair Display)
- **Effects:** Custom animations, scroll indicators, glass effects

## Color Palette
- **Primary:** Blue/Slate tones
- **Theme Color:** #0f172a (dark)
- **Mode:** Dark theme (data-theme="dark")

## Browser Support
- Modern browsers with ES6+ support
- Responsive design (mobile, tablet, desktop)
- Touch-friendly interface

## External Dependencies
- Font Awesome Icons (CDN)
- Google Fonts (CDN)

## Important Notes

### Path Resolution
All relative paths in HTML files are now correctly set to:
- `../styles/` for CSS files
- `../scripts/` for JavaScript files
- `../data/` for data files
- `./` for internal page navigation

### Navigation Links
Internal links use relative paths with `./`:
```html
<a href="./courses.html">Courses</a>
<a href="./login.html">Login</a>
```

### Cross-File Communication
JavaScript files can reference data from `../data/data.js`:
```html
<script src="../data/data.js"></script>
```

## Maintenance Guidelines

### Adding New Pages
1. Create HTML file in `src/pages/`
2. Link CSS in `src/styles/`
3. Link JS in `src/scripts/`
4. Update navigation links across all pages
5. Add page to this documentation

### Adding New Styles
1. Create new CSS file in `src/styles/`
2. Follow naming convention: `feature-name.css`
3. Link in relevant HTML pages
4. Document the purpose in file comments

### Adding New Scripts
1. Create new JS file in `src/scripts/`
2. Use consistent naming with related functionality
3. Keep modules independent where possible
4. Link in relevant HTML pages

## Deployment Checklist

- [ ] All internal links use relative paths
- [ ] All CSS/JS paths are correct
- [ ] External CDN links are accessible
- [ ] Images placed in `public/images/`
- [ ] No hardcoded absolute paths
- [ ] Environment variables configured (if needed)
- [ ] .gitignore configured properly
- [ ] Project structure documented

---

**Last Updated:** 2026-05-11
