# Content and Brand Sources

This repository mirrors public material produced by Beeezo. The local copies let readers stay on Beeezo's website and prevent the page from depending on LinkedIn at runtime.

## Brand sources

- Production website: <https://www.beeezo.com/>
- Wordmark: extracted without modification from the `site-header__logo-mark` asset embedded in Beeezo's production stylesheet on September 4, 2026.
- Site icon: <https://www.beeezo.com/icon.png>
- Onest font files: the same Google Fonts WOFF2 files referenced by Beeezo's production stylesheet.
- Color values: copied from Beeezo's production stylesheets. See the design specification for the constrained palette.

## Newsletter editions

| Local slug | Original public edition |
| --- | --- |
| `action-based-marketing-starts-with-your-product` | <https://www.linkedin.com/pulse/action-based-marketing-starts-your-product-beeezo-gdzze> |
| `missing-step-between-attention-and-experience` | <https://www.linkedin.com/pulse/missing-step-between-attention-experience-beeezo-wjxhe> |
| `ai-is-breaking-the-economics-of-digital-advertising` | <https://www.linkedin.com/pulse/ai-breaking-economics-digital-advertising-beeezo-tgu4e> |
| `luxury-brands-quest-based-marketing` | <https://www.linkedin.com/pulse/luxury-brands-quietly-moving-toward-quest-based-marketing-beeezo-bbdje> |
| `end-of-click-based-marketing` | <https://www.linkedin.com/pulse/end-click-based-marketing-beeezo-dolme> |
| `social-impact-circle-usdc` | <https://www.linkedin.com/pulse/social-impact-why-beeezo-chose-circleusdc-beeezo-ezmse> |
| `when-ai-becomes-the-gatekeeper` | <https://www.linkedin.com/pulse/when-ai-becomes-gatekeeper-beeezo-kehje> |
| `marketing-has-an-input-problem` | <https://www.linkedin.com/pulse/marketing-has-input-problem-beeezo-uigve> |
| `marketing-beyond-bots` | <https://www.linkedin.com/pulse/marketing-beyond-bots-beeezo-zueye> |

Article copy, publication dates, source links, and cover artwork were captured from the public editions on September 4, 2026. The short archive descriptions are faithful excerpts or close editorial condensations of each edition's opening argument.

## Updating content

`src/content/articles.json` is the current content boundary. New entries must conform to `src/content/types.ts`, use a unique stable slug, store cover art under `public/images/articles/`, and include an original source URL for provenance. Body links accept only explicit `http://` or `https://` values.

Before publishing imported copy, confirm Beeezo still owns or has permission to republish both the text and artwork.
