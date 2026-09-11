# Beeezo Journal

A portable Beeezo blog index and long-form reader built from **Smarter Marketing Solutions** and Sergey Kiklevich's **Weekly Blockchain Digest**. Article copy, cover and inline artwork, fonts, and the official wordmark are stored locally, so the page does not depend on LinkedIn at runtime.

## What ships

- All 79 verified newsletter editions: 15 from Smarter Marketing Solutions and 64 from Weekly Blockchain Digest.
- Original LinkedIn cover art for every edition, plus the inline artwork included in the source articles.
- A responsive archive with a featured latest story and filters for both newsletter series.
- An image-free editorial frontispiece that distinguishes the journal from Beeezo's illustrated homepage.
- Local article readers at `/blog/:slug/`.
- A verified LinkedIn endcap on every reader with the matching edition and newsletter archive.
- The same Onest type family, wordmark, orange, black, white, and neutral palette used on Beeezo's production website.
- Per-article canonical and social metadata, browser titles and descriptions, reading progress, copy-link feedback, next-story navigation, keyboard focus styles, and reduced-motion support.
- A typed content boundary ready for a later CMS or publishing-agent adapter.
- A strict LinkedIn import script that rejects the wrong author, wrong newsletter, missing editions, duplicate URLs, and unsupported content blocks.

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
2. Serve each generated `/blog/:slug/index.html` for `/blog/:slug/` before applying the SPA fallback. These files carry the article's canonical, Open Graph, and Twitter metadata.
3. Return `/blog/index.html` for any other unknown `/blog/*` request.
4. Cache hashed files under `/blog/assets/` for a long duration, but serve HTML with revalidation.

The metadata build defaults to `https://www.beeezo.com`. Set `VITE_SITE_ORIGIN` when building for another canonical origin.

If the senior developer moves these components into Beeezo's existing React application instead, keep `src/content/`, `src/components/`, `src/pages/`, `src/styles/`, and the corresponding `public/` assets. Replace the standalone `BrowserRouter` with the parent application's router and mount `BlogIndex` and `ArticleReader` under its `/blog` routes.

## Refresh Weekly Blockchain Digest

The complete Sergey newsletter inventory is pinned in `scripts/sergey-newsletter-manifest.mjs`. To refresh its article copy and images from the verified LinkedIn editions, run:

```bash
npm run content:import-sergey
```

The importer keeps Smarter Marketing Solutions intact, downloads remote article media into `public/images/articles/`, and rewrites `src/content/articles.json` only after the full 64-edition manifest passes validation. Cached source pages stay outside Git in `.cache/`.

To bypass the local source and image cache when LinkedIn changes an existing edition, run:

```bash
npm run content:import-sergey -- --force
```

## Add or update an article manually

1. Store the approved 16:9 cover under `public/images/articles/`.
2. Add a unique entry to `src/content/articles.json` that conforms to `src/content/types.ts`.
3. Assign the article to one of the typed newsletter IDs and keep imported inline links restricted to explicit HTTP(S) destinations.
4. Add the original publication URL to `docs/content-sources.md` for provenance; newsletter archive URLs belong in the central `newsletterById` lookup.
5. Run the full verification commands above.

The current source material and brand provenance are documented in [docs/content-sources.md](docs/content-sources.md).

## Planned founder daily notes

The newsletter release does not ingest Sergey's daily LinkedIn posts. A separate, review-first Open Jarvis and Telegram workflow is specified in [docs/founder-daily-plan.md](docs/founder-daily-plan.md) for a later release, without mixing short-form posts into the verified 79-edition archive.

## Asset note

The official Beeezo trademarks and imported newsletter artwork in this repository are client assets, not generic open-source project assets. Confirm Beeezo's publication approval before redistributing the repository publicly.
