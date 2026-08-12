import SocialIcon from '../components/SocialIcon'

export default function AboutPage({ t, locale = 'zh' }) {
  const isEnglish = locale === 'en'
  const subject = encodeURIComponent(isEnglish ? 'Collaboration inquiry' : '合作咨询')
  const body = encodeURIComponent(isEnglish
    ? 'Hi Luochen,\n\nProject context:\nDesired outcome:\nTimeline:\nBudget range:\n'
    : '落尘你好，\n\n项目背景：\n期望结果：\n时间计划：\n预算范围：\n')
  const mailto = `mailto:cuidong111@gmail.com?subject=${subject}&body=${body}`
  const contactCards = t.contact.cards.slice(1)
  const socialCards = contactCards.filter((card) => card.icon)
  const directoryCards = contactCards.filter((card) => !card.icon)

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

      <section className="about-introduction reveal">
        <figure className="about-portrait">
          <img src="/头像111.jpg" alt={t.about.portraitAlt} width="940" height="938" />
        </figure>
        <div>
          <p className="route-overline">{t.about.storyEyebrow}</p>
          <h2>{t.about.storyTitle}</h2>
          <p>{t.about.storyText}</p>
        </div>
      </section>

      <section className="about-timeline-chapter" aria-labelledby="timeline-title">
        <header className="chapter-heading editorial-heading">
          <p>{t.about.timelineEyebrow}</p>
          <h2 id="timeline-title">{t.about.timelineTitle}</h2>
        </header>
        <ol className="about-timeline">
          {t.about.timeline.map((item) => (
            <li className="about-timeline-item reveal" key={`${item.year}-${item.title}`}>
              <time dateTime={item.dateTime}>{item.year}</time>
              <span className="about-timeline-marker" aria-hidden="true" />
              <div>
                <p>{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
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
            <h2 id="contact-title">{t.contact.title}</h2>
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
