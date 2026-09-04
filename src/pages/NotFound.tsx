import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ArrowIcon'

export function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <p className="eyebrow">404 / Outside the hive</p>
      <h1>Signal not found.</h1>
      <p>The idea you followed may have moved, but the journal is still here.</p>
      <Link className="text-link" to="/">
        <ArrowIcon direction="left" /> Return to the journal
      </Link>
    </main>
  )
}

