import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowIcon } from '../components/ArrowIcon'
import { ArticleBody } from '../components/ArticleBody'
import { CopyLinkButton } from '../components/CopyLinkButton'
import { ReadingProgress } from '../components/ReadingProgress'
import { articles, getArticleBySlug, getNextArticle } from '../content/articles'
import { assetUrl } from '../lib/assetUrl'
import { NotFound } from './NotFound'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function ArticleReader() {
  const { slug = '' } = useParams()
  const article = getArticleBySlug(slug)
  const nextArticle = article ? getNextArticle(article.slug) : undefined

  useEffect(() => {
    if (!article) {
      return
    }

    window.scrollTo(0, 0)

    const previousTitle = document.title
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const createdDescription = !description

    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.append(description)
    }

    const previousDescription = description.content
    document.title = `${article.title} — Beeezo Journal`
    description.content = article.dek

    return () => {
      document.title = previousTitle
      if (createdDescription) {
        description.remove()
      } else {
        description.content = previousDescription
      }
    }
  }, [article])

  if (!article) {
    return <NotFound />
  }

  const position = articles.findIndex((item) => item.slug === article.slug) + 1

  return (
    <main id="main-content" className="reader">
      <ReadingProgress />

      <div className="reader__topbar">
        <Link className="text-link" to="/">
          <ArrowIcon direction="left" /> Back to all ideas
        </Link>
        <span>
          {String(position).padStart(2, '0')} / {String(articles.length).padStart(2, '0')}
        </span>
      </div>

      <article>
        <header className="reader__header">
          <div className="reader__meta">
            <span>{article.topic}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAt}>
              {dateFormatter.format(new Date(article.publishedAt))}
            </time>
            <span aria-hidden="true">•</span>
            <span>{article.readMinutes} min read</span>
          </div>
          <h1>{article.title}</h1>
          <p className="reader__dek">{article.dek}</p>
        </header>

        <figure className="reader__cover">
          <img
            src={assetUrl(article.cover)}
            alt={article.coverAlt}
            width="1280"
            height="720"
            loading="eager"
          />
        </figure>

        <div className="reader__layout">
          <aside className="reader__utility" aria-label="Article tools">
            <p>Share this idea</p>
            <CopyLinkButton key={article.slug} />
          </aside>
          <ArticleBody blocks={article.blocks} />
        </div>
      </article>

      {nextArticle ? (
        <aside className="next-article" aria-labelledby="next-article-heading">
          <div>
            <p className="eyebrow">Keep reading</p>
            <h2 id="next-article-heading">Next signal</h2>
          </div>
          <Link
            className="next-article__link"
            to={`/${nextArticle.slug}`}
            aria-label={`Read next: ${nextArticle.title}`}
          >
            <span>{nextArticle.title}</span>
            <ArrowIcon />
          </Link>
        </aside>
      ) : null}
    </main>
  )
}
