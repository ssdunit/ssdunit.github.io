# Sunit Dighe - portfolio

Vite + vanilla JS. Workflow: Deploys to GitHub Pages on every push to `main`.

## Edit content
Everything (text, projects, contact, links, tags) is in **`src/content.js`**.

## Layout
- `index.html` — page shell + nav
- `src/styles/` — base (themes) · nav · hero · sections · cat · responsive
- `src/js/` — theme · nav (scroll-spy) · name (EN/Hindi flip) · cat · reveal · waves · render
- `src/assets/` — hero photo, cat sprites (swap `hero.jpg`, keep 4:5)

## Run
```
npm install
npm run dev      # local preview
npm run build    # outputs dist/
```

## Deploy
Repo Settings → Pages → Source: **GitHub Actions**. Push to `main`; `.github/workflows/deploy.yml` workflow deploys to github pages
