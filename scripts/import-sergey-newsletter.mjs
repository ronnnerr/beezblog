import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  localizeArticleMedia,
  parseLinkedInArticleHtml,
  validateManifestArticle,
  validateSergeyNewsletterManifest,
} from './linkedin-import.mjs'
import { sergeyNewsletterManifest } from './sergey-newsletter-manifest.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const articlesPath = resolve(projectRoot, 'src/content/articles.json')
const imageDirectory = resolve(projectRoot, 'public/images/articles')
const cacheDirectory = resolve(projectRoot, '.cache/linkedin-sergey')
const allowIncomplete = process.argv.includes('--allow-incomplete')
const forceRefresh = process.argv.includes('--force')
const supportedImageTypes = new Map([
  ['image/avif', '.avif'],
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
])

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds))
}

function cacheName(entry) {
  return entry.kind === 'special' ? 'special-2026-08-23' : `edition-${String(entry.issue).padStart(2, '0')}`
}

async function fetchWithRetry(url, label) {
  let lastError

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          accept: label === 'article' ? 'text/html,application/xhtml+xml' : 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
        },
      })

      if (response.ok) {
        return response
      }

      lastError = new Error(`${label} request returned HTTP ${response.status}: ${url}`)
      if (![429, 500, 502, 503, 504, 999].includes(response.status)) {
        throw lastError
      }
    } catch (error) {
      lastError = error
    }

    if (attempt < 5) {
      await wait(1_500 * 2 ** (attempt - 1))
    }
  }

  throw lastError
}

async function readArticleHtml(entry) {
  const cachePath = resolve(cacheDirectory, `${cacheName(entry)}.html`)

  if (!forceRefresh && existsSync(cachePath)) {
    return readFile(cachePath, 'utf8')
  }

  const response = await fetchWithRetry(entry.url, 'article')
  const html = await response.text()
  // Parse before caching so a login wall or throttling response is never treated as source material.
  parseLinkedInArticleHtml(html, entry.url)
  const temporaryPath = `${cachePath}.tmp`
  await writeFile(temporaryPath, html)
  await rename(temporaryPath, cachePath)
  return html
}

async function existingImagePath(stem) {
  const candidates = (await readdir(imageDirectory)).filter(
    (name) => basename(name, extname(name)) === stem && supportedImageTypes.has(`image/${extname(name).slice(1).replace('jpg', 'jpeg')}`),
  )

  if (candidates.length > 1) {
    throw new Error(`Multiple local images already use the stem ${stem}`)
  }

  return candidates[0] ? `/images/articles/${candidates[0]}` : undefined
}

async function downloadImage(url, stem) {
  const existing = await existingImagePath(stem)
  if (existing && !forceRefresh) {
    return existing
  }

  const response = await fetchWithRetry(url, 'image')
  const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  const extension = supportedImageTypes.get(contentType)

  if (!extension) {
    throw new Error(`Unsupported image type ${contentType ?? 'missing'}: ${url}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 1_000) {
    throw new Error(`Downloaded image is unexpectedly small (${bytes.length} bytes): ${url}`)
  }

  const fileName = `${stem}${extension}`
  const finalPath = resolve(imageDirectory, fileName)
  const temporaryPath = `${finalPath}.tmp`
  await writeFile(temporaryPath, bytes)
  await rename(temporaryPath, finalPath)
  return `/images/articles/${fileName}`
}

async function main() {
  await mkdir(cacheDirectory, { recursive: true })
  await mkdir(imageDirectory, { recursive: true })

  if (!allowIncomplete) {
    validateSergeyNewsletterManifest(sergeyNewsletterManifest)
  }

  const originalArticles = JSON.parse(await readFile(articlesPath, 'utf8'))
  const marketingArticles = originalArticles.filter(
    (article) => article.newsletter === 'smarter-marketing-solutions',
  )
  const importedArticles = []

  for (const [index, entry] of sergeyNewsletterManifest.entries()) {
    const html = await readArticleHtml(entry)
    const parsed = parseLinkedInArticleHtml(html, entry.url)
    validateManifestArticle(entry, parsed)
    const localized = await localizeArticleMedia(parsed, downloadImage)
    let inlineImageIndex = 0
    const blocks = localized.blocks.map((block) => {
      if (block.type !== 'image') {
        return block
      }

      const alt = entry.inlineImageAlts?.[inlineImageIndex]
      inlineImageIndex += 1
      return alt ? { ...block, alt } : block
    })
    importedArticles.push({
      ...localized,
      blocks,
      topic: 'Blockchain & finance',
      newsletter: 'weekly-blockchain-digest',
    })
    console.log(
      `[${String(index + 1).padStart(2, '0')}/${sergeyNewsletterManifest.length}] ${localized.title}`,
    )
    await wait(1_250)
  }

  const articles = [...marketingArticles, ...importedArticles].sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  )
  const temporaryArticlesPath = `${articlesPath}.tmp`
  await writeFile(temporaryArticlesPath, `${JSON.stringify(articles, null, 2)}\n`)
  await rename(temporaryArticlesPath, articlesPath)

  console.log(
    `Imported ${importedArticles.length} Weekly Blockchain Digest articles; ${articles.length} total articles are ready.`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
