# Beeezo Blog Design

## Goal

Build a portable, production-quality blog page that Beeezo's senior developer can mount at `/blog`. Visitors browse real Beeezo newsletter editions and read complete, branded copies on Beeezo, with optional verified paths back to each LinkedIn edition and newsletter.

## Scope

- Blog index with one featured story, newsletter filters, and a responsive archive grid.
- Local article routes at `/blog/:slug`.
- All twenty editions across Beeezo's two LinkedIn newsletter archives, including their original cover and inline images and full public article copy.
- Beeezo-compatible global navigation and footer.
- Integration documentation for mounting the package into the main website.
- No publishing agent, CMS, Telegram workflow, server deployment, or modification of Beeezo's existing website repository in this deliverable.

## Brand Fidelity

All brand inputs come from Beeezo's current production website and newsletter assets.

- Typography: Onest, self-hosted at weights 400, 600, 700, 800, and 900.
- Ink: `#101116`.
- White: `#FFFFFF`.
- Orange: `#FFA500`.
- Soft neutral: `#F3F3F3`.
- Border neutral: `#DFE0E6`.
- Utility gray: `#6A6B71`.
- Logo: the exact white-and-orange wordmark extracted from Beeezo's production header CSS, plus the official site icon.
- Photography, cover art, and inline artwork: original images attached to the Beeezo LinkedIn newsletter editions, stored locally so LinkedIn is not a runtime dependency.
- Blog hero: an image-free editorial frontispiece that uses Beeezo's existing type and color tokens without repeating the landing page's illustrated journey composition.

No replacement logo, substitute typeface, invented gradient, or additional brand color is allowed.

## Experience

### Blog index

The header mirrors the public website's navigation, marks Blog in orange, and keeps the production-style plain `SIGN IN` action. The opening is a content-height editorial frontispiece on white: an unruled `Beeezo / Journal` label, a compact publication count, the controlled statement "Ideas for the action economy," and the supporting copy "Practical ideas about marketing, customer attention, and building products people choose to use." It contains no hero illustration, decorative gradient, or orange path, and it yields quickly to the latest article. On phones the same content becomes a direct single-column introduction rather than reserving a viewport for artwork.

A three-button control filters the index between All Articles, Smarter Marketing Solutions, and The Web3 Pulse. All Articles is selected by default. Each selection updates the publication count, promotes that collection's newest article under the visible "Latest Article" label, and limits the remaining archive cards to the same collection. The selected button exposes `aria-pressed="true"`.

The newest matching article is a wide featured story. Remaining editions use image-led cards with title, date, topic, reading time, and arrow affordance. Every card is a semantic link with visible keyboard focus. Article images remain the visual emphasis.

### Article reader

Each reader includes a back link, category/date/read time, title, opening copy, original cover, and complete article body. A sticky utility rail shows reading progress and offers a copy-link control. After the article body, a compact endcap links to the matching verified LinkedIn newsletter archive for subscription and to the original edition. The footer then recommends the next local article and returns readers to the archive.

The reader updates the document title and description from article metadata. Unknown slugs show a branded not-found state with a route back to the archive.

## Signature Element

Orange is reserved for useful signals: the slash and publication count in the journal opening, the card-edge response on hover/focus, and the reader's real scroll-progress indicator. This restraint keeps Beeezo recognizable without repeating the landing page's decorative path.

## Content Model

Each article has a stable slug, title, dek, ISO publication date, topic, typed newsletter ID, cover path, cover alt text, source URL, and ordered body blocks. A central allowlist maps the two newsletter IDs to their verified archive names and URLs. Body blocks support headings, paragraphs, quotations, lists, and locally stored images, plus safe inline text, emphasis, and optional HTTP(S) links. The UI never fetches content or images from LinkedIn at runtime.

## Technical Design

- React and TypeScript, built with Vite.
- React Router with a configurable basename; the repository default is `/blog/`.
- Article content stored as typed local data.
- Vitest and Testing Library for route and interaction behavior.
- Plain CSS with brand tokens; no component framework and no runtime font service.
- Static output suitable for inclusion in an existing deployment or independent preview hosting.

## Responsive and Accessible Behavior

- Layouts at 375 px, 768 px, and 1280 px without horizontal overflow.
- Semantic headings, landmarks, navigation labels, descriptive image alternatives, and skip link.
- Visible `:focus-visible` treatments using Beeezo orange.
- Minimum 44 px interactive targets where controls stand alone.
- Reading progress is supplemental and hidden from assistive technology.
- Motion is removed when `prefers-reduced-motion: reduce` is active.
- Body measure stays near 70 characters for long-form reading.

## Handoff Contract

The senior developer receives:

- Source and production build scripts.
- `VITE_BASE_PATH` instructions for mounting at `/blog/` or another path.
- A content file that can later be replaced by an agent or CMS adapter without rewriting the views.
- A source manifest that identifies each imported LinkedIn edition and asset.
- Guidance that server history fallback must send `/blog/*` to the blog entry point when deployed as a standalone SPA.

## Acceptance Criteria

1. The archive shows all twenty genuine Beeezo newsletter editions by default and filters to fifteen Smarter Marketing Solutions or five Web3 Pulse editions while promoting the newest matching story.
2. Every article card opens the matching local reader route.
3. Every reader keeps the full local reading experience and ends with verified links to its original LinkedIn edition and matching newsletter archive.
4. Direct navigation to an article works with the configured basename.
5. Brand tokens, typeface, wordmark, and image assets match Beeezo's public production assets.
6. Keyboard navigation, reduced-motion behavior, responsive layouts, and not-found handling are present.
7. Tests, type-checking, linting, and production build pass before handoff.
