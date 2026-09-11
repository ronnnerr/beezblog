import { describe, expect, it } from 'vitest'
import {
  localizeArticleMedia,
  parseLinkedInArticleHtml,
  validateManifestArticle,
  validateSergeyNewsletterManifest,
} from './linkedin-import.mjs'
import { vi } from 'vitest'

const sourceUrl =
  'https://www.linkedin.com/pulse/sample-weekly-digest-sergey-kiklevich-abcde'

const fixture = `<!doctype html>
<html>
  <head>
    <meta property="og:title" content="The Infrastructure Test">
    <meta property="og:image" content="https://media.licdn.com/cover.jpg?e=1&amp;v=beta">
    <script type="application/ld+json">
      {
        "@type": "Article",
        "datePublished": "2026-02-09T16:30:00.000+00:00",
        "author": { "@type": "Person", "name": "Sergey Kiklevich" }
      }
    </script>
  </head>
  <body>
    <h1 class="pulse-title">The Infrastructure Test</h1>
    <div data-test-id="article-content-blocks">
      <div data-test-id="publishing-text-block"><h2><span>Founder’s Weekly Blockchain Digest</span></h2></div>
      <div data-test-id="publishing-text-block"><h3><span>Edition #33: February 2–8, 2026</span></h3></div>
      <div data-test-id="publishing-text-block"><h3><span>Takeaway of the Week</span></h3></div>
      <div data-test-id="publishing-text-block"><p><span>Infrastructure   compounds while markets hesitate.</span></p></div>
      <div class="inline-articles"><p>This recommendation is not part of the newsletter.</p></div>
      <div data-test-id="publishing-text-block">
        <p><span><ul><li><span class="font-[700]">Verified settlement</span></li><li><span>Programmable money</span></li></ul></span></p>
      </div>
      <div data-test-id="publishing-text-block"><blockquote><span class="font-[700]">“The rails are becoming the product.”</span></blockquote></div>
      <div data-test-id="publishing-image-block">
        <figure>
          <img data-delayed-url="https://media.licdn.com/diagram.png?e=1&amp;v=beta" alt="Settlement network diagram">
          <figcaption data-test-id="publishing-image-block-caption">How the settlement network connects.</figcaption>
        </figure>
      </div>
      <div data-test-id="publishing-text-block"><p><span>Read the </span><a href="https://example.com/report?utm_source=linkedin"><span class="font-[700]">source report</span></a><span>.</span></p></div>
    </div>
    <div class="main-publisher-card">
      <h3 class="base-main-card__title">Weekly Blockchain Digest</h3>
    </div>
  </body>
</html>`

describe('LinkedIn newsletter import', () => {
  it('turns Sergey newsletter HTML into ordered local article data', () => {
    const parsed = parseLinkedInArticleHtml(fixture, sourceUrl)

    expect(parsed).toEqual({
      slug: 'the-infrastructure-test',
      title: 'The Infrastructure Test',
      dek: 'Infrastructure compounds while markets hesitate.',
      publishedAt: '2026-02-09T16:30:00.000+00:00',
      coverUrl: 'https://media.licdn.com/cover.jpg?e=1&v=beta',
      coverAlt: 'Weekly Blockchain Digest cover for The Infrastructure Test.',
      sourceUrl,
      readMinutes: 1,
      blocks: [
        {
          type: 'heading',
          content: [{ text: 'Founder’s Weekly Blockchain Digest' }],
        },
        {
          type: 'heading',
          content: [{ text: 'Edition #33: February 2–8, 2026' }],
        },
        {
          type: 'heading',
          content: [{ text: 'Takeaway of the Week' }],
        },
        {
          type: 'paragraph',
          content: [{ text: 'Infrastructure compounds while markets hesitate.' }],
        },
        {
          type: 'list',
          items: [[{ text: 'Verified settlement', bold: true }], [{ text: 'Programmable money' }]],
        },
        {
          type: 'quote',
          content: [{ text: '“The rails are becoming the product.”', bold: true }],
        },
        {
          type: 'image',
          src: 'https://media.licdn.com/diagram.png?e=1&v=beta',
          alt: 'Settlement network diagram',
          caption: 'How the settlement network connects.',
        },
        {
          type: 'paragraph',
          content: [
            { text: 'Read the ' },
            { text: 'source report', bold: true, href: 'https://example.com/report' },
            { text: '.' },
          ],
        },
      ],
    })
  })

  it('fails closed when LinkedIn contains a publishing block the reader cannot preserve', () => {
    const html = fixture.replace(
      '    </div>\n    <div class="main-publisher-card">',
      '      <div data-test-id="publishing-embed-block">Interactive chart</div>\n    </div>\n    <div class="main-publisher-card">',
    )

    expect(() => parseLinkedInArticleHtml(html, sourceUrl)).toThrow(
      'Unsupported LinkedIn publishing block: publishing-embed-block',
    )
  })

  it('rejects an article that is not authored by Sergey Kiklevich', () => {
    const html = fixture.replace('"name": "Sergey Kiklevich"', '"name": "Someone Else"')

    expect(() => parseLinkedInArticleHtml(html, sourceUrl)).toThrow(
      'Unexpected LinkedIn article author: Someone Else',
    )
  })

  it('rejects a Sergey article that is not part of Weekly Blockchain Digest', () => {
    const html = fixture.replace('Weekly Blockchain Digest</h3>', 'An ordinary article</h3>')

    expect(() => parseLinkedInArticleHtml(html, sourceUrl)).toThrow(
      'Unexpected LinkedIn newsletter: An ordinary article',
    )
  })

  it('normalizes whitespace across adjacent LinkedIn text nodes', () => {
    const html = fixture.replace(
      '<p><span>Infrastructure   compounds while markets hesitate.</span></p>',
      '<p><span>Infrastructure </span><span>  compounds </span><span> . Markets hesitate.</span></p>',
    )
    const parsed = parseLinkedInArticleHtml(html, sourceUrl)
    const paragraph = parsed.blocks.find(
      (block) => block.type === 'paragraph' && block.content.some((run) => run.text.includes('Infrastructure')),
    )

    expect(paragraph.content).toEqual([{ text: 'Infrastructure compounds. Markets hesitate.' }])
  })

  it('does not double the final punctuation in generated cover alt text', () => {
    const html = fixture.replaceAll('The Infrastructure Test', 'Pick a Side? There Are No Sides.')

    expect(parseLinkedInArticleHtml(html, sourceUrl).coverAlt).toBe(
      'Weekly Blockchain Digest cover for Pick a Side? There Are No Sides.',
    )
  })

  it('requires one unique URL for editions 1 through 63 plus the archive special', () => {
    const numbered = Array.from({ length: 63 }, (_, index) => ({
      issue: index + 1,
      url: `https://www.linkedin.com/pulse/edition-${index + 1}-sergey-kiklevich-abcde`,
    }))
    const special = {
      kind: 'special',
      publishedDate: '2026-08-23',
      url: 'https://www.linkedin.com/pulse/archive-special-sergey-kiklevich-abcde',
    }

    expect(validateSergeyNewsletterManifest([...numbered, special])).toEqual({
      numberedCount: 63,
      specialCount: 1,
      totalCount: 64,
    })

    expect(() => validateSergeyNewsletterManifest([...numbered.slice(1), special])).toThrow(
      'Missing numbered newsletter editions: 1',
    )
    expect(() =>
      validateSergeyNewsletterManifest([
        ...numbered,
        { ...numbered[0], url: `${numbered[0].url}-duplicate` },
        special,
      ]),
    ).toThrow('Duplicate newsletter issue: 1')
  })

  it('detects an edition number mismatch when LinkedIn exposes one in the article', () => {
    const parsed = parseLinkedInArticleHtml(fixture, sourceUrl)

    expect(() => validateManifestArticle({ issue: 32, url: sourceUrl }, parsed)).toThrow(
      'Manifest issue 32 does not match article edition 33',
    )
    expect(validateManifestArticle({ issue: 33, url: sourceUrl }, parsed)).toBeUndefined()
  })

  it('replaces every remote cover and body image with a deterministic local path', async () => {
    const parsed = parseLinkedInArticleHtml(fixture, sourceUrl)
    const downloadImage = vi.fn(async (_url, stem) => `/images/articles/${stem}.jpg`)

    const localized = await localizeArticleMedia(parsed, downloadImage)

    expect(downloadImage).toHaveBeenNthCalledWith(
      1,
      'https://media.licdn.com/cover.jpg?e=1&v=beta',
      'the-infrastructure-test',
    )
    expect(downloadImage).toHaveBeenNthCalledWith(
      2,
      'https://media.licdn.com/diagram.png?e=1&v=beta',
      'the-infrastructure-test-inline-01',
    )
    expect(localized.cover).toBe('/images/articles/the-infrastructure-test.jpg')
    expect(localized.blocks.find((block) => block.type === 'image')?.src).toBe(
      '/images/articles/the-infrastructure-test-inline-01.jpg',
    )
    expect(localized).not.toHaveProperty('coverUrl')
  })
})
