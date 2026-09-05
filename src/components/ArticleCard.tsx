import { Link } from 'react-router-dom'
import type { Article } from '../content/articles'
import { assetUrl } from '../lib/assetUrl'
import { ArrowIcon } from './ArrowIcon'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <article className={`article-card${featured ? ' article-card--featured' : ''}`}>
      <Link className="article-card__link" to={`/${article.slug}`} aria-label={`Read: ${article.title}`}>
        <div className="article-card__media">
          <img
            src={assetUrl(article.cover)}
            alt={article.coverAlt}
            width="1280"
            height="720"
            loading={featured ? 'eager' : 'lazy'}
          />
          <span className="article-card__signal" aria-hidden="true" />
        </div>
        <div className="article-card__content">
          <div className="article-card__meta">
            <span>{article.topic}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAt}>{dateFormatter.format(new Date(article.publishedAt))}</time>
            <span aria-hidden="true">•</span>
            <span>{article.readMinutes} min read</span>
          </div>
          <h2>{article.title}</h2>
          <p>{article.dek}</p>
          <span className="article-card__action" aria-hidden="true">
            Read idea <ArrowIcon />
          </span>
        </div>
      </Link>
    </article>
  )
}
