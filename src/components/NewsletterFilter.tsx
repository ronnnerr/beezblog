import { newsletterById } from '../content/articles'
import type { NewsletterId } from '../content/articles'
import './NewsletterFilter.css'

export type NewsletterFilterValue = 'all' | NewsletterId

interface NewsletterFilterProps {
  selected: NewsletterFilterValue
  onSelect: (filter: NewsletterFilterValue) => void
}

const filterOptions: Array<{ label: string; value: NewsletterFilterValue }> = [
  { label: 'All Articles', value: 'all' },
  {
    label: newsletterById['smarter-marketing-solutions'].name,
    value: 'smarter-marketing-solutions',
  },
  { label: newsletterById['the-web3-pulse'].name, value: 'the-web3-pulse' },
]

export function NewsletterFilter({ selected, onSelect }: NewsletterFilterProps) {
  return (
    <div className="newsletter-filter" role="group" aria-label="Filter articles by newsletter">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          className="newsletter-filter__button"
          type="button"
          aria-pressed={selected === option.value}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
