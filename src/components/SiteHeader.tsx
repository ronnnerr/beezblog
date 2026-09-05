import { Link, useLocation } from 'react-router-dom'
import { getArticleBySlug } from '../content/articles'
import { BrandLogo } from './BrandLogo'

const primaryLinks = [
  { label: 'Home', href: 'https://www.beeezo.com/' },
  { label: 'For Businesses', href: 'https://www.beeezo.com/brand' },
  { label: 'For Users', href: 'https://www.beeezo.com/user' },
  { label: 'Contact Us', href: 'https://www.beeezo.com/contact-us' },
]

function NavigationLinks({ isBlogRoute }: { isBlogRoute: boolean }) {
  return (
    <>
      {primaryLinks.slice(0, 3).map((item) => (
        <a key={item.label} href={item.href}>
          {item.label}
        </a>
      ))}
      <Link to="/" aria-current={isBlogRoute ? 'page' : undefined}>
        Blog
      </Link>
      {primaryLinks.slice(3).map((item) => (
        <a key={item.label} href={item.href}>
          {item.label}
        </a>
      ))}
    </>
  )
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  const isBlogRoute = pathname === '/' || (!slug.includes('/') && Boolean(getArticleBySlug(slug)))

  return (
    <header className="site-header">
      <a className="site-header__brand" href="https://www.beeezo.com/" aria-label="Beeezo home">
        <BrandLogo tone="light" />
      </a>

      <nav className="site-header__nav" aria-label="Primary navigation">
        <NavigationLinks isBlogRoute={isBlogRoute} />
      </nav>

      <a className="site-header__sign-in" href="https://www.beeezo.com/sign-in">
        SIGN IN
      </a>

      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          <NavigationLinks isBlogRoute={isBlogRoute} />
          <a href="https://www.beeezo.com/sign-in">SIGN IN</a>
        </nav>
      </details>
    </header>
  )
}
