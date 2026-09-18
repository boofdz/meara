# me ara — painting gallery

Standalone static site. Masonry gallery of 34 paintings; clicking one opens it in a 90%-width lightbox with prev/next, keyboard nav (←/→/Esc) and click-outside to close. No build step, no CDN dependency for imagery — every painting is in this repo.

## Files

- `index.html` — markup
- `styles.css` — all styling
- `gallery.js` — display order + gallery build + lightbox logic
- `images/` — full-size paintings (up to 2500px wide), shown in the lightbox
- `images/thumbs/` — ~1000px JPEG versions, shown in the grid

The only external request is the Jost webfont from Google Fonts (`index.html`). Remove that `<link>` to be fully offline — the CSS already falls back to Helvetica.

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000

## Deploy

Point any static host at the repo root:

- **GitHub Pages** — Settings → Pages → deploy from branch, root (`.nojekyll` is included)
- **Netlify / Vercel / Cloudflare Pages** — no build command, publish directory `/`

## Adding or reordering paintings

Edit the `PAINTINGS` array in `gallery.js` — it is the display order. For a new painting: drop the full-size file in `images/`, a ~1000px-wide JPEG of the same name in `images/thumbs/`, and add the full-size filename to the array.

## Git

```
git init
git add .
git commit -m "me ara gallery"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
