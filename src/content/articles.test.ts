import { describe, expect, it } from 'vitest'
import { articles, getArticleBySlug, getNextArticle } from './articles'

describe('Beeezo article collection', () => {
  it('contains the nine verified newsletter editions with unique local routes', () => {
    expect(articles).toHaveLength(9)
    expect(new Set(articles.map((article) => article.slug)).size).toBe(9)

    for (const article of articles) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(article.cover).toMatch(/^\/images\/articles\/.+\.png$/)
      expect(article.sourceUrl).toMatch(/^https:\/\/www\.linkedin\.com\/pulse\//)
      expect(article.blocks.length).toBeGreaterThan(5)
    }
  })

  it('finds an article by its stable slug and rejects an unknown slug', () => {
    expect(getArticleBySlug('marketing-beyond-bots')?.title).toBe('Marketing Beyond Bots')
    expect(getArticleBySlug('missing')).toBeUndefined()
  })

  it('returns the following edition and wraps from the last edition to the first', () => {
    expect(getNextArticle(articles[0].slug)?.slug).toBe(articles[1].slug)
    expect(getNextArticle(articles.at(-1)!.slug)?.slug).toBe(articles[0].slug)
    expect(getNextArticle('missing')).toBeUndefined()
  })

  it('keeps the local reading copy free of LinkedIn routing and import whitespace artifacts', () => {
    for (const article of articles) {
      for (const block of article.blocks) {
        const runs = block.type === 'list' ? block.items.flat() : block.content

        for (const run of runs) {
          expect(run.text).not.toMatch(/\s{2,}/)
          expect(run.href ?? '').not.toMatch(/linkedin\.com/i)
        }
      }
    }
  })
})
