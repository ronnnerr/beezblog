import { ArticleCard } from '../components/ArticleCard'
import { articles } from '../content/articles'

export function BlogIndex() {
  const [featuredArticle, ...archiveArticles] = articles

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
            Notes on human attention, measurable participation, and what marketing becomes when
            proof matters more than noise.
          </p>
        </div>
        <div className="journal-hero__status" aria-label={`${articles.length} published ideas`}>
          <span>{String(articles.length).padStart(2, '0')}</span>
          <span>Published ideas</span>
        </div>
      </section>

      <main id="main-content" className="journal-main">
        <section className="featured-section" aria-labelledby="latest-heading">
          <div className="section-heading">
            <p className="eyebrow">Latest signal</p>
            <h2 id="latest-heading" className="sr-only">
              Latest article
            </h2>
          </div>
          <ArticleCard article={featuredArticle} featured />
        </section>

        <section className="archive-section" aria-labelledby="archive-heading">
          <div className="section-heading section-heading--archive">
            <p className="eyebrow">From the journal</p>
            <h2 id="archive-heading">All ideas</h2>
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
