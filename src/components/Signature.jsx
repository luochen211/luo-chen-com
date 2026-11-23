export default function Signature({ className = '' }) {
  const classes = ['signature', className].filter(Boolean).join(' ')

  return (
    <span aria-hidden="true" className={classes}>
      Luo Chen
    </span>
  )
}
