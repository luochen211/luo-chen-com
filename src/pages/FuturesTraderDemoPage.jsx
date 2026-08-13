import { useMemo, useRef, useState } from 'react'
import { FiActivity, FiArrowDownRight, FiArrowUpRight, FiBell, FiCheck, FiChevronDown, FiClock, FiCpu, FiEdit3, FiFeather, FiGrid, FiHeadphones, FiMic, FiRadio, FiRefreshCw, FiShield, FiSliders, FiTerminal, FiX } from 'react-icons/fi'
import './FuturesTraderDemoPage.css'

const navItems = [
  { id: 'trading', label: '交易台', icon: FiGrid },
  { id: 'strategy', label: '策略分析', icon: FiActivity },
  { id: 'news', label: '资讯中心', icon: FiRadio },
  { id: 'night', label: '夜盘报告', icon: FiClock },
]

const positions = [
  { symbol: 'RU 主力', name: '橡胶', side: '多', qty: '240', price: '16,820', pnl: '+12,480', positive: true },
  { symbol: 'AU 主力', name: '黄金', side: '空', qty: '8', price: '1,154.6', pnl: '-2,160', positive: false },
  { symbol: 'SC 主力', name: '原油', side: '多', qty: '36', price: '612.8', pnl: '+4,860', positive: true },
]

const newsItems = [
  { time: '07:42', tag: '橡胶', title: '泰国南部降雨预期上调，原料价格短线偏强', source: '财讯社', impact: '偏多' },
  { time: '07:18', tag: '宏观', title: '美元指数回落，商品板块获得边际支撑', source: '财通社', impact: '中性' },
  { time: '06:55', tag: '原油', title: 'API 原油库存意外下降，关注夜盘高点突破', source: '财讯社', impact: '偏多' },
]

function MiniChart() {
  const bars = [34, 42, 37, 52, 46, 61, 55, 66, 60, 73, 69, 81, 76, 86, 78, 91, 84, 96, 90, 103, 98, 112, 106, 118]
  return (
    <div className="futures-chart" aria-label="橡胶主力分钟行情示意图">
      <div className="chart-grid" />
      <svg viewBox="0 0 720 220" preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c9ff4a" stopOpacity=".24" />
            <stop offset="100%" stopColor="#c9ff4a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 190 C45 174 65 182 103 157 S160 172 200 136 S255 151 292 119 S350 128 388 91 S444 112 478 70 S535 85 568 57 S631 76 720 24 L720 220 L0 220 Z" fill="url(#areaFill)" />
        <path d="M0 190 C45 174 65 182 103 157 S160 172 200 136 S255 151 292 119 S350 128 388 91 S444 112 478 70 S535 85 568 57 S631 76 720 24" fill="none" stroke="#c9ff4a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d="M0 178 C65 168 94 161 146 151 S232 142 290 129 S402 117 480 99 S604 79 720 64" fill="none" stroke="#8d99a7" strokeDasharray="5 8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="chart-last-price"><span>16,980</span><small>+1.42%</small></div>
      <div className="chart-axis"><span>09:00</span><span>10:00</span><span>11:00</span><span>13:30</span><span>14:30</span></div>
      <div className="volume-bars" aria-hidden="true">{bars.map((height, index) => <i key={index} style={{ height: `${height / 1.7}px` }} />)}</div>
    </div>
  )
}

function StatusDot({ color = 'green' }) { return <span className={`status-dot ${color}`} aria-hidden="true" /> }

function FuturesTraderDemoPage() {
  const [active, setActive] = useState('trading')
  const [editPrice, setEditPrice] = useState(false)
  const [price, setPrice] = useState('16,900')
  const [orderState, setOrderState] = useState('待人工确认')
  const [voiceState, setVoiceState] = useState('点击模拟飞书语音指令')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m')
  const [isPlaying, setIsPlaying] = useState(false)
  const [toast, setToast] = useState('')
  const [marketVersion, setMarketVersion] = useState(1)
  const toastTimerRef = useRef(null)

  const summary = useMemo(() => ({
    title: orderState === '已提交模拟单' ? '模拟委托已提交' : '策略信号 · 橡胶主力',
    tone: orderState === '已提交模拟单' ? 'success' : 'warning',
  }), [orderState])

  function notify(message) {
    setToast(message)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2600)
  }

  function changeSection(id, label) {
    setActive(id)
    notify(`已打开${label}`)
  }

  function togglePlayback(label) {
    setIsPlaying((current) => !current)
    notify(isPlaying ? `已暂停${label}` : `正在播放${label}`)
  }

  function simulateVoice() {
    setVoiceState('已识别：买橡胶 100 手，16,900 元')
    setEditPrice(true)
    setPrice('16,900')
    setOrderState('待人工确认')
    notify('飞书语音已转为待确认交易指令')
  }

  function confirmOrder() {
    if (orderState === '已提交模拟单') {
      notify('这笔模拟委托已经提交，请查看运行状态')
      return
    }
    setOrderState('已提交模拟单')
    setEditPrice(false)
    notify(`模拟委托已提交：买入 100 手，${price} 元/吨`)
  }

  function cancelOrder() {
    setOrderState('已取消')
    setEditPrice(false)
    notify('交易指令已取消，未发送至 CTP')
  }

  return (
    <div className="futures-demo-shell">
      {toast && <div className="futures-toast" role="status"><FiCheck />{toast}</div>}
      <aside className="futures-sidebar">
        <div className="futures-brand"><span className="brand-mark">Δ</span><div><strong>FIELD / 01</strong><small>Futures Desk</small></div></div>
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="futures-nav" aria-label="交易软件导航">
          {navItems.map((item) => <button className={active === item.id ? 'active' : ''} key={item.id} onClick={() => changeSection(item.id, item.label)}>{<item.icon />}{item.label}{item.id === 'news' && <b>3</b>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="connection-status"><StatusDot /><span>CTP 模拟环境</span><strong>在线</strong></div>
          <div className="sidebar-profile"><span className="avatar">L</span><div><strong>本地交易终端</strong><small>Windows · 已保护</small></div><FiChevronDown /></div>
        </div>
      </aside>

      <main className="futures-main">
        <header className="futures-topbar">
          <div><span className="eyebrow">WED · AUG 13, 2026</span><h1>{navItems.find((item) => item.id === active)?.label || '交易台'}</h1></div>
          <div className="topbar-actions"><span className="live-clock"><StatusDot />09:38:24 <small>交易中</small></span><button className="icon-button" aria-label="通知" onClick={() => notify('有 2 条待处理通知：策略信号、晨报已推送')}><FiBell /><i>2</i></button><button className="system-button" onClick={() => notify('Windows 桌面端：CTP 模拟环境已连接')}><FiTerminal />Windows 桌面端</button></div>
        </header>

        {active === 'trading' && <>
          <section className="futures-commandbar">
            <div className="command-context"><span className="command-icon"><FiMic /></span><div><strong>语音指令入口</strong><span>{voiceState}</span></div></div>
            <button className="voice-button" onClick={simulateVoice}><FiMic />模拟飞书语音</button>
          </section>

          <section className="market-strip">
            <div className="market-lead"><span className="instrument-dot" /><div><strong>橡胶 RU 主力</strong><small>SHFE · 1 分钟</small></div><span className="market-change">+1.42%</span></div>
            <div><small>最新价</small><strong>16,980</strong></div><div><small>涨跌</small><strong className="up">+238</strong></div><div><small>成交量</small><strong>128.4K</strong></div><div><small>持仓量</small><strong>312.8K</strong></div>
            <button className="refresh-button" aria-label="刷新行情" onClick={() => { setMarketVersion((current) => current + 1); notify(`行情已刷新 · 第 ${marketVersion + 1} 次`) }}><FiRefreshCw /></button>
          </section>

          <div className="trading-grid">
            <section className="workspace-panel chart-panel"><div className="panel-heading"><div><span className="panel-kicker">MARKET / RU MAIN · SYNC {marketVersion}</span><h2>橡胶主力 <small>分钟行情</small></h2></div><div className="timeframes">{['分时', '1m', '5m', '15m', '日线'].map((timeframe) => <button className={selectedTimeframe === timeframe ? 'selected' : ''} key={timeframe} onClick={() => { setSelectedTimeframe(timeframe); notify(`行情周期已切换为 ${timeframe}`) }}>{timeframe}</button>)}</div></div><MiniChart /><div className="chart-footer"><span><i className="legend-line lime" />价格走势</span><span><i className="legend-line muted" />20 日均线</span><span><FiActivity /> 数据延迟 0.3s</span></div></section>

            <section className={`order-panel ${summary.tone}`}><div className="order-panel-top"><span className="signal-label"><FiCpu />策略信号</span><span className="signal-time">09:37:42</span></div><h2>{summary.title}</h2><p className="signal-copy">突破 16,850 阻力位，符合您的“趋势跟随 / 回踩入场”规则。</p><div className="order-data"><div><small>方向</small><strong className="buy-text"><FiArrowUpRight />买入 / 做多</strong></div><div><small>建议手数</small><strong>100 <em>手</em></strong></div><div><small>推荐价格</small><strong>{price} <em>元/吨</em></strong></div></div><div className="order-price-editor">{editPrice ? <><label htmlFor="futures-price">委托价格</label><div className="price-input-wrap"><input id="futures-price" value={price} onChange={(event) => setPrice(event.target.value)} autoFocus /><span>元/吨</span></div><small className="price-valid"><FiCheck />在涨跌停及最小变动价位内</small></> : <div className="locked-price"><FiShield /><span>{orderState === '已取消' ? '指令已取消，可重新生成' : '价格已锁定，点击下方改价'}</span></div>}</div><div className="order-footer"><span><FiShield />每笔交易需人工确认</span><div><button className="cancel-action" onClick={cancelOrder}><FiX />取消</button><button className="secondary-action" onClick={() => { setEditPrice((current) => !current); notify(editPrice ? '价格已锁定，等待确认' : '价格输入已解锁') }}><FiEdit3 />{editPrice ? '锁定价格' : '改价'}</button><button className="primary-action" onClick={confirmOrder}><FiCheck />{orderState === '已提交模拟单' ? '已提交' : '确认下单'}</button></div></div></section>
          </div>

          <section className="lower-grid"><div className="workspace-panel positions-panel"><div className="panel-heading compact"><div><span className="panel-kicker">ACCOUNT / SIM-01</span><h2>当前持仓</h2></div><span className="account-value">权益 <strong>¥ 1,248,620</strong></span></div><div className="position-table"><div className="table-row table-head"><span>合约</span><span>方向</span><span>持仓</span><span>均价</span><span>浮动盈亏</span></div>{positions.map((position) => <div className="table-row" key={position.symbol}><span><strong>{position.symbol}</strong><small>{position.name}</small></span><span className={position.side === '多' ? 'buy-text' : 'sell-text'}>{position.side}</span><span>{position.qty}</span><span>{position.price}</span><span className={position.positive ? 'up' : 'down'}>{position.pnl}</span></div>)}</div></div><div className="workspace-panel activity-panel"><div className="panel-heading compact"><div><span className="panel-kicker">EVENT LOG</span><h2>运行状态</h2></div><span className="running"><StatusDot />实时</span></div><div className="activity-list"><p><b>09:37</b><span><StatusDot />策略信号已生成：RU 主力</span></p><p><b>09:31</b><span><StatusDot color="blue" />行情连接保持稳定</span></p><p><b>09:00</b><span><StatusDot color="amber" />晨报已通过飞书推送</span></p></div></div></section>
        </>}

        {active === 'strategy' && <section className="detail-view"><div className="detail-intro"><span className="panel-kicker">STRATEGY PROFILE</span><h2>你的交易方式，正在变成可读的规则。</h2><p>讯联完成历史记录分析后，电脑端把已确认的策略参数变成实时提醒；参数不会自动改写实盘配置。</p></div><div className="metric-row"><div><small>样本交易</small><strong>4,826</strong><span>过去 26 个月</span></div><div><small>胜率</small><strong>68.4%</strong><span className="up">+4.2% vs 上期</span></div><div><small>盈亏比</small><strong>1.82</strong><span>样本内统计</span></div><div><small>最大回撤</small><strong>5.2%</strong><span className="up">风险可控</span></div></div><div className="strategy-columns"><div className="workspace-panel insight-panel"><span className="insight-number">01</span><h3>当前最稳定的动作</h3><p>橡胶在 1 分钟级别突破后回踩入场，是过去两年胜率最高的条件组合。</p><div className="insight-bar"><span style={{ width: '74%' }} /></div><small>信号吻合度 <strong>74%</strong></small></div><div className="workspace-panel insight-panel"><span className="insight-number">02</span><h3>下一步建议观察</h3><p>把止损从 200 点缩小至 150 点，仅作为回测建议；先进入模拟盘观察期。</p><button className="secondary-action" onClick={() => togglePlayback('策略优化建议')}><FiHeadphones />{isPlaying ? '暂停建议' : '听取建议'}</button></div></div></section>}

        {active === 'news' && <section className="detail-view news-view"><div className="detail-intro"><span className="panel-kicker">MORNING BRIEF / 07:30—09:00</span><h2>今天，只听与你有关的资讯。</h2><p>资讯由外部授权接口采集，电脑端负责筛选、归档和关联行情；飞书是可选的播报出口。</p><button className="voice-button" onClick={() => togglePlayback('今日晨报')}><FiHeadphones />{isPlaying ? '暂停今日晨报' : '播放今日晨报 · 04:32'}</button></div><div className="news-list">{newsItems.map((item) => <article key={item.time}><time>{item.time}</time><div><span className="news-tag">{item.tag}</span><h3>{item.title}</h3><small>{item.source} · <span className={item.impact === '偏多' ? 'up' : ''}>{item.impact}</span></small></div><button className="news-expand" aria-label={`查看${item.title}详情`} onClick={() => notify(`${item.source} · ${item.time}：已打开资讯详情`)}><FiChevronDown /></button></article>)}</div></section>}

        {active === 'night' && <section className="detail-view night-view"><div className="detail-intro"><span className="panel-kicker">NIGHT SESSION / AUG 12</span><h2>夜盘结束，明天日盘有迹可循。</h2><p>按品种交易日历生成，不把收盘时间写死；报告会把行情、持仓、资讯和历史规则放在同一条复盘链里。</p><button className="primary-action" onClick={() => togglePlayback('夜盘总结')}><FiHeadphones />{isPlaying ? '暂停夜盘总结' : '播放夜盘总结 · 03:18'}</button></div><div className="night-report-grid"><div className="workspace-panel report-highlight"><span className="panel-kicker">RU 主力</span><strong>+2.01%</strong><small>夜盘涨幅</small><div className="report-sparkline"><span /><span /><span /><span /><span /><span /><span /></div><p>成交量较近 5 日夜盘均值 <b>放大 35%</b></p></div><div className="workspace-panel report-list"><p><span>关键变化</span><strong>突破 16,850 阻力位</strong></p><p><span>持仓量</span><strong>+12,400 手</strong></p><p><span>资讯关联</span><strong>2 条重要节点</strong></p><p><span>明日关注</span><strong className="up">回踩 16,900 附近</strong></p></div></div></section>}
      </main>
    </div>
  )
}

export default FuturesTraderDemoPage
