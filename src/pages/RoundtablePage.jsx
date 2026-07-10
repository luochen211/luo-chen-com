import { useEffect, useState } from 'react'
import { expertOptions } from '../data/siteData'

function ResultList({ title, items = [] }) {
  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default function RoundtablePage({ t }) {
  const [topic, setTopic] = useState(t.lab.examples[0])
  const [isTopicEdited, setIsTopicEdited] = useState(false)
  const [selected, setSelected] = useState(['munger', 'kahneman', 'dalio'])
  const [showAllExperts, setShowAllExperts] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectedExperts = expertOptions.filter((expert) => selected.includes(expert.id))
  const visibleExperts = t.lab.experts.slice(0, showAllExperts ? t.lab.experts.length : 3)

  useEffect(() => {
    if (!isTopicEdited) setTopic(t.lab.examples[0])
  }, [isTopicEdited, t.lab.examples])

  function toggleExpert(id) {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id)
      }
      return [...current, id]
    })
  }

  async function runRoundtable(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!topic.trim()) {
      setError(t.lab.empty)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/roundtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, experts: selectedExperts }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || t.lab.error)
        return
      }
      setResult(payload)
    } catch {
      setError(t.lab.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="roundtable-page">
      <div className="roundtable-hero reveal">
        <p className="eyebrow">{t.lab.eyebrow}</p>
        <h1>{t.lab.title}</h1>
        <p>{t.lab.intro}</p>
      </div>

      <form className="roundtable-workspace reveal" onSubmit={runRoundtable}>
        <div className="roundtable-input">
          <div className="lab-step"><span>1</span><strong>{t.lab.stepOne}</strong></div>
          <label htmlFor="topic">{t.lab.topic}</label>
          <textarea id="topic" value={topic} onChange={(event) => {
            setTopic(event.target.value)
            setIsTopicEdited(true)
          }} rows="7" placeholder={t.lab.placeholder} />
          <div className="example-row">
            {t.lab.examples.map((example) => (
              <button key={example} type="button" onClick={() => {
                setTopic(example)
                setIsTopicEdited(true)
              }}>{example}</button>
            ))}
          </div>
        </div>

        <div className="expert-picker">
          <div className="lab-step"><span>2</span><strong>{t.lab.stepTwo}</strong></div>
          <div className="picker-head">
            <span>{t.lab.choose}</span>
            <strong>{selected.length} {t.lab.expertUnit}</strong>
          </div>
          <div className="expert-grid">
            {visibleExperts.map((expert) => {
              const active = selected.includes(expert.id)
              return (
                <button className={`expert-tile ${active ? 'active' : ''}`} key={expert.id} type="button"
                  onClick={() => toggleExpert(expert.id)} aria-pressed={active}>
                  <span>{expert.name}</span><strong>{expert.title}</strong><small>{expert.stance}</small>
                </button>
              )
            })}
          </div>
          {!showAllExperts && t.lab.experts.length > 3 ? (
            <button className="expert-expand" type="button" onClick={() => setShowAllExperts(true)}>{t.lab.expand}</button>
          ) : null}
          <div className="lab-step lab-step-submit"><span>3</span><strong>{t.lab.stepThree}</strong></div>
          <button className="btn primary roundtable-submit" type="submit" disabled={isLoading}>
            {isLoading ? t.lab.loading : t.lab.submit}
          </button>
          {error ? <p className="roundtable-error">{error}</p> : null}
        </div>
      </form>

      {isLoading ? <div className="roundtable-loading reveal"><span /><p>{t.lab.loadingDetail}</p></div> : null}
      {result ? (
        <div className="roundtable-result reveal">
          <div className="section-head"><p>{t.lab.discussion}</p><h2>{result.topic}</h2></div>
          <div className="turn-list">
            {result.turns?.map((turn, index) => (
              <article className="turn-item" key={`${turn.expert}-${index}`}>
                <div><span>{turn.expert}</span><strong>{turn.angle}</strong></div><p>{turn.argument}</p>
              </article>
            ))}
          </div>
          <div className="judge-panel">
            <p>{t.lab.summary}</p><h3>{result.judge?.verdict}</h3>
            <div className="judge-grid">
              <ResultList title={t.lab.insights} items={result.judge?.insights} />
              <ResultList title={t.lab.conflicts} items={result.judge?.conflicts} />
              <ResultList title={t.lab.blindSpots} items={result.judge?.blindSpots} />
              <ResultList title={t.lab.actions} items={result.judge?.actions} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
