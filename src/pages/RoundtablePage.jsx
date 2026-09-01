import { useMemo, useState } from 'react'
import './RoundtablePage.css'
import { salons } from '../data/salonData'

const filters = ['全部 31', '内容与流量', '私域与销售', 'AI 应用', '技术交付', '医疗健康', '实体与本地', '财税金融', '专业服务', '项目探索']

function MemberCard({ member, selected, onClick }) {
  return <button className={`member-card ${selected ? 'selected' : ''}`} onClick={onClick} type="button">
    <span className={`member-avatar avatar-${member.tone}`}>{member.avatar}</span>
    <span className="member-card-head"><span><strong>{member.name}</strong><small>星球 #{member.id}</small></span>{member.role && <em>{member.role}</em>}</span>
    <span className="member-intro">{member.intro}</span>
    <span className="member-tags">{member.tags.map((tag) => <i key={tag}>{tag}</i>)}</span>
    <span className="member-card-foot"><small>{member.proof ? '有代表作' : '成员页资料'}</small><b>{member.proof || 'Token 暂无'}</b></span>
  </button>
}

export default function RoundtablePage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [selectedSalon, setSelectedSalon] = useState(salons[0])
  const members = selectedSalon.members || []
  const [selected, setSelected] = useState(members[0])
  const visibleMembers = useMemo(() => members.filter((member) => {
    const matchesQuery = !query || `${member.name} ${member.id} ${member.intro} ${member.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const category = activeFilter === filters[0] || member.tags.some((tag) => activeFilter.includes(tag.split('与')[0]))
    return matchesQuery && category
  }), [activeFilter, members, query])

  return <article className="roundtable-page">
    <header className="roundtable-header">
      <div className="roundtable-brand"><span>SC</span><div><strong>生财项目沙龙</strong><small>全部活动与项目连接地图</small></div></div>
      <div className="roundtable-date"><b>{selectedSalon.dateLabel.split(' ')[0]}</b><strong>{selectedSalon.dateLabel.split(' ')[1]}</strong><span>2026 · SAT</span></div>
    </header>
    <section className="salon-overview" aria-labelledby="salon-overview-title"><div className="salon-overview-heading"><div><p className="roundtable-kicker"><span />SALON INDEX</p><h2 id="salon-overview-title">全部沙龙，<br /><em>先选一场。</em></h2></div><p><b>已同步 {salons.length} 场</b><br />选择沙龙后查看对应的报名情况、成员项目和组队建议。</p></div><div className="salon-list">{salons.map((salon) => <button className={`salon-list-item ${selectedSalon.id === salon.id ? 'active' : ''}`} key={salon.id} onClick={() => { setSelectedSalon(salon); setSelected(salon.members?.[0]) }} type="button"><span><b>{salon.city}</b><small>{salon.date}</small></span><strong>{salon.title}</strong><em>{salon.status}</em><i>→</i></button>)}</div></section>

    <section className="roundtable-hero">
      <div className="roundtable-hero-copy">
        <p className="roundtable-kicker"><span />AI 项目沙龙 · {selectedSalon.city}</p>
        <h1>{selectedSalon.title}</h1>
        <p className="roundtable-lead">这不是一份冷冰冰的通讯录。先看每个人正在做什么，再找到能把资源、能力和项目真正拼起来的人。</p>
        <div className="roundtable-actions"><a href="#members">开始看成员 <span>↓</span></a><a href="#matching">查看组队建议 <span>→</span></a></div>
      </div>
      <aside className="event-brief"><div className="brief-top"><b>EVENT BRIEF</b><span>{selectedSalon.status}</span></div><dl><div><dt>时间</dt><dd><strong>{selectedSalon.date}</strong><small>预计 13:50—18:00</small></dd></div><div><dt>地点</dt><dd><strong>{selectedSalon.location}</strong><small>详细地址活动前约 2 天群内公布</small></dd></div><div><dt>规模</dt><dd><strong>{selectedSalon.capacity}</strong><small>成员页共展示 31 人（含组局官与嘉宾）</small></dd></div><div><dt>费用</dt><dd><strong>{selectedSalon.fee}</strong></dd></div></dl><a href="#members" className="brief-link">查看活动原页 ↗</a></aside>
    </section>

    <section className="members-section" id="members"><div className="members-heading"><div><p className="roundtable-kicker"><span />MEMBER MAP</p><h2>先找业务，<br /><em>再找人。</em></h2></div><p>可按昵称、星球编号、业务关键词检索。点击成员卡片，右侧会显示完整信息和推荐对接对象。</p></div>
      <div className="directory-tools"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索：医疗、私域、软件、星球编号…" /></label><div className="token-switch"><b>今日 Token</b><span>近 30 天</span></div></div>
      <div className="filter-row">{filters.map((filter) => <button className={activeFilter === filter ? 'active' : ''} key={filter} onClick={() => setActiveFilter(filter)} type="button">{filter}</button>)}</div>
      <div className="directory-layout"><div className="member-results"><p className="result-count">当前显示 <b>{query || activeFilter !== filters[0] ? visibleMembers.length : members.length}</b> 位成员</p><div className="member-grid">{visibleMembers.map((member) => <MemberCard key={member.id} member={member} selected={selected.id === member.id} onClick={() => setSelected(member)} />)}</div></div><aside className="member-detail"><p className="detail-label">本局嘉宾</p><div className="detail-identity"><span className={`member-avatar avatar-${selected.tone}`}>{selected.avatar}</span><div><h3>{selected.name}</h3><p>星球编号 · {selected.id}</p></div></div><div className="detail-divider" /><div className="detail-tags">{selected.tags.map((tag) => <i key={tag}>{tag}</i>)}</div><div className="detail-divider" /><h4>他 / 她正在做什么</h4><p className="detail-intro">{selected.intro}</p><button className="token-button" type="button">Token 消耗 <span>今日</span></button><p className="detail-match">推荐对接：{members.find((member) => member.id !== selected.id)?.name} · {selected.tags[0]}</p></aside></div>
    </section>

    <section className="matching-section" id="matching"><div><p className="roundtable-kicker"><span />MATCHING NOTES</p><h2>不要自由社交，<br /><em>按闭环组桌。</em></h2></div><p className="matching-intro">这 5 组不是简单按行业分，而是把“有流量的人、能成交的人、懂行业的人、能交付的人”放到同一张桌上。</p><div className="matching-grid"><div><b>01</b><h3>内容获客 → 私域成交闭环</h3><p>辰风负责内容流量，小莎与 Echo 有私域操盘经验，承龍熟悉创业粉引流，虚拟产品项目可以直接当测试样本。</p></div><div><b>02</b><h3>医疗健康 × AI 产品化</h3><p>医院、医疗软件、科研培训、保险资源、线下养生门店都在场，行业资源和技术落地能形成互补。</p></div><div><b>03</b><h3>AI 工具与交付小组</h3><p>既有软件工程师、工作流实践者，也有明确的 AI 产品与业务落地需求，适合从需求到原型快速组队。</p></div></div></section>
  </article>
}
