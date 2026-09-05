import { describe, expect, it } from 'vitest'
import * as articleContent from './articles'

type NewsletterFixture = {
  name: string
  archiveUrl: string
}

type ArticleWithNewsletter = {
  slug: string
  newsletter: string
}

describe('Beeezo newsletter destinations', () => {
  it('keeps the two verified LinkedIn archives in one typed lookup', () => {
    const { newsletterById } = articleContent as unknown as {
      newsletterById: Record<string, NewsletterFixture> | undefined
    }

    expect(newsletterById).toEqual({
      'smarter-marketing-solutions': {
        name: 'Smarter Marketing Solutions',
        archiveUrl:
          'https://www.linkedin.com/newsletters/smarter-marketing-solutions-7416963116816838656',
      },
      'the-web3-pulse': {
        name: 'The Web3 Pulse',
        archiveUrl: 'https://www.linkedin.com/newsletters/the-web3-pulse-7307407314402074624',
      },
    })
  })

  it('maps every article to its verified LinkedIn newsletter', () => {
    const actualMapping = Object.fromEntries(
      (articleContent.articles as unknown as ArticleWithNewsletter[]).map((article) => [
        article.slug,
        article.newsletter,
      ]),
    )

    expect(actualMapping).toEqual({
      'action-based-marketing-starts-with-your-product': 'smarter-marketing-solutions',
      'missing-step-between-attention-and-experience': 'smarter-marketing-solutions',
      'ai-is-breaking-the-economics-of-digital-advertising': 'smarter-marketing-solutions',
      'luxury-brands-quest-based-marketing': 'smarter-marketing-solutions',
      'end-of-click-based-marketing': 'smarter-marketing-solutions',
      'social-impact-circle-usdc': 'smarter-marketing-solutions',
      'when-ai-becomes-the-gatekeeper': 'smarter-marketing-solutions',
      'marketing-has-an-input-problem': 'smarter-marketing-solutions',
      'marketing-beyond-bots': 'smarter-marketing-solutions',
      'the-quiet-collapse-of-the-lead-funnel': 'smarter-marketing-solutions',
      'performance-marketing-hitting-a-structural-wall': 'smarter-marketing-solutions',
      'marketing-in-low-trust-economies': 'smarter-marketing-solutions',
      'from-attention-to-intention': 'smarter-marketing-solutions',
      'trust-is-the-new-growth-engine': 'smarter-marketing-solutions',
      'the-world-of-modern-marketing-and-advertising': 'smarter-marketing-solutions',
      'the-money-game-navigating-web3s-evolving-funding-landscape': 'the-web3-pulse',
      'gamefi-boom-where-gaming-meets-web3-rewards': 'the-web3-pulse',
      'decentralization-unchained-the-new-wave-of-web3-trends': 'the-web3-pulse',
      'rwa-revolution-how-tokenization-is-reshaping-ownership': 'the-web3-pulse',
      'hidden-giants-the-blockchain-ecosystems-you-may-have-missed': 'the-web3-pulse',
    })
  })
})
