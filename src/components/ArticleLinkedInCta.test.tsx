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

  it('links a Web3 article to its edition and The Web3 Pulse archive', () => {
    renderArticle('hidden-giants-the-blockchain-ecosystems-you-may-have-missed')

    expectExternalDestination(
      screen.getByRole('link', { name: 'Subscribe to The Web3 Pulse on LinkedIn' }),
      'https://www.linkedin.com/newsletters/the-web3-pulse-7307407314402074624',
    )
    expectExternalDestination(
      screen.getByRole('link', { name: 'Read this edition on LinkedIn' }),
      'https://www.linkedin.com/pulse/hidden-giants-blockchain-ecosystems-you-may-have-missed-beeezo-dhh7f',
    )
  })
})
