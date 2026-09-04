import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('Beeezo blog routes', () => {
  it('shows all nine editions as local reader links on the archive', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Ideas for the action economy.' }),
    ).toBeVisible()
    const blogLinks = screen.getAllByRole('link', { name: 'Blog' })
    expect(blogLinks).toHaveLength(2)
    for (const link of blogLinks) {
      expect(link).toHaveAttribute('aria-current', 'page')
    }

    const articleLinks = screen.getAllByRole('link', { name: /^Read:/ })
    expect(articleLinks).toHaveLength(9)
    expect(articleLinks[0]).toHaveAttribute(
      'href',
      '/action-based-marketing-starts-with-your-product',
    )
  })

  it('uses the original cover art for the featured edition', () => {
    renderRoute('/')

    expect(
      screen.getByRole('img', {
        name: 'UX sketches and a sticky note reading User Experience.',
      }),
    ).toHaveAttribute('src', '/images/articles/action-based-marketing.png')
  })

  it('shows a useful branded fallback for an unknown route', () => {
    renderRoute('/this-route-does-not-exist')

    expect(screen.getByRole('heading', { level: 1, name: 'Signal not found.' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Return to the journal' })).toHaveAttribute('href', '/')
  })
})
