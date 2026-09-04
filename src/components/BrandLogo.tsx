import { assetUrl } from '../lib/assetUrl'

interface BrandLogoProps {
  tone?: 'dark' | 'light'
}

export function BrandLogo({ tone = 'dark' }: BrandLogoProps) {
  return (
    <img
      className={`brand-logo brand-logo--${tone}`}
      src={assetUrl('/brand/beeezo-wordmark.svg')}
      alt="Beeezo"
      width="146"
      height="28"
    />
  )
}

