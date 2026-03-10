# Executive Summary Scroll Site

A lightweight, visually striking one-page website that presents an executive summary as a scroll-driven animated text experience. Inspired by high-end interactive case-study sites with strong typographic pacing and smooth scroll-linked transitions.

## Features

- **Scroll-driven animations**: Text blocks animate in and out based on scroll position
- **Fullscreen sections**: Strong typographic hierarchy with generous whitespace
- **Progress indicator**: Floating progress bar showing scroll completion
- **Section navigation**: Dot navigation for jumping between sections
- **Share functionality**: Copy share link button
- **Markdown toggle**: View the raw markdown content in a modal
- **Responsive design**: Optimized for desktop and mobile
- **Accessibility**: Respects reduced-motion preferences
- **Minimal dependencies**: Built with Vite and Marked.js

## Quick Start

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Edit content**: Replace `public/summary.md` with your own markdown summary
4. **Run locally**:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 to preview

## Content Structure

The site parses your markdown file by splitting on `---` separators. Each section becomes a scrollable fullscreen area. Support for:

- Headings (H1, H2, H3)
- Paragraphs
- Bulleted and numbered lists
- Bold/italic text
- Any standard markdown elements

## GitHub Pages Deployment

### Option 1: Manual Deploy

1. **Build the site**:
   ```bash
   npm run build
   ```
2. **Upload `dist` contents** to your GitHub repository
3. **Enable Pages**: Go to Settings → Pages → Select "Deploy from a branch" → Choose `main` branch and `/` folder

### Option 2: Automated Deploy (Recommended)

1. **Create `.github/workflows/deploy.yml`** with this content:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v4
       - name: Setup Node
         uses: actions/setup-node@v4
         with:
           node-version: '18'
       - run: npm ci
       - run: npm run build
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```
2. **Enable Pages**: Settings → Pages → Select "GitHub Actions" as source

Your site will be available at `https://yourusername.github.io/repository-name/`

## Customization

- **Styling**: Edit `src/style.css` for colors, fonts, animations
- **Behavior**: Modify `src/main.js` for animation timing, scroll triggers
- **Content**: Update `public/summary.md` to change the presentation content
- **Fonts**: The site uses Inter font; add Google Fonts link to `index.html` if needed

## Technical Details

- **Framework**: Vite for fast development and optimized builds
- **Markdown Parser**: Marked.js for converting markdown to HTML
- **Animations**: CSS transitions triggered by Intersection Observer
- **Responsive**: Mobile-first design with breakpoints
- **Performance**: Lightweight with no heavy assets or WebGL

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Graceful degradation for older browsers

## License

MIT License - feel free to use and modify for your projects.