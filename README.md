# Beeezo Journal

A portable Beeezo blog index and long-form reader built from the company's public **Smarter Marketing Solutions** and **The Web3 Pulse** newsletter editions. All article copy, cover and inline artwork, fonts, and the official wordmark are stored locally so the page does not depend on LinkedIn at runtime.

## What ships

- All twenty editions across Beeezo's two verified LinkedIn newsletter archives.
- Thirty-seven original assets imported for the eleven newly recovered editions: eleven covers and twenty-six inline images.
- A responsive archive with a featured latest story.
- An image-free editorial frontispiece that distinguishes the journal from Beeezo's illustrated homepage.
- Local article readers at `/blog/:slug`.
- A verified LinkedIn endcap on every reader with the matching edition and newsletter archive.
- The same Onest type family, wordmark, orange, black, white, and neutral palette used on Beeezo's production website.
- Per-article browser titles and descriptions, reading progress, copy-link feedback, next-story navigation, keyboard focus styles, and reduced-motion support.
- A typed content boundary ready for a later CMS or publishing-agent adapter.

## Run locally

This project requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

The development URL uses the configured base path: <http://localhost:5173/blog/>.

## Verify and build

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The production bundle is written to `dist/`.

## Integrate at `beeezo.com/blog`

The default base path is `/blog/`, configured in `vite.config.ts`. To use another mount point, set `VITE_BASE_PATH` with both leading and trailing slashes before building:

```bash
VITE_BASE_PATH=/insights/ npm run build
```

When this stays a standalone SPA, configure the server to:

1. Serve the contents of `dist/` at `/blog/`.
2. Return `/blog/index.html` for unknown `/blog/*` requests so direct article URLs load correctly.
3. Cache hashed files under `/blog/assets/` for a long duration, but serve `index.html` with revalidation.

If the senior developer moves these components into Beeezo's existing React application instead, keep `src/content/`, `src/components/`, `src/pages/`, `src/styles/`, and the corresponding `public/` assets. Replace the standalone `BrowserRouter` with the parent application's router and mount `BlogIndex` and `ArticleReader` under its `/blog` routes.

## Add or update an article

1. Store the approved 16:9 cover under `public/images/articles/`.
2. Add a unique entry to `src/content/articles.json` that conforms to `src/content/types.ts`.
3. Assign the article to one of the typed newsletter IDs and keep imported inline links restricted to explicit HTTP(S) destinations.
4. Add the original publication URL to `docs/content-sources.md` for provenance; newsletter archive URLs belong in the central `newsletterById` lookup.
5. Run the full verification commands above.

The current source material and brand provenance are documented in [docs/content-sources.md](docs/content-sources.md). The approved experience and integration contract live in [the design specification](docs/superpowers/specs/2026-09-04-beeezo-blog-design.md).

## Asset note

The official Beeezo trademarks and imported newsletter artwork in this repository are client assets, not generic open-source project assets. Confirm Beeezo's publication approval before redistributing the repository publicly.
