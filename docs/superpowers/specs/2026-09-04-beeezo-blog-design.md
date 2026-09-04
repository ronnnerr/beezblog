# Beeezo Blog Design

## Goal

Build a portable, production-quality blog page that Beeezo's senior developer can mount at `/blog`. Visitors browse real Beeezo newsletter editions and open complete, branded readers without leaving Beeezo for LinkedIn.

## Scope

- Blog index with one featured story and a responsive archive grid.
- Local article routes at `/blog/:slug`.
- Nine existing editions from Beeezo's LinkedIn newsletter, including their original cover images and full public article copy.
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
- Photography and cover art: original images attached to the Beeezo LinkedIn newsletter editions, stored locally so LinkedIn is not a runtime dependency.

No replacement logo, substitute typeface, invented gradient, or additional brand color is allowed.

## Experience

### Blog index

The header mirrors the public website's navigation and marks Blog as the current destination. The opening uses a dark editorial field room rather than a generic Web3 dashboard: a compact `Beeezo / Journal` label, the statement "Ideas for the action economy," and a concise explanation of the publication.

The newest article is a wide featured story. Remaining editions use image-led cards with title, date, topic, reading time, and arrow affordance. Every card is a semantic link with visible keyboard focus. Article images remain the visual emphasis.

### Article reader

Each reader includes a back link, category/date/read time, title, opening copy, original cover, and complete article body. A sticky utility rail shows reading progress and offers a copy-link control. The footer recommends the next article and returns readers to the archive.

The reader updates the document title and description from article metadata. Unknown slugs show a branded not-found state with a route back to the archive.

## Signature Element

An orange signal line is the sole expressive UI device. On the index it travels along a card edge on hover/focus. In the reader it becomes a real scroll-progress indicator. This connects Beeezo's verified-action language to useful navigation without introducing decorative Web3 clichés.

## Content Model

Each article has a stable slug, title, dek, ISO publication date, topic, cover path, cover alt text, source URL, and ordered body blocks. Body blocks are headings or paragraphs containing safe inline text, emphasis, and optional HTTP(S) links. The UI never fetches content or images from LinkedIn at runtime.

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

1. The archive shows nine genuine Beeezo editions with their original cover images.
2. Every article card opens the matching local reader route.
3. No reader links to LinkedIn as its reading destination; LinkedIn appears only as provenance in the content manifest.
4. Direct navigation to an article works with the configured basename.
5. Brand tokens, typeface, wordmark, and image assets match Beeezo's public production assets.
6. Keyboard navigation, reduced-motion behavior, responsive layouts, and not-found handling are present.
7. Tests, type-checking, linting, and production build pass before handoff.
