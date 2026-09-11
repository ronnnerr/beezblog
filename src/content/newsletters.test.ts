import { describe, expect, it } from 'vitest'
import * as articleContent from './articles'

type NewsletterFixture = {
  name: string
  archiveUrl: string
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
      'weekly-blockchain-digest': {
        name: 'Weekly Blockchain Digest',
        archiveUrl:
          'https://www.linkedin.com/newsletters/weekly-blockchain-digest-7346307320403910658',
      },
    })
  })

  it('maps every article to its verified LinkedIn newsletter', () => {
    const counts = articleContent.articles.reduce<Record<string, number>>((totals, article) => {
      totals[article.newsletter] = (totals[article.newsletter] ?? 0) + 1
      return totals
    }, {})

    expect(counts).toEqual({
      'weekly-blockchain-digest': 64,
      'smarter-marketing-solutions': 15,
    })
  })
})
