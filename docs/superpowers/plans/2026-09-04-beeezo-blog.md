# Beeezo Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portable Beeezo-branded blog index and complete on-site article readers from all twenty real editions across Beeezo's two LinkedIn newsletters.

**Architecture:** A Vite React SPA owns the `/blog/` basename and renders an index or article reader from typed local content. Original cover art, the production wordmark, and Onest fonts ship locally, eliminating LinkedIn and font-CDN runtime dependencies.

**Tech Stack:** React, TypeScript, React Router, Vite, Vitest, Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-09-04-beeezo-blog-design.md`

## Global Constraints

- Use only Beeezo's verified `#101116`, `#FFFFFF`, `#FFA500`, `#F3F3F3`, `#DFE0E6`, and `#6A6B71` palette.
- Use only self-hosted Onest for interface and editorial typography.
- Use the exact production wordmark and original newsletter covers already captured in `public/`.
- The default deployment basename is `/blog/` and must be configurable through `VITE_BASE_PATH`.
- LinkedIn must not be a runtime dependency.
- Support keyboard navigation, reduced motion, and 375 px through desktop layouts.

---

### Task 1: Project foundation and verified content model

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`
- Create: `src/content/types.ts`, `src/content/articles.json`, `src/content/articles.ts`
- Create: `src/content/articles.test.ts`, `src/test/setup.ts`
- Create: `docs/content-sources.md`

**Interfaces:**
- Produces: `Article`, `ArticleBlock`, `articles`, `getArticleBySlug(slug)`, and `getNextArticle(slug)`.

- [x] **Step 1: Add the test runner configuration and write failing content-contract tests**

```ts
expect(articles).toHaveLength(20)
expect(new Set(articles.map((article) => article.slug)).size).toBe(20)
expect(getArticleBySlug('marketing-beyond-bots')?.title).toBe('Marketing Beyond Bots')
expect(getArticleBySlug('missing')).toBeUndefined()
```

- [x] **Step 2: Run `npm test -- src/content/articles.test.ts` and confirm failure because the content module does not exist**
- [x] **Step 3: Add the typed content model, mechanically import the public LinkedIn article blocks, and document source URLs**
- [x] **Step 4: Run the content test and confirm all content-contract assertions pass**
- [x] **Step 5: Commit the independently testable content foundation**

### Task 2: Blog archive and routing

**Files:**
- Create: `src/main.tsx`, `src/App.tsx`, `src/components/BrandLogo.tsx`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`
- Create: `src/pages/BlogIndex.tsx`, `src/pages/NotFound.tsx`
- Create: `src/App.test.tsx`

**Interfaces:**
- Consumes: `articles` and the content types from Task 1.
- Produces: `AppRoutes`, archive card links, and fallback route behavior.

- [x] **Step 1: Write failing route tests for the archive, all twenty local links, active Blog navigation, and an unknown route**

```tsx
render(<MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter>)
expect(screen.getByRole('heading', { name: /ideas for the action economy/i })).toBeVisible()
expect(screen.getAllByRole('link', { name: /read:/i })).toHaveLength(20)
```

- [x] **Step 2: Run `npm test -- src/App.test.tsx` and confirm failure because the application routes do not exist**
- [x] **Step 3: Implement the shared shell, archive layout, semantic card links, and branded not-found view**
- [x] **Step 4: Run the route tests and confirm the archive and fallback behavior pass**
- [x] **Step 5: Commit the independently testable archive experience**

### Task 3: Complete article reader

**Files:**
- Create: `src/pages/ArticleReader.tsx`, `src/components/ArticleBody.tsx`, `src/components/ReadingProgress.tsx`, `src/components/CopyLinkButton.tsx`, `src/components/ArticleLinkedInCta.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `getArticleBySlug`, `getNextArticle`, and safe `ArticleBlock` values.
- Produces: local readers, body rendering, next-story navigation, reading progress, copy-link feedback, and verified LinkedIn edition/newsletter actions.

- [x] **Step 1: Write failing tests for a valid article, full body, next article link, unknown slug, copy-link state, and verified LinkedIn actions**

```tsx
render(<MemoryRouter initialEntries={['/marketing-beyond-bots']}><AppRoutes /></MemoryRouter>)
expect(screen.getByRole('heading', { name: 'Marketing Beyond Bots', level: 1 })).toBeVisible()
expect(screen.getByText('The Signal Breakdown')).toBeVisible()
expect(screen.getByRole('link', { name: /read next/i })).toHaveAttribute('href')
```

- [x] **Step 2: Run the focused test and confirm it fails because the reader components do not exist**
- [x] **Step 3: Implement the reader, safe block renderer, progress behavior, metadata updates, copy-link control, and LinkedIn endcap**
- [x] **Step 4: Run all tests and confirm reader behavior passes without console warnings**
- [x] **Step 5: Commit the independently testable reader experience**

### Task 4: Brand styling, handoff documentation, and proof

**Files:**
- Create: `src/styles/global.css`, `README.md`
- Modify: all visual components as required for class names and accessibility hooks

**Interfaces:**
- Consumes: the application shell and verified assets.
- Produces: responsive, accessible visual implementation and integration instructions.

- [x] **Step 1: Implement the two-pass design system from the spec, including the image-free editorial frontispiece, card interactions, and responsive reader**
- [x] **Step 2: Document local development, build, `/blog/` mounting, history fallback, asset ownership, and article updates**
- [x] **Step 3: Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` and require zero failures**
- [x] **Step 4: Run desktop and mobile browser checks for archive and reader routes, inspect console output, and save screenshots**
- [x] **Step 5: Request code review, resolve all critical and important findings, repeat the full verification suite, and commit**
