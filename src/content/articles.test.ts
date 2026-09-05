/// <reference types="node" />

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { articles, getArticleBySlug, getNextArticle } from './articles'

describe('Beeezo article collection', () => {
  it('contains every edition from both verified Beeezo newsletter archives', () => {
    expect(articles).toHaveLength(20)
    expect(new Set(articles.map((article) => article.slug)).size).toBe(20)

    for (const article of articles) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(article.cover).toMatch(/^\/images\/articles\/.+\.(?:png|jpg)$/)
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
        if (block.type === 'image') {
          expect(block.src).toMatch(/^\/images\/articles\/.+\.(?:png|jpg)$/)
          expect(block.alt).not.toBe('')
          continue
        }

        const runs = block.type === 'list' ? block.items.flat() : block.content

        for (const run of runs) {
          expect(run.text).not.toMatch(/\s{2,}/)
          expect(run.text).not.toMatch(/\s+[,.!?;:)]/)
          expect(run.text).not.toMatch(/\p{Ll}\.\p{Lu}/u)
          expect(run.href ?? '').not.toMatch(/linkedin\.com/i)

          if (run.href) {
            expect(run.href).toMatch(/^https?:\/\//)
            expect(new URL(run.href).searchParams.has('trk')).toBe(false)
          }
        }
      }
    }
  })

  it('resolves every cover and inline image to a checked-in public asset', () => {
    for (const article of articles) {
      const imagePaths = [
        article.cover,
        ...article.blocks.flatMap((block) => (block.type === 'image' ? [block.src] : [])),
      ]

      for (const imagePath of imagePaths) {
        const publicPath = resolve(process.cwd(), 'public', imagePath.slice(1))

        expect(existsSync(publicPath), `${article.slug}: missing ${imagePath}`).toBe(true)
      }
    }
  })

  it('describes inline images without recycling the parent article title or dek', () => {
    const normalizeAltSubject = (value: string) => {
      const trimmed = value.trim()
      const genericArtworkMatch = trimmed.match(/^Original newsletter artwork for “(.+)”\.$/i)

      return (genericArtworkMatch?.[1] ?? trimmed).normalize('NFKC').toLocaleLowerCase()
    }

    for (const article of articles) {
      const genericSubjects = [article.title, article.dek].map(normalizeAltSubject)

      for (const block of article.blocks) {
        if (block.type !== 'image') {
          continue
        }

        expect(
          genericSubjects,
          `${article.slug}: ${block.src} needs image-specific alt text`,
        ).not.toContain(normalizeAltSubject(block.alt))
      }
    }
  })
})
