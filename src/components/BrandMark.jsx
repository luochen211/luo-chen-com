import { Link } from 'react-router-dom'

export default function BrandMark({ className = '', label }) {
  const classes = ['brand', 'brand-mark', className].filter(Boolean).join(' ')

  return (
    <Link className={classes} to="/" aria-label={label}>
      <img
        alt=""
        aria-hidden="true"
        className="brand-mark-image brand-mark-image-dark"
        height="520"
        src="/media/luochen-logo-dark.png"
        width="961"
      />
      <img
        alt=""
        aria-hidden="true"
        className="brand-mark-image brand-mark-image-light"
        height="520"
        src="/media/luochen-logo-light.png"
        width="961"
      />
    </Link>
  )
}
