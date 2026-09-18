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

## Layout

The grid is built in `gallery.js`, not by CSS columns. It creates N real column
elements (3 above 1024px, 2 above 620px, 1 below) and appends each painting to
whichever column is currently shortest. The columns are flex siblings anchored
to `flex-start`, so every column's first painting always sits on the same top
edge.

Each entry carries its thumbnail's pixel dimensions, which become `width` and
`height` attributes on the `<img>`. That lets the browser reserve the correct
space before a lazy image loads, so the grid balances on first paint instead of
reflowing as images arrive.

## Adding or reordering paintings

Edit the `PAINTINGS` array in `gallery.js`. It is the display order, and each
entry is `["filename", thumbWidth, thumbHeight]`.

For a new painting: drop the full-size file in `images/`, put a ~1000px-wide
JPEG of the same name in `images/thumbs/`, then add the entry. To read the
thumbnail's dimensions:

```
sips -g pixelWidth -g pixelHeight images/thumbs/YOUR_FILE.jpg
```

The dimensions are only used as a ratio, so they do not have to be exact, but a
wrong ratio will show up as a jump when that image loads.

## Git

```
git init
git add .
git commit -m "me ara gallery"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
