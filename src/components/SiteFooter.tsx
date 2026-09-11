import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <p className="eyebrow">Keep reading</p>
        <p className="site-footer__statement">More from Beeezo.</p>
        <Link className="text-link text-link--light" to="/">
          Browse all articles
        </Link>
      </div>
      <div className="site-footer__base">
        <a href="https://www.beeezo.com/" aria-label="Beeezo home">
          <BrandLogo tone="light" />
        </a>
        <div className="site-footer__legal">
          <p>©2026 Beeezo™ Santa Fe, NM, USA</p>
          <p>All trademarks, logos, and brand names are the property of their respective owners.</p>
        </div>
      </div>
    </footer>
  )
}
