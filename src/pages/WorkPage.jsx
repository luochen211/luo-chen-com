import { projects } from '../data/siteData'

export default function WorkPage({ t }) {
  const work = t.projects.list || projects
  return (
    <section className="focused-page archive-page work-archive">
      <header className="route-hero">
        <p className="purpose-label">{t.work.eyebrow}</p>
        <h1>{t.work.title}</h1>
        <p>{t.work.intro}</p>
      </header>
      <div className="project-archive-grid">
        {work.map((project) => (
          <article className="archive-project" key={project.name}>
            <header>
              <time>{project.period}</time>
              <p>{project.role}</p>
              <h2>{project.name}</h2>
            </header>
            <ul className="project-tech">{project.tech.map((item) => <li key={item}>{item}</li>)}</ul>
            <ul className="project-points">{project.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <details>
              <summary>{t.work.details}</summary>
              <ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </details>
          </article>
        ))}
      </div>
    </section>
  )
}
