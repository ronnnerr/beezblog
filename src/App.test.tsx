import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './App'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('Beeezo blog routes', () => {
  beforeEach(() => {
    document.title = 'Beeezo Journal'
  })

  it('shows all twenty newsletter editions as local reader links on the archive', () => {
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
    expect(articleLinks).toHaveLength(20)
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

  it('opens the journal with editorial text instead of decorative hero artwork', () => {
    const { container } = renderRoute('/')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Ideas for the action economy.' }),
    ).toBeVisible()
    expect(container.querySelector('.journal-hero picture')).not.toBeInTheDocument()
  })

  it('matches the landing-page sign-in label', () => {
    renderRoute('/')

    const signInLinks = screen.getAllByRole('link', { name: 'SIGN IN' })
    expect(signInLinks).toHaveLength(2)
    expect(signInLinks[0]).toBeVisible()
  })

  it('shows a useful branded fallback for an unknown route', () => {
    renderRoute('/this-route-does-not-exist')

    expect(screen.getByRole('heading', { level: 1, name: 'Signal not found.' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Return to the journal' })).toHaveAttribute('href', '/')
    for (const link of screen.getAllByRole('link', { name: 'Blog' })) {
      expect(link).not.toHaveAttribute('aria-current')
    }
  })

  it('opens a complete newsletter edition inside the Beeezo reader', () => {
    renderRoute('/marketing-beyond-bots')

    expect(screen.getByRole('heading', { level: 1, name: 'Marketing Beyond Bots' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'The Signal Breakdown' })).toBeVisible()
    expect(
      screen.getByText('The internet is filling with synthetic traffic.'),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to all ideas' })).toHaveAttribute('href', '/')
    expect(
      screen.getByRole('link', { name: 'Read this edition on LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/pulse/marketing-beyond-bots-beeezo-zueye')
  })

  it('keeps Blog current while reading a verified journal article', () => {
    renderRoute('/marketing-beyond-bots')

    for (const link of screen.getAllByRole('link', { name: 'Blog' })) {
      expect(link).toHaveAttribute('aria-current', 'page')
    }
  })

  it('preserves newsletter bullet lists in the Beeezo reader', () => {
    renderRoute('/marketing-has-an-input-problem')

    expect(screen.getByText('traffic').closest('li')).toBeVisible()
    expect(screen.getByText('clicks').closest('li')).toBeVisible()
    expect(screen.getByText('conversions').closest('li')).toBeVisible()
  })

  it('preserves numbered newsletter steps in the Beeezo reader', () => {
    renderRoute('/missing-step-between-attention-and-experience')

    expect(screen.getByText('The first is getting attention.').closest('ol')).toBeVisible()
    expect(
      screen.getByText('The second is turning that attention into meaningful experience.').closest('ol'),
    ).toBeVisible()
  })

  it('keeps original inline newsletter artwork inside its local reader', () => {
    renderRoute('/performance-marketing-hitting-a-structural-wall')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Performance Marketing Is Hitting a Structural Wall',
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('img', { name: /90-day competitive LinkedIn engagement benchmark/i }),
    ).toBeVisible()
  })

  it('preserves cited passages from The Web3 Pulse as quotations', () => {
    renderRoute('/hidden-giants-the-blockchain-ecosystems-you-may-have-missed')

    expect(
      screen
        .getByText(/NEAR Protocol has focused on strengthening its technical infrastructure/)
        .closest('blockquote'),
    ).toBeVisible()
  })

  it('updates page metadata and points readers to the next local edition', () => {
    renderRoute('/marketing-beyond-bots')

    expect(document.title).toBe('Marketing Beyond Bots — Beeezo Journal')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Synthetic traffic is expanding. Human attention is not. The market will eventually learn to price the difference.',
    )
    expect(screen.getByRole('link', { name: /Read next: The Quiet Collapse/i })).toHaveAttribute(
      'href',
      '/the-quiet-collapse-of-the-lead-funnel',
    )
  })

  it('confirms when the current Beeezo reader link has been copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    renderRoute('/marketing-beyond-bots')

    fireEvent.click(screen.getByRole('button', { name: 'Copy article link' }))

    expect(await screen.findByRole('button', { name: 'Link copied' })).toBeVisible()
  })

  it('returns to the top and resets reader tools when opening the next local edition', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    renderRoute('/marketing-beyond-bots')

    fireEvent.click(screen.getByRole('button', { name: 'Copy article link' }))
    expect(await screen.findByRole('button', { name: 'Link copied' })).toBeVisible()
    fireEvent.click(screen.getByRole('link', { name: /Read next: The Quiet Collapse/i }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'The Quiet Collapse of the Lead Funnel',
      }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Copy article link' })).toBeVisible()
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
