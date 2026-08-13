import { useState } from 'react'
import SocialIcon from '../components/SocialIcon'

export default function AboutPage({ t, locale = 'zh' }) {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0)
  const isEnglish = locale === 'en'
  const subject = encodeURIComponent(isEnglish ? 'Collaboration inquiry' : '合作咨询')
  const body = encodeURIComponent(isEnglish
    ? 'Hi Luochen,\n\nProject context:\nDesired outcome:\nTimeline:\nBudget range:\n'
    : '落尘你好，\n\n项目背景：\n期望结果：\n时间计划：\n预算范围：\n')
  const mailto = `mailto:cuidong111@gmail.com?subject=${subject}&body=${body}`
  const contactTitleSegments = isEnglish ? [t.contact.title] : ['一起解决', '值得解决', '的问题']
  const contactCards = t.contact.cards.slice(1)
  const socialCards = contactCards.filter((card) => card.icon)
  const directoryCards = contactCards.filter((card) => !card.icon)
  const activeTimelineItem = t.about.timeline[activeTimelineIndex]

  return (
    <section className="focused-page about-redesign">
      <header className="route-hero about-hero">
        <div>
          <p className="route-overline">{t.about.eyebrow}</p>
          <span>{t.about.range}</span>
        </div>
        <h1>{t.about.title}</h1>
        <p>{t.about.intro}</p>
      </header>

      <section className="about-timeline-chapter" aria-labelledby="timeline-title">
        <header className="chapter-heading editorial-heading">
          <p>{t.about.timelineEyebrow}</p>
          <h2 id="timeline-title">{t.about.timelineTitle}</h2>
        </header>
        <div className="about-timeline reveal">
          <p className="about-timeline-hint">{t.about.timelineHint}</p>
          <div className="about-timeline-scroll">
            <ol
              className="about-timeline-track"
              data-point-count={t.about.timeline.length}
              style={{ '--point-count': t.about.timeline.length }}
            >
              {t.about.timeline.map((item, index) => {
                const isActive = activeTimelineIndex === index
                return (
                  <li className={isActive ? 'is-active' : ''} key={`${item.year}-${item.title}`}>
                    <button
                      aria-label={`${item.year} · ${item.title}`}
                      aria-pressed={isActive}
                      className="about-timeline-coordinate"
                      onClick={() => setActiveTimelineIndex(index)}
                      onFocus={() => setActiveTimelineIndex(index)}
                      onMouseEnter={() => setActiveTimelineIndex(index)}
                      type="button"
                    >
                      <span className="about-timeline-year">{item.year}</span>
                      <span className="about-timeline-dot" aria-hidden="true" />
                      <span className="about-timeline-coordinate-title">{item.title}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
          <article className="about-timeline-event" key={`${activeTimelineItem.year}-${activeTimelineItem.title}`} aria-live="polite">
            <div className="about-timeline-event-meta">
              <strong>{String(activeTimelineIndex + 1).padStart(2, '0')} / {String(t.about.timeline.length).padStart(2, '0')}</strong>
              <span>{activeTimelineItem.label}</span>
            </div>
            <div>
              <time dateTime={activeTimelineItem.dateTime}>{activeTimelineItem.year}</time>
              <h3>{activeTimelineItem.title}</h3>
              <p>{activeTimelineItem.text}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="principles-title">
        <header>
          <p className="route-overline">{t.about.principlesEyebrow}</p>
          <h2 id="principles-title">{t.about.principlesTitle}</h2>
        </header>
        <ol>
          {t.about.principles.map((item, index) => (
            <li className="reveal" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-contact" id="contact" aria-labelledby="contact-title">
        <header className="about-contact-heading">
          <div>
            <p className="route-overline">{t.contact.eyebrow}</p>
            <h2 id="contact-title">
              {contactTitleSegments.map((segment) => (
                <span className="contact-title-segment" key={segment} style={{ display: 'inline-block' }}>{segment}</span>
              ))}
            </h2>
          </div>
          <p>{t.contact.intro}</p>
        </header>
        <div className="about-contact-lead">
          <div className="contact-action-panel">
            <p>{t.about.contactPrompt}</p>
            <a className="btn primary contact-primary" href={mailto}>{t.contact.email} ↗</a>
            <span>{t.contact.response}</span>
          </div>
          <ol>
            {t.about.contactTypes.map((type, index) => (
              <li key={type}><span>{String(index + 1).padStart(2, '0')}</span><strong>{type}</strong></li>
            ))}
          </ol>
        </div>
        <section className="social-reach" aria-label={t.about.audienceLabel}>
          <div>
            <span>{t.about.audienceEyebrow}</span>
            <h2>{t.about.audienceTitle}</h2>
          </div>
          <p>{t.about.audiencePlatforms}</p>
        </section>
        <div className="social-profile-grid">
          {socialCards.map((card) => (
            <a className="contact-social-link" href={card.href} target="_blank" rel="noreferrer" key={card.value}>
              <span><SocialIcon name={card.icon} />{card.label}</span>
              <strong>{card.value}</strong>
            </a>
          ))}
        </div>
        <div className="contact-directory">
          {directoryCards.map((card) => card.href ? (
            <a href={card.href} target="_blank" rel="noreferrer" key={card.value}>
              <span>{card.label}</span><strong>{card.value}</strong>
            </a>
          ) : (
            <div className="contact-wechat" key={card.value}>
              <span>{card.label}</span><strong>{card.value}</strong>
              {card.qrSrc ? <img src={card.qrSrc} alt={card.qrAlt} width="128" height="128" /> : null}
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
