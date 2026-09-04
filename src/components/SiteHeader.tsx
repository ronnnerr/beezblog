import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

const primaryLinks = [
  { label: 'Home', href: 'https://www.beeezo.com/' },
  { label: 'For Businesses', href: 'https://www.beeezo.com/brand' },
  { label: 'For Users', href: 'https://www.beeezo.com/user' },
  { label: 'Contact Us', href: 'https://www.beeezo.com/contact-us' },
]

function NavigationLinks() {
  return (
    <>
      {primaryLinks.slice(0, 3).map((item) => (
        <a key={item.label} href={item.href}>
          {item.label}
        </a>
      ))}
      <Link to="/" aria-current="page">
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
  return (
    <header className="site-header">
      <a className="site-header__brand" href="https://www.beeezo.com/" aria-label="Beeezo home">
        <BrandLogo tone="light" />
      </a>

      <nav className="site-header__nav" aria-label="Primary navigation">
        <NavigationLinks />
      </nav>

      <a className="site-header__sign-in" href="https://www.beeezo.com/sign-in">
        Sign in
      </a>

      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          <NavigationLinks />
          <a href="https://www.beeezo.com/sign-in">Sign in</a>
        </nav>
      </details>
    </header>
  )
}

