# Content and Brand Sources

This repository mirrors public material produced by Beeezo. The local copies let readers stay on Beeezo's website and prevent the page from depending on LinkedIn at runtime.

## Brand sources

- Production website: <https://www.beeezo.com/>
- Wordmark: extracted without modification from the `site-header__logo-mark` asset embedded in Beeezo's production stylesheet on September 4, 2026.
- Site icon: <https://www.beeezo.com/icon.png>
- Onest font files: the same Google Fonts WOFF2 files referenced by Beeezo's production stylesheet.
- Color values: copied from Beeezo's production stylesheets. See the design specification for the constrained palette.

## Newsletter editions

- Smarter Marketing Solutions archive: <https://www.linkedin.com/newsletters/smarter-marketing-solutions-7416963116816838656>
- The Web3 Pulse archive: <https://www.linkedin.com/newsletters/the-web3-pulse-7307407314402074624>

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
| `the-quiet-collapse-of-the-lead-funnel` | <https://www.linkedin.com/pulse/quiet-collapse-lead-funnel-beeezo-xvnxe> |
| `performance-marketing-hitting-a-structural-wall` | <https://www.linkedin.com/pulse/performance-marketing-hitting-structural-wall-beeezo-k25ze> |
| `marketing-in-low-trust-economies` | <https://www.linkedin.com/pulse/marketing-low-trust-economies-beeezo-k9gle> |
| `from-attention-to-intention` | <https://www.linkedin.com/pulse/from-attention-intention-beeezo-mdyae> |
| `trust-is-the-new-growth-engine` | <https://www.linkedin.com/pulse/trust-new-growth-engine-beeezo-hzj2e> |
| `the-world-of-modern-marketing-and-advertising` | <https://www.linkedin.com/pulse/world-modern-marketing-advertising-from-influence-participation-uzthe> |
| `the-money-game-navigating-web3s-evolving-funding-landscape` | <https://www.linkedin.com/pulse/money-game-navigating-web3s-evolving-funding-landscape-web3-pulse-bjhbf> |
| `gamefi-boom-where-gaming-meets-web3-rewards` | <https://www.linkedin.com/pulse/gamefi-boom-where-gaming-meets-web3-rewards-pulse-beeezo-su7of> |
| `decentralization-unchained-the-new-wave-of-web3-trends` | <https://www.linkedin.com/pulse/decentralization-unchained-new-wave-web3-trends-pulse-3-beeezo-wtkwf> |
| `rwa-revolution-how-tokenization-is-reshaping-ownership` | <https://www.linkedin.com/pulse/rwa-revolution-how-tokenization-reshaping-ownership-web3-pulse-y842f> |
| `hidden-giants-the-blockchain-ecosystems-you-may-have-missed` | <https://www.linkedin.com/pulse/hidden-giants-blockchain-ecosystems-you-may-have-missed-beeezo-dhh7f> |

Article copy, publication dates, source links, cover artwork, and available inline artwork were captured from the public editions on September 4, 2026. The short archive descriptions are faithful excerpts or close editorial condensations of each edition's opening argument. LinkedIn sign-in was not required for the two public archive pages or their article bodies.

## Updating content

`src/content/articles.json` is the current content boundary. New entries must conform to `src/content/types.ts`, use a unique stable slug, select one of the typed newsletter IDs, store cover art under `public/images/articles/`, and include an original source URL for provenance and the reader endcap. Newsletter archive destinations are allowlisted in `src/content/articles.ts`. Body links accept only explicit `http://` or `https://` values.

Before publishing imported copy, confirm Beeezo still owns or has permission to republish both the text and artwork.
