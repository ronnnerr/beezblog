import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ArticleReader } from '../pages/ArticleReader'

function renderArticle(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/${slug}`]}>
      <Routes>
        <Route path="/:slug" element={<ArticleReader />} />
      </Routes>
    </MemoryRouter>,
  )
}

function expectExternalDestination(link: HTMLElement, href: string) {
  expect(link).toHaveAttribute('href', href)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noreferrer')
}

describe('article LinkedIn endcap', () => {
  it('links a marketing article to its edition and Smarter Marketing Solutions archive', () => {
    renderArticle('marketing-beyond-bots')

    expect(screen.getByRole('complementary', { name: 'Continue on LinkedIn' })).toBeVisible()

    expectExternalDestination(
      screen.getByRole('link', {
        name: 'Subscribe to Smarter Marketing Solutions on LinkedIn',
      }),
      'https://www.linkedin.com/newsletters/smarter-marketing-solutions-7416963116816838656',
    )
    expectExternalDestination(
      screen.getByRole('link', { name: 'Read this edition on LinkedIn' }),
      'https://www.linkedin.com/pulse/marketing-beyond-bots-beeezo-zueye',
    )
  })

  it('links a Digest article to its edition and Weekly Blockchain Digest archive', () => {
    renderArticle('weekly-blockchain-digest-3')

    expectExternalDestination(
      screen.getByRole('link', { name: 'Subscribe to Weekly Blockchain Digest on LinkedIn' }),
      'https://www.linkedin.com/newsletters/weekly-blockchain-digest-7346307320403910658',
    )
    expectExternalDestination(
      screen.getByRole('link', { name: 'Read this edition on LinkedIn' }),
      'https://www.linkedin.com/pulse/weekly-blockchain-digest-3-sergey-kiklevich-j2nve',
    )
  })
})
