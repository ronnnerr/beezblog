export type ArticleTopic =
  | 'Action-based marketing'
  | 'AI & attention'
  | 'AI discovery'
  | 'Brand strategy'
  | 'Measurement'
  | 'Product experience'
  | 'Stablecoins'
  | 'Verified attention'
  | 'Blockchain & finance'

export type NewsletterId = 'smarter-marketing-solutions' | 'weekly-blockchain-digest'

export interface Newsletter {
  name: string
  archiveUrl: string
}

export interface ArticleInline {
  text: string
  bold?: boolean
  href?: string
}

export interface ArticleTextBlock {
  type: 'heading' | 'paragraph' | 'quote'
  content: ArticleInline[]
}

export interface ArticleListBlock {
  type: 'list'
  ordered?: boolean
  items: ArticleInline[][]
}

export interface ArticleImageBlock {
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export type ArticleBlock = ArticleTextBlock | ArticleListBlock | ArticleImageBlock

export interface Article {
  slug: string
  title: string
  dek: string
  publishedAt: string
  topic: ArticleTopic
  newsletter: NewsletterId
  cover: string
  coverAlt: string
  sourceUrl: string
  readMinutes: number
  blocks: ArticleBlock[]
}
