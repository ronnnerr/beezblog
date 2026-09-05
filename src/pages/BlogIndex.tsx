import { useState } from 'react'
import { ArticleCard } from '../components/ArticleCard'
import { NewsletterFilter } from '../components/NewsletterFilter'
import type { NewsletterFilterValue } from '../components/NewsletterFilter'
import { articles, newsletterById } from '../content/articles'

export function BlogIndex() {
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterFilterValue>('all')
  const visibleArticles =
    selectedNewsletter === 'all'
      ? articles
      : articles.filter((article) => article.newsletter === selectedNewsletter)
  const [featuredArticle, ...archiveArticles] = visibleArticles
  const archiveHeading =
    selectedNewsletter === 'all'
      ? 'All ideas'
      : `More from ${newsletterById[selectedNewsletter].name}`

  return (
    <>
      <section className="journal-hero" aria-labelledby="journal-title">
        <div className="journal-hero__label">
          <span>Beeezo</span>
          <span aria-hidden="true">/</span>
          <span>Journal</span>
        </div>
        <div className="journal-hero__copy">
          <h1 id="journal-title">Ideas for the action economy.</h1>
          <p>
            Practical ideas about marketing, customer attention, and building products people
            choose to use.
          </p>
        </div>
        <div
          className="journal-hero__status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span aria-hidden="true">{String(visibleArticles.length).padStart(2, '0')}</span>
          <span aria-hidden="true">Published ideas</span>
          <span className="sr-only">{visibleArticles.length} published ideas shown.</span>
        </div>
      </section>

      <main id="main-content" className="journal-main">
        <NewsletterFilter selected={selectedNewsletter} onSelect={setSelectedNewsletter} />

        <section className="featured-section" aria-labelledby="latest-heading">
          <div className="section-heading">
            <h2 id="latest-heading" className="eyebrow">
              Latest Article
            </h2>
          </div>
          <ArticleCard article={featuredArticle} featured />
        </section>

        <section className="archive-section" aria-labelledby="archive-heading">
          <div className="section-heading section-heading--archive">
            <p className="eyebrow">From the journal</p>
            <h2 id="archive-heading">{archiveHeading}</h2>
          </div>
          <div className="article-grid">
            {archiveArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
