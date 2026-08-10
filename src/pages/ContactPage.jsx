import SocialIcon from '../components/SocialIcon'

export default function ContactPage({ t }) {
  const isEnglish = t.nav.home === 'Home'
  const types = isEnglish
    ? ['Agent tooling and evaluation harnesses', 'Remote product engineering', 'End-to-end full-stack delivery']
    : ['Agent 工具链与评估 Harness', '远程产品工程协作', '端到端全栈交付']
  const subject = encodeURIComponent(isEnglish ? 'Collaboration inquiry' : '合作咨询')
  const body = encodeURIComponent(isEnglish
    ? 'Hi Luochen,\n\nProject context:\nDesired outcome:\nTimeline:\nBudget range:\n'
    : '落尘你好，\n\n项目背景：\n期望结果：\n时间计划：\n预算范围：\n')
  const mailto = `mailto:cuidong111@gmail.com?subject=${subject}&body=${body}`
  return (
    <section className="focused-page contact-redesign">
      <header className="route-hero contact-hero">
        <div className="contact-hero-copy">
          <p className="route-overline">{t.contact.eyebrow}</p>
          <h1>{t.contact.title}</h1>
          <p>{t.contact.intro}</p>
        </div>
        <div className="contact-action-panel">
          <p>{isEnglish ? 'Bring the context, desired outcome, timeline, and budget.' : '请带上项目背景、期望结果、时间计划和预算范围。'}</p>
          <a className="btn primary contact-primary" href={mailto}>{t.contact.email} ↗</a>
          <span>{t.contact.response}</span>
        </div>
      </header>
      <section className="collaboration-types">
        {types.map((type, index) => <article key={type}><span>{String(index + 1).padStart(2, '0')}</span><h2>{type}</h2></article>)}
      </section>
      <div className="contact-directory">
        {t.contact.cards.slice(1).map((card) => card.href ? (
          <a className={card.icon ? 'contact-social-link' : undefined} href={card.href} target="_blank" rel="noreferrer" key={card.value}>
            <span>{card.icon ? <SocialIcon name={card.icon} /> : null}{card.label}</span>
            <strong>{card.value}</strong>
          </a>
        ) : (
          <div className="contact-wechat" key={card.value}><span>{card.label}</span><strong>{card.value}</strong>{card.qrSrc ? <img src={card.qrSrc} alt={card.qrAlt} width="128" height="128" /> : null}</div>
        ))}
      </div>
    </section>
  )
}
