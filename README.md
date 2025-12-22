# Kevin Feuerschvenger - Portfolio

Terminal-style portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- **Terminal-style UI** - Interactive console experience with vim-inspired components
- **Responsive Design** - Optimized for desktop and mobile devices
- **Smooth Animations** - Parallax scrolling and typewriter effects
- **Modern Tech Stack** - React 19, TypeScript, Tailwind CSS v4
- **Docker Ready** - Production-ready container with Nginx
- **Performance Optimized** - Gzip compression, caching headers, and minimal bundle size

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

### Deployment
- **Docker** - Containerization
- **Nginx** - Web server with optimization
- **Multi-stage builds** - Optimized production images

## Installation & Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (for containerized deployment)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Docker Deployment

### Quick Start

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t portfolio .
docker run -p 80:80 portfolio
```

### Docker Compose

```yaml
services:
  portfolio:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

## Project Structure

```
portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── TerminalWindow.tsx
│   │   └── ...
│   ├── lib/               # Utilities
│   ├── pages/             # Route pages
│   └── assets/            # Static assets
├── Dockerfile             # Multi-stage Docker build
├── nginx.conf             # Nginx configuration
└── docker-compose.yml     # Docker Compose setup
```

## Customization

### Adding New Projects

Edit `src/components/ProjectsSection.tsx`:

```typescript
const projects = [
  {
    name: 'your-project',
    description: 'Project description',
    language: 'TypeScript',
    languageColor: 'bg-accent',
    url: 'https://github.com/username/project',
  },
  // ... more projects
];
```

### Updating Skills

Edit `src/components/SkillsSection.tsx`:

```typescript
const skillCategories = [
  {
    category: 'frontend',
    skills: ['React', 'TypeScript', 'Your Skill'],
  },
  // ... more categories
];
```

### About Section Content

Update `src/components/AboutSection.tsx` with your personal information and bio.

## Performance Optimizations

### Nginx Configuration
- **Gzip Compression** - Reduced bundle sizes
- **Static Asset Caching** - 1-year cache for assets
- **Security Headers** - XSS protection, content type security
- **SPA Fallback** - Proper routing for single-page applications

### Build Optimizations
- **Tree Shaking** - Remove unused code
- **Code Splitting** - Lazy load components
- **Asset Optimization** - Minified CSS and JS
- **Image Optimization** - WebP format support

## Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
VITE_APP_TITLE="Kevin Feuerschvenger - Portfolio"
VITE_APP_DESCRIPTION="Full Stack Developer Portfolio"
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Email:** kfeuerschvenger@gmail.com
- **LinkedIn:** [linkedin.com/in/kevin-feuerschvenger](https://linkedin.com/in/kevin-feuerschvenger/)
- **GitHub:** [github.com/kfeuerschvenger](https://github.com/kfeuerschvenger)

---

Built with ❤️ and lots of ☕