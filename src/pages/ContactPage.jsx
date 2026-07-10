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
        <p className="purpose-label">{t.contact.eyebrow}</p>
        <h1>{t.contact.title}</h1>
        <p>{t.contact.intro}</p>
        <a className="btn primary contact-primary" href={mailto}>{t.contact.email} ↗</a>
        <span>{t.contact.response}</span>
      </header>
      <section className="collaboration-types">
        {types.map((type) => <article key={type}><h2>{type}</h2></article>)}
      </section>
      <div className="contact-directory">
        {t.contact.cards.slice(1).map((card) => card.href ? (
          <a href={card.href} target="_blank" rel="noreferrer" key={card.value}><span>{card.label}</span><strong>{card.value}</strong></a>
        ) : (
          <div key={card.value}><span>{card.label}</span><strong>{card.value}</strong></div>
        ))}
      </div>
    </section>
  )
}
