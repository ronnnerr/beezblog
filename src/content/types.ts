export type ArticleTopic =
  | 'Action-based marketing'
  | 'AI & attention'
  | 'AI discovery'
  | 'Brand strategy'
  | 'Measurement'
  | 'Product experience'
  | 'Stablecoins'
  | 'Verified attention'

export interface ArticleInline {
  text: string
  bold?: boolean
  href?: string
}

export interface ArticleBlock {
  type: 'heading' | 'paragraph'
  content: ArticleInline[]
}

export interface Article {
  slug: string
  title: string
  dek: string
  publishedAt: string
  topic: ArticleTopic
  cover: string
  coverAlt: string
  sourceUrl: string
  readMinutes: number
  blocks: ArticleBlock[]
}

