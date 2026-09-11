import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const markerPattern = /\s*<!-- beeezo-meta:start -->[\s\S]*?<!-- beeezo-meta:end -->/g
const journalDescription =
  'Beeezo articles on marketing, customer attention, digital finance, stablecoins, and blockchain infrastructure.'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeBasePath(value) {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function replaceDocumentCopy(template, title, description) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeHtml(description)}">`,
    )
}

function metadataMarkup({ canonicalUrl, description, imageUrl, publishedAt, title, type }) {
  const tags = [
    '<!-- beeezo-meta:start -->',
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:type" content="${type}">`,
    '<meta property="og:site_name" content="Beeezo Journal">',
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}">`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
  ]

  if (publishedAt) {
    tags.push(
      `<meta property="article:published_time" content="${escapeHtml(publishedAt)}">`,
    )
  }

  tags.push('<!-- beeezo-meta:end -->')
  return tags.join('\n    ')
}

function withMetadata(template, values) {
  const cleanTemplate = template.replace(markerPattern, '')
  const withCopy = replaceDocumentCopy(cleanTemplate, values.title, values.description)

  if (!withCopy.includes('</head>')) {
    throw new Error('Built HTML does not contain a closing head tag')
  }

  return withCopy.replace('</head>', `    ${metadataMarkup(values)}\n  </head>`)
}

export async function generateStaticMetadata({
  articles,
  basePath = '/blog/',
  distDirectory,
  siteOrigin = 'https://www.beeezo.com',
}) {
  const normalizedBasePath = normalizeBasePath(basePath)
  const normalizedOrigin = siteOrigin.endsWith('/') ? siteOrigin : `${siteOrigin}/`
  const journalUrl = new URL(normalizedBasePath, normalizedOrigin).toString()
  const templatePath = resolve(distDirectory, 'index.html')
  const template = (await readFile(templatePath, 'utf8')).replace(markerPattern, '')
  const journalImagePath = articles[0]?.cover ?? '/brand/beeezo-icon.png'
  const journalImageUrl = new URL(
    `${normalizedBasePath}${journalImagePath.replace(/^\//, '')}`,
    normalizedOrigin,
  ).toString()

  await writeFile(
    templatePath,
    withMetadata(template, {
      canonicalUrl: journalUrl,
      description: journalDescription,
      imageUrl: journalImageUrl,
      title: 'Beeezo Journal',
      type: 'website',
    }),
  )

  for (const article of articles) {
    const articleDirectory = resolve(distDirectory, article.slug)
    const canonicalUrl = new URL(`${normalizedBasePath}${article.slug}/`, normalizedOrigin).toString()
    const imageUrl = new URL(
      `${normalizedBasePath}${article.cover.replace(/^\//, '')}`,
      normalizedOrigin,
    ).toString()

    await mkdir(articleDirectory, { recursive: true })
    await writeFile(
      resolve(articleDirectory, 'index.html'),
      withMetadata(template, {
        canonicalUrl,
        description: article.dek,
        imageUrl,
        publishedAt: article.publishedAt,
        title: `${article.title} | Beeezo Journal`,
        type: 'article',
      }),
    )
  }

  return { articleCount: articles.length }
}

const scriptPath = fileURLToPath(import.meta.url)

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const projectRoot = resolve(dirname(scriptPath), '..')
  const articles = JSON.parse(await readFile(resolve(projectRoot, 'src/content/articles.json'), 'utf8'))
  const result = await generateStaticMetadata({
    articles,
    basePath: process.env.VITE_BASE_PATH || '/blog/',
    distDirectory: resolve(projectRoot, 'dist'),
    siteOrigin: process.env.VITE_SITE_ORIGIN || 'https://www.beeezo.com',
  })

  console.log(`Generated static metadata for ${result.articleCount} article routes.`)
}
