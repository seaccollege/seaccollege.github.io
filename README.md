# 🎓 South Eastern Arabic College Website

Official website for South Eastern Arabic College (SEAC) - A distinguished institution dedicated to excellence in Arabic language, Qur'anic sciences, Hadith, and Islamic studies education.

## ✨ Features

- 🏛️ **Modern Design**: Clean, responsive UI built with Astro + Vue + Svelte
- 📱 **PWA Support**: Full Progressive Web App with offline capabilities
- 🎨 **Dark Mode**: Automatic theme switching
- ♿ **Accessible**: WCAG compliant, keyboard navigation, screen reader friendly
- ⚡ **Fast**: Static site generation with optimized loading
- 🔍 **SEO Optimized**: Meta tags, sitemap, structured data

**Features:**
- ✅ Course information
- ✅ Admissions guidance  
- ✅ Department details
- ✅ Examination policies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:4321**

### Build for Production

```bash
# Build static site
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
seaccollege.github.io/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── vue/            # Vue components
│   │   ├── angular/        # Angular components
│   │   └── widgets/        # Svelte widgets
│   ├── layouts/            # Page layouts
│   │   ├── Layout.astro
│   │   └── HomeLayout.astro
│   ├── pages/              # Routes (file-based routing)
│   │   ├── index.astro     # Homepage
│   │   ├── about.astro
│   │   ├── academics.astro
│   │   └── academics/      # Nested routes
│   ├── styles/             # Global styles
│   └── data/               # Static data (JSON)
├── public/                 # Static assets
│   ├── images/
│   ├── vendor/
│   └── manifest.json       # PWA manifest
└── astro.config.mjs        # Astro configuration
```

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) (Static Site Generator)
- **UI Libraries**: 
  - Vue 3 (Interactive components)
  - Svelte (Lightweight widgets)
  - Angular (Complex features)
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Font Awesome (self-hosted)
- **PWA**: Service Worker + Manifest
- **Deployment**: GitHub Pages

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus indicators

## 🌐 Deployment

### GitHub Pages (Automatic)

```bash
# Build and deploy
npm run build
git add dist/
git commit -m "Deploy"
git push origin main
```

Configure GitHub Pages to serve from `main` branch or `gh-pages`.

### Manual Deployment

```bash
# Build static files
npm run build

# Upload dist/ folder to your hosting
```

## 📚 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

## 🔧 Configuration Files

- `astro.config.mjs` - Astro configuration
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies
- `.env` - Environment variables (gitignored)
- `.env.example` - Environment template

### Build Errors

```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Clear cache
rm -rf .astro dist
npm run build
```

### Port Already in Use

```bash
# Change port in package.json
"dev": "astro dev --port 3000"
```

## 📖 Documentation

- **Astro Docs**: https://docs.astro.build
- **Vue Docs**: https://vuejs.org
- **Tailwind**: https://tailwindcss.com

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

See [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: https://seaccollege.github.io
- **GitHub**: https://github.com/seaccollege

---

**Built with ❤️ for SEAC College**