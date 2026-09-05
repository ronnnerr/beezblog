import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleBody } from './ArticleBody'

describe('ArticleBody links', () => {
  it('renders unsafe imported URL schemes as plain text', () => {
    render(
      <ArticleBody
        blocks={[
          {
            type: 'paragraph',
            content: [
              { text: 'Trusted source', href: 'https://example.com/report' },
              { text: ' and ' },
              { text: 'unsafe source', href: 'javascript:alert(1)' },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByRole('link', { name: 'Trusted source' })).toHaveAttribute(
      'href',
      'https://example.com/report',
    )
    expect(screen.getByText('unsafe source')).not.toHaveAttribute('href')
  })
})
