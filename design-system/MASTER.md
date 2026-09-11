# Beeezo Journal design system

## Screen job

Help a Beeezo visitor choose a newsletter edition and read the full article without leaving the site.

## Visual scene

A Beeezo publication desk with a black masthead, white reading surface, orange editorial markers, and the original newsletter covers doing the visual work.

## Tokens

- Ink: `#101116`
- Paper: `#FFFFFF`
- Beeezo orange: `#FFA500`
- Soft surface: `#F3F3F3`
- Rule: `#DFE0E6`
- Utility text: `#6A6B71`

## Type

- Display, body, and utility: Onest, using the local WOFF2 files copied from Beeezo's production site.
- Headlines: 700 to 800 weight, compact line height, balanced wrapping.
- Body: 400 weight with a relaxed reading line height.
- Metadata: 700 weight, uppercase, restrained tracking.

## Space

Use an 8px base scale: 8, 16, 24, 32, 48, 64, and 96px. The archive opening should stay compact enough that the latest article begins near the first viewport.

## Shape and motion

- Radius: square. Beeezo's current visual language uses hard editorial edges.
- Motion: 180 to 520ms for focus, image scale, and orange underline feedback.
- Reduced motion: remove nonessential transitions when the visitor requests it.

## Signature

The orange signal line appears only as an active navigation marker, focus color, reading progress, or article-card reveal. Original newsletter artwork supplies the visual variety.

## Avoid

- No gradients, glass panels, neon crypto styling, generic Web3 symbols, or decorative hero illustration.
- No invented logo, colors, typefaces, article images, claims, or engagement numbers.
- No nested card chrome or oversized metric dashboard.

## Accessibility floor

- Maintain at least 4.5:1 text contrast.
- Keep focus visible with the orange outline.
- Keep interactive targets at least 44px tall.
- Wrap filter controls and article metadata at narrow widths.
- Preserve semantic headings, labels, alt text, and reduced-motion behavior.
- Verify at 375px, 768px, and 1024px before shipping.
