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
        <p className="purpose-label">{t.now.eyebrow}</p>
        <h1>{t.now.title}</h1>
        <time dateTime="2026-07-10">{t.now.updated} · 2026.07.10</time>
      </header>
      <blockquote>{t.now.mindset}</blockquote>
      <div className="now-focus-list">
        {sections.filter(([, items]) => items.length).map(([title, items]) => (
          <section key={title}><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>
        ))}
      </div>
    </section>
  )
}
