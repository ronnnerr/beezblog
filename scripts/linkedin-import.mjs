import { Window } from 'happy-dom'

function normalizeInlineText(value) {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ')
}

function cleanHref(value) {
  if (!value) {
    return undefined
  }

  try {
    const url = new URL(value)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return undefined
    }

    if (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com')) {
      return undefined
    }

    for (const key of [...url.searchParams.keys()]) {
      if (key === 'trk' || key.startsWith('utm_')) {
        url.searchParams.delete(key)
      }
    }

    return url.toString()
  } catch {
    return undefined
  }
}

function hasBoldStyle(element) {
  return (
    element?.matches?.('strong, b') ||
    [...(element?.classList ?? [])].some((name) => name.includes('font-[700]'))
  )
}

function parseInlineContent(container) {
  const runs = []

  function visit(node, state) {
    if (node.nodeType === 3) {
      const text = normalizeInlineText(node.textContent ?? '')

      if (!text) {
        return
      }

      const run = { text }
      if (state.bold) {
        run.bold = true
      }
      if (state.href) {
        run.href = state.href
      }

      const previous = runs.at(-1)
      if (previous && previous.bold === run.bold && previous.href === run.href) {
        previous.text += run.text
      } else {
        runs.push(run)
      }
      return
    }

    if (node.nodeType !== 1) {
      return
    }

    const element = node
    const nextState = {
      bold: state.bold || hasBoldStyle(element),
      href: element.matches('a') ? cleanHref(element.getAttribute('href')) : state.href,
    }

    for (const child of element.childNodes) {
      visit(child, nextState)
    }
  }

  visit(container, { bold: false, href: undefined })

  for (const run of runs) {
    run.text = normalizeInlineText(run.text)
      .replace(/\s+([,.!?;:)])/g, '$1')
      .replace(/([([])\s+/g, '$1')
  }

  for (let index = 1; index < runs.length; index += 1) {
    const previous = runs[index - 1]
    const current = runs[index]

    if (/\s$/.test(previous.text) && /^\s/.test(current.text)) {
      current.text = current.text.replace(/^\s+/, '')
    }
    if (/^[,.!?;:)]/.test(current.text)) {
      previous.text = previous.text.replace(/\s+$/, '')
    }
    if (/[([]$/.test(previous.text)) {
      current.text = current.text.replace(/^\s+/, '')
    }
  }

  if (runs.length > 0) {
    runs[0].text = runs[0].text.replace(/^\s+/, '')
    runs.at(-1).text = runs.at(-1).text.replace(/\s+$/, '')
  }

  return runs.filter((run) => run.text.length > 0)
}

function inlineText(runs) {
  return normalizeInlineText(runs.map((run) => run.text).join('')).trim()
}

function parseTextBlock(element) {
  const list = element.querySelector('ul, ol')
  if (list) {
    const items = [...list.querySelectorAll(':scope > li')]
      .map((item) => parseInlineContent(item))
      .filter((item) => item.length > 0)

    if (items.length === 0) {
      return undefined
    }

    return {
      type: 'list',
      ...(list.tagName === 'OL' ? { ordered: true } : {}),
      items,
    }
  }

  const quote = element.querySelector('blockquote')
  if (quote) {
    const content = parseInlineContent(quote)
    return content.length > 0 ? { type: 'quote', content } : undefined
  }

  const heading = element.querySelector('h1, h2, h3, h4')
  if (heading) {
    const content = parseInlineContent(heading)
    return content.length > 0 ? { type: 'heading', content } : undefined
  }

  const paragraph = element.querySelector('p')
  if (paragraph) {
    const content = parseInlineContent(paragraph)
    return content.length > 0 ? { type: 'paragraph', content } : undefined
  }

  return undefined
}

function parseImageBlock(element) {
  const image = element.querySelector('img')
  const src = image?.getAttribute('data-delayed-url') || image?.getAttribute('src')

  if (!image || !src) {
    return undefined
  }

  const alt = normalizeInlineText(image.getAttribute('alt') ?? '').trim()
  const caption = normalizeInlineText(
    element.querySelector('[data-test-id="publishing-image-block-caption"]')?.textContent ?? '',
  ).trim()

  return {
    type: 'image',
    src,
    alt: alt || caption || 'Newsletter illustration',
    ...(caption ? { caption } : {}),
  }
}

function parseContentBlocks(contentRoot) {
  const blocks = []

  for (const element of contentRoot.children) {
    const blockType = element.getAttribute('data-test-id')

    if (blockType === 'publishing-text-block') {
      const block = parseTextBlock(element)
      if (block) {
        blocks.push(block)
      }
      continue
    }

    if (blockType === 'publishing-image-block') {
      const block = parseImageBlock(element)
      if (block) {
        blocks.push(block)
      }
      continue
    }

    if (!blockType || blockType === 'publishing-divider-block') {
      continue
    }

    if (blockType.startsWith('publishing-')) {
      throw new Error(`Unsupported LinkedIn publishing block: ${blockType}`)
    }
  }

  return blocks
}

function findArticleJsonLd(document) {
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const value = JSON.parse(script.textContent ?? 'null')
      const candidates = Array.isArray(value)
        ? value
        : Array.isArray(value?.['@graph'])
          ? value['@graph']
          : [value]
      const article = candidates.find((candidate) => candidate?.['@type'] === 'Article')

      if (article) {
        return article
      }
    } catch {
      // LinkedIn can include unrelated malformed metadata. Keep looking.
    }
  }

  return undefined
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function deriveDek(blocks) {
  const takeawayIndex = blocks.findIndex(
    (block) => block.type === 'heading' && /^takeaway of the week$/i.test(inlineText(block.content)),
  )
  const candidates = takeawayIndex >= 0 ? blocks.slice(takeawayIndex + 1) : blocks
  const paragraph = candidates.find((block) => block.type === 'paragraph')

  return paragraph ? inlineText(paragraph.content) : ''
}

function countWords(blocks) {
  return blocks.reduce((count, block) => {
    const groups = block.type === 'list' ? block.items : 'content' in block ? [block.content] : []
    return (
      count +
      groups.reduce(
        (groupCount, group) =>
          groupCount + inlineText(group).split(/\s+/).filter(Boolean).length,
        0,
      )
    )
  }, 0)
}

function blockText(block) {
  if (block.type === 'image') {
    return ''
  }

  const groups = block.type === 'list' ? block.items : [block.content]
  return groups.map((group) => inlineText(group)).join(' ')
}

function metadataAuthorName(metadata) {
  const authors = Array.isArray(metadata?.author) ? metadata.author : [metadata?.author]
  return authors.find((author) => typeof author?.name === 'string')?.name?.trim()
}

export function validateSergeyNewsletterManifest(entries) {
  const issueNumbers = new Set()
  const urls = new Set()
  let specialCount = 0

  for (const entry of entries) {
    if (!entry?.url || !/^https:\/\/www\.linkedin\.com\/pulse\//.test(entry.url)) {
      throw new Error(`Invalid LinkedIn newsletter URL: ${entry?.url ?? 'missing'}`)
    }

    if (urls.has(entry.url)) {
      throw new Error(`Duplicate newsletter URL: ${entry.url}`)
    }
    urls.add(entry.url)

    if (entry.kind === 'special') {
      specialCount += 1
      continue
    }

    if (!Number.isInteger(entry.issue) || entry.issue < 1 || entry.issue > 63) {
      throw new Error(`Invalid newsletter issue: ${entry.issue ?? 'missing'}`)
    }
    if (issueNumbers.has(entry.issue)) {
      throw new Error(`Duplicate newsletter issue: ${entry.issue}`)
    }
    issueNumbers.add(entry.issue)
  }

  const missingIssues = Array.from({ length: 63 }, (_, index) => index + 1).filter(
    (issue) => !issueNumbers.has(issue),
  )

  if (missingIssues.length > 0) {
    throw new Error(`Missing numbered newsletter editions: ${missingIssues.join(', ')}`)
  }
  if (specialCount !== 1) {
    throw new Error(`Expected one archive special; found ${specialCount}`)
  }

  return {
    numberedCount: issueNumbers.size,
    specialCount,
    totalCount: entries.length,
  }
}

export function validateManifestArticle(entry, article) {
  if (article.sourceUrl !== entry.url) {
    throw new Error(`Imported article URL does not match manifest: ${entry.url}`)
  }

  if (entry.kind === 'special') {
    return
  }

  const editionText = [article.title, ...article.blocks.map(blockText)].join(' ')
  const editionMatch = editionText.match(/(?:edition|digest)\s*#(\d+)/i)

  if (editionMatch && Number(editionMatch[1]) !== entry.issue) {
    throw new Error(
      `Manifest issue ${entry.issue} does not match article edition ${editionMatch[1]}`,
    )
  }
}

export async function localizeArticleMedia(article, downloadImage) {
  const { coverUrl, ...articleWithoutRemoteCover } = article
  const cover = await downloadImage(coverUrl, article.slug)
  let imageIndex = 0
  const blocks = []

  for (const block of article.blocks) {
    if (block.type !== 'image') {
      blocks.push(block)
      continue
    }

    imageIndex += 1
    const suffix = String(imageIndex).padStart(2, '0')
    blocks.push({
      ...block,
      src: await downloadImage(block.src, `${article.slug}-inline-${suffix}`),
    })
  }

  return {
    ...articleWithoutRemoteCover,
    cover,
    blocks,
  }
}

export function parseLinkedInArticleHtml(html, sourceUrl) {
  const window = new Window({ settings: { disableJavaScriptEvaluation: true } })
  window.document.write(html)
  const { document } = window
  const metadata = findArticleJsonLd(document)
  const title =
    document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ||
    document.querySelector('h1.pulse-title')?.textContent?.trim()
  const publishedAt = metadata?.datePublished
  const coverUrl =
    metadata?.image?.url ||
    document.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim()
  const contentRoot = document.querySelector('[data-test-id="article-content-blocks"]')
  const authorName = metadataAuthorName(metadata)
  const newsletterName = normalizeInlineText(
    document.querySelector('.main-publisher-card .base-main-card__title')?.textContent ?? '',
  ).trim()

  if (!title || !publishedAt || !coverUrl || !contentRoot) {
    throw new Error(`Incomplete LinkedIn article metadata: ${sourceUrl}`)
  }
  if (authorName !== 'Sergey Kiklevich') {
    throw new Error(`Unexpected LinkedIn article author: ${authorName ?? 'missing'}`)
  }
  if (newsletterName !== 'Weekly Blockchain Digest') {
    throw new Error(`Unexpected LinkedIn newsletter: ${newsletterName || 'missing'}`)
  }

  const blocks = parseContentBlocks(contentRoot)
  const wordCount = countWords(blocks)

  return {
    slug: slugify(title),
    title,
    dek: deriveDek(blocks),
    publishedAt,
    coverUrl,
    coverAlt: `Weekly Blockchain Digest cover for ${title}${/[.!?]$/.test(title) ? '' : '.'}`,
    sourceUrl,
    readMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    blocks,
  }
}
