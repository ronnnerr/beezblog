import { useState } from 'react'

export function CopyLinkButton() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function copyCurrentLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  const label =
    copyState === 'copied'
      ? 'Link copied'
      : copyState === 'failed'
        ? 'Copy unavailable'
        : 'Copy article link'

  return (
    <button
      className="copy-link"
      type="button"
      onClick={() => {
        void copyCurrentLink()
      }}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.5 14.5l5-5M7 17l-1.4 1.4a2.8 2.8 0 003.9 3.9l3.2-3.2a2.8 2.8 0 000-3.9M17 7l1.4-1.4a2.8 2.8 0 013.9 3.9l-3.2 3.2a2.8 2.8 0 01-3.9 0" />
      </svg>
      <span aria-live="polite">{label}</span>
    </button>
  )
}
