import { SiTiktok, SiX, SiXiaohongshu } from 'react-icons/si'

const icons = {
  douyin: SiTiktok,
  x: SiX,
  xiaohongshu: SiXiaohongshu,
}

export default function SocialIcon({ name }) {
  const Icon = icons[name]
  if (!Icon) return null
  return <Icon className={`social-icon social-icon-${name}`} aria-hidden="true" focusable="false" />
}
