# Time Rush — Static Watch Store (Demo)

## Local preview
1. Place product images into `public/images/` matching filenames in `src/data/products.json`.
2. Serve the `src` folder. From project root:
   cd src
   python -m http.server 8000
3. Open http://localhost:8000 in your browser.

## Deploy
- GitHub Pages: push repo and set Pages source to `/src` or move `src` contents to repo root and set root as source.
- Netlify/Vercel: connect the repo and set publish directory to `src`.

## Notes
- This is a demo with client-side cart only. To accept payments, add a backend and Stripe integration.
