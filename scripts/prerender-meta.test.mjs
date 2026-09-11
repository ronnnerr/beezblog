import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { generateStaticMetadata } from './prerender-meta.mjs'

const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  )
})

describe('static article metadata', () => {
  it('writes crawlable journal and article pages with canonical social metadata', async () => {
    const distDirectory = await mkdtemp(join(tmpdir(), 'beeezo-meta-'))
    temporaryDirectories.push(distDirectory)
    await writeFile(
      join(distDirectory, 'index.html'),
      '<!doctype html><html><head><meta name="description" content="Generic"><title>Beeezo Journal</title></head><body><script src="/blog/assets/app.js"></script></body></html>',
    )

    const articles = [
      {
        slug: 'build-and-trust',
        title: 'Build & "Trust" <Now>',
        dek: 'A clear look at builders & markets.',
        publishedAt: '2026-09-07T12:00:00.000Z',
        cover: '/images/articles/build-and-trust.png',
      },
    ]

    await generateStaticMetadata({
      articles,
      basePath: '/blog/',
      distDirectory,
      siteOrigin: 'https://www.beeezo.com/',
    })
    await generateStaticMetadata({
      articles,
      basePath: '/blog/',
      distDirectory,
      siteOrigin: 'https://www.beeezo.com/',
    })

    const journalHtml = await readFile(join(distDirectory, 'index.html'), 'utf8')
    const articleHtml = await readFile(
      join(distDirectory, 'build-and-trust', 'index.html'),
      'utf8',
    )

    expect(journalHtml).toContain(
      '<link rel="canonical" href="https://www.beeezo.com/blog/">',
    )
    expect(journalHtml).toContain('<meta property="og:type" content="website">')
    expect(articleHtml).toContain('<title>Build &amp; &quot;Trust&quot; &lt;Now&gt; | Beeezo Journal</title>')
    expect(articleHtml).toContain(
      '<link rel="canonical" href="https://www.beeezo.com/blog/build-and-trust/">',
    )
    expect(articleHtml).toContain('<meta property="og:type" content="article">')
    expect(articleHtml).toContain(
      '<meta property="og:image" content="https://www.beeezo.com/blog/images/articles/build-and-trust.png">',
    )
    expect(articleHtml).toContain(
      '<meta property="article:published_time" content="2026-09-07T12:00:00.000Z">',
    )
    expect(articleHtml).toContain('<script src="/blog/assets/app.js"></script>')
    expect(articleHtml.match(/beeezo-meta:start/g)).toHaveLength(1)
  })
})
