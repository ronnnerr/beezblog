import { Route, Routes } from 'react-router-dom'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { BlogIndex } from './pages/BlogIndex'
import { NotFound } from './pages/NotFound'

export function AppRoutes() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<BlogIndex />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}

