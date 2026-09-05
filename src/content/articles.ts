import articleData from './articles.json'
import type { Article, Newsletter, NewsletterId } from './types'

export type {
  Article,
  ArticleBlock,
  ArticleInline,
  ArticleImageBlock,
  ArticleListBlock,
  ArticleTextBlock,
  ArticleTopic,
  Newsletter,
  NewsletterId,
} from './types'

export const newsletterById = {
  'smarter-marketing-solutions': {
    name: 'Smarter Marketing Solutions',
    archiveUrl:
      'https://www.linkedin.com/newsletters/smarter-marketing-solutions-7416963116816838656',
  },
  'the-web3-pulse': {
    name: 'The Web3 Pulse',
    archiveUrl: 'https://www.linkedin.com/newsletters/the-web3-pulse-7307407314402074624',
  },
} satisfies Record<NewsletterId, Newsletter>

export const articles = articleData as Article[]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getNextArticle(slug: string): Article | undefined {
  const index = articles.findIndex((article) => article.slug === slug)

  if (index === -1) {
    return undefined
  }

  return articles[(index + 1) % articles.length]
}
