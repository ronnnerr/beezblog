interface ArrowIconProps {
  direction?: 'left' | 'right' | 'up-right'
}

export function ArrowIcon({ direction = 'right' }: ArrowIconProps) {
  return (
    <svg
      className={`arrow-icon arrow-icon--${direction}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
