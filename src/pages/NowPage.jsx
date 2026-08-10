export default function NowPage({ t }) {
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
          <time dateTime="2026-07-10">{t.now.updated} · 2026.07.10</time>
        </div>
        <h1>{t.now.title}</h1>
      </header>
      <blockquote><span>{t.now.mindset}</span></blockquote>
      <div className="now-focus-list">
        {sections.filter(([, items]) => items.length).map(([title, items], index) => (
          <section key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>
        ))}
      </div>
    </section>
  )
}
