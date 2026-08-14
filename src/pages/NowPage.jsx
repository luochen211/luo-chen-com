export default function NowPage({ t, locale = 'zh' }) {
  const isEnglish = locale === 'en'
  const sections = [
    [t.now.direction, t.now.learningItems.slice(0, 1)],
    [t.now.projects, t.now.building],
    [t.now.learning, t.now.learningItems.slice(1)],
    [t.now.routine, t.now.routineItems],
  ]
  return (
    <section className="focused-page now-redesign">
      <header className="route-hero">
        <div>
          <p className="route-overline">{t.now.eyebrow}</p>
          <time dateTime={t.now.updatedAt}>{t.now.updated} · {t.now.updatedDate}</time>
        </div>
        <h1>{t.now.title}</h1>
      </header>
      <blockquote><span>{t.now.mindset}</span></blockquote>
      <section className="now-photo-chapter" aria-labelledby="now-photo-title">
        <header className="chapter-heading editorial-heading">
          <p>{t.now.eyebrow}</p>
          <h2 id="now-photo-title">{t.now.title}</h2>
        </header>
        <div className="now-photo-gallery">
          <figure>
            <img src="/media/about-training.jpg" alt={t.hero.avatarAlt} width="809" height="603" />
            <figcaption><small>PERSONAL PRACTICE</small><span>{isEnglish ? 'Keep training so the body and execution stay steady.' : '持续训练，让身体和执行保持稳定。'}</span></figcaption>
          </figure>
          <figure>
            <img src="/media/about-workshop.jpg" alt={isEnglish ? 'Workshop participants listening to a presentation' : '工作坊现场，参与者正在听分享'} width="1368" height="1824" />
            <figcaption><small>REAL DELIVERY</small><span>{isEnglish ? 'Bring what I understand into a real room.' : '把理解过的东西带到真实现场。'}</span></figcaption>
          </figure>
        </div>
      </section>
      <div className="now-focus-list">
        {sections.filter(([, items]) => items.length).map(([title, items], index) => (
          <section key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>
        ))}
      </div>
    </section>
  )
}
