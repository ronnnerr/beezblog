import articleData from './articles.json'
import type { Article } from './types'

export type { Article, ArticleBlock, ArticleInline, ArticleTopic } from './types'

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

