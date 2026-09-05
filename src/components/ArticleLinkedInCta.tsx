import type { Newsletter } from '../content/articles'
import { ArrowIcon } from './ArrowIcon'
import './ArticleLinkedInCta.css'

interface ArticleLinkedInCtaProps {
  newsletter: Newsletter
  sourceUrl: string
}

export function ArticleLinkedInCta({ newsletter, sourceUrl }: ArticleLinkedInCtaProps) {
  return (
    <aside className="article-linkedin-cta" aria-label="Continue on LinkedIn">
      <div className="article-linkedin-cta__intro">
        <p className="article-linkedin-cta__eyebrow">Beeezo on LinkedIn</p>
        <p className="article-linkedin-cta__series">{newsletter.name}</p>
      </div>

      <div className="article-linkedin-cta__actions">
        <a
          className="article-linkedin-cta__link article-linkedin-cta__link--primary"
          href={newsletter.archiveUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span>Subscribe to {newsletter.name} on LinkedIn</span>
          <ArrowIcon direction="up-right" />
        </a>
        <a
          className="article-linkedin-cta__link article-linkedin-cta__link--edition"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span>Read this edition on LinkedIn</span>
          <ArrowIcon direction="up-right" />
        </a>
      </div>
    </aside>
  )
}
