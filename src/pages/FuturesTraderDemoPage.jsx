import { useMemo, useRef, useState } from 'react'
import { FiActivity, FiArrowUpRight, FiBell, FiCheck, FiChevronDown, FiClock, FiCpu, FiEdit3, FiGrid, FiList, FiMic, FiRefreshCw, FiShield, FiSliders, FiTerminal, FiX } from 'react-icons/fi'
import './FuturesTraderDemoPage.css'

const navItems = [
  { id: 'trading', label: '交易台', icon: FiGrid },
  { id: 'replay', label: '交易复盘', icon: FiClock },
  { id: 'strategy', label: '策略分析', icon: FiActivity },
  { id: 'accounts', label: '账户与风控', icon: FiShield },
]

const positions = [
  { symbol: 'RU 主力', name: '橡胶', side: '多', qty: '240', price: '16,820', pnl: '+12,480', positive: true },
  { symbol: 'AU 主力', name: '黄金', side: '空', qty: '8', price: '1,154.6', pnl: '-2,160', positive: false },
  { symbol: 'SC 主力', name: '原油', side: '多', qty: '36', price: '612.8', pnl: '+4,860', positive: true },
]

const replayRows = [
  { time: '09:37:42', symbol: 'RU 主力', action: '买入 / 做多', qty: '100 手', price: '16,900', result: '+¥ 8,240', positive: true },
  { time: '10:12:06', symbol: 'RU 主力', action: '卖出 / 平多', qty: '40 手', price: '17,020', result: '+¥ 4,800', positive: true },
  { time: '13:45:18', symbol: 'AU 主力', action: '卖出 / 做空', qty: '8 手', price: '1,154.6', result: '-¥ 2,160', positive: false },
]

const orderBook = [
  ['卖五', '17,050', '12'], ['卖四', '17,030', '28'], ['卖三', '17,020', '34'], ['卖二', '17,000', '18'], ['卖一', '16,990', '42'],
  ['买一', '16,980', '36'], ['买二', '16,960', '25'], ['买三', '16,940', '40'], ['买四', '16,920', '18'], ['买五', '16,900', '53'],
]

function OrderBook() {
  return <section className="workspace-panel orderbook-panel"><div className="panel-heading compact"><div><span className="panel-kicker">LEVEL II / RU MAIN</span><h2>五档盘口</h2></div><FiList className="panel-heading-icon" /></div><div className="orderbook-table"><div className="orderbook-head"><span>档位</span><span>价格</span><span>数量</span></div>{orderBook.map(([level, bookPrice, qty]) => <div className={`orderbook-row ${level.startsWith('买') ? 'bid' : 'ask'}`} key={level}><span>{level}</span><strong>{bookPrice}</strong><span>{qty}</span></div>)}</div><div className="book-mid"><span>最新价</span><strong>16,980</strong><small>+1.42%</small></div><div className="book-footer"><span>买卖价差</span><strong>10</strong><span>盘口深度正常</span></div></section>
}

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
  const [voiceState] = useState('音频播报在飞书 App 中完成')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m')
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

  function confirmOrder() {
    if (orderState === '已提交模拟单') {
      notify('这笔模拟委托已经提交，请查看运行状态')
      return
    }
    setOrderState('已提交模拟单')
    setEditPrice(false)
    notify(`模拟委托已提交：买入 100 手，${price} 元/吨`)
  }

  function declineOrder() {
    setOrderState('已取消')
    setEditPrice(false)
    notify('已选择不交易，本次信号不会发送至 CTP')
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
            <div className="command-context"><span className="command-icon"><FiMic /></span><div><strong>飞书资讯通道</strong><span>{voiceState}</span></div></div>
            <button className="voice-button" onClick={() => notify('请在飞书 App 中收听晨报；电脑端只负责交易与复盘')}><FiMic />查看飞书连接</button>
          </section>

          <section className="market-strip">
            <div className="market-lead"><span className="instrument-dot" /><div><strong>橡胶 RU 主力</strong><small>SHFE · 1 分钟</small></div><span className="market-change">+1.42%</span></div>
            <div><small>最新价</small><strong>16,980</strong></div><div><small>涨跌</small><strong className="up">+238</strong></div><div><small>成交量</small><strong>128.4K</strong></div><div><small>持仓量</small><strong>312.8K</strong></div>
            <button className="refresh-button" aria-label="刷新行情" onClick={() => { setMarketVersion((current) => current + 1); notify(`行情已刷新 · 第 ${marketVersion + 1} 次`) }}><FiRefreshCw /></button>
          </section>

          <div className="trading-grid">
            <section className="workspace-panel chart-panel"><div className="panel-heading"><div><span className="panel-kicker">MARKET / RU MAIN · SYNC {marketVersion}</span><h2>橡胶主力 <small>分时盘口</small></h2></div><div className="timeframes">{['分时', '1m', '5m', '15m', '日线'].map((timeframe) => <button className={selectedTimeframe === timeframe ? 'selected' : ''} key={timeframe} onClick={() => { setSelectedTimeframe(timeframe); notify(`行情周期已切换为 ${timeframe}`) }}>{timeframe}</button>)}</div></div><MiniChart /><div className="chart-footer"><span><i className="legend-line lime" />价格走势</span><span><i className="legend-line muted" />20 日均线</span><span><FiActivity /> 数据延迟 0.3s</span></div></section>

            <OrderBook />

            <section className={`order-panel ${summary.tone}`}><div className="order-panel-top"><span className="signal-label"><FiCpu />策略信号 · 是否交易</span><span className="signal-time">09:37:42</span></div><h2>{summary.title}</h2><p className="signal-copy">盘口突破 16,850，符合您的“趋势跟随 / 回踩入场”规则。请判断是否执行。</p><div className="order-data"><div><small>方向</small><strong className="buy-text"><FiArrowUpRight />买入 / 做多</strong></div><div><small>建议手数</small><strong>100 <em>手</em></strong></div><div><small>推荐价格</small><strong>{price} <em>元/吨</em></strong></div></div><div className="order-price-editor">{editPrice ? <><label htmlFor="futures-price">委托价格</label><div className="price-input-wrap"><input id="futures-price" value={price} onChange={(event) => setPrice(event.target.value)} autoFocus /><span>元/吨</span></div><small className="price-valid"><FiCheck />在涨跌停及最小变动价位内</small></> : <div className="locked-price"><FiShield /><span>{orderState === '已取消' ? '已选择不交易，可等待下一次信号' : '价格已锁定，点击下方改价'}</span></div>}</div><div className="order-footer"><span><FiShield />AI 给建议，人做决定</span><div><button className="cancel-action" onClick={declineOrder}><FiX />不交易</button><button className="secondary-action" onClick={() => { setEditPrice((current) => !current); notify(editPrice ? '价格已锁定，等待确认' : '价格输入已解锁') }}><FiEdit3 />{editPrice ? '锁定价格' : '改价'}</button><button className="primary-action" onClick={confirmOrder}><FiCheck />{orderState === '已提交模拟单' ? '已交易' : '交易确认'}</button></div></div></section>
          </div>

          <section className="lower-grid"><div className="workspace-panel positions-panel"><div className="panel-heading compact"><div><span className="panel-kicker">ACCOUNT / SIM-01</span><h2>当前持仓</h2></div><span className="account-value">权益 <strong>¥ 1,248,620</strong></span></div><div className="position-table"><div className="table-row table-head"><span>合约</span><span>方向</span><span>持仓</span><span>均价</span><span>浮动盈亏</span></div>{positions.map((position) => <div className="table-row" key={position.symbol}><span><strong>{position.symbol}</strong><small>{position.name}</small></span><span className={position.side === '多' ? 'buy-text' : 'sell-text'}>{position.side}</span><span>{position.qty}</span><span>{position.price}</span><span className={position.positive ? 'up' : 'down'}>{position.pnl}</span></div>)}</div></div><div className="workspace-panel activity-panel"><div className="panel-heading compact"><div><span className="panel-kicker">EVENT LOG</span><h2>运行状态</h2></div><span className="running"><StatusDot />实时</span></div><div className="activity-list"><p><b>09:37</b><span><StatusDot />策略信号已生成：RU 主力</span></p><p><b>09:31</b><span><StatusDot color="blue" />行情连接保持稳定</span></p><p><b>09:00</b><span><StatusDot color="amber" />晨报已通过飞书推送</span></p></div></div></section>
        </>}

        {active === 'strategy' && <section className="detail-view"><div className="detail-intro"><span className="panel-kicker">STRATEGY PROFILE / XUNLIAN</span><h2>你的交易方式，正在变成可读的规则。</h2><p>讯联完成历史记录分析后，电脑端把已确认的策略参数变成实时提醒；参数不会自动改写实盘配置。</p><button className="secondary-action" onClick={() => notify('已将止损 150 点加入模拟观察参数')}><FiCheck />加入模拟观察</button></div><div className="metric-row"><div><small>样本交易</small><strong>4,826</strong><span>过去 26 个月</span></div><div><small>胜率</small><strong>68.4%</strong><span className="up">+4.2% vs 上期</span></div><div><small>盈亏比</small><strong>1.82</strong><span>样本内统计</span></div><div><small>最大回撤</small><strong>5.2%</strong><span className="up">风险可控</span></div></div><div className="strategy-columns"><div className="workspace-panel insight-panel"><span className="insight-number">01</span><h3>当前最稳定的动作</h3><p>橡胶在 1 分钟级别突破后回踩入场，是过去两年胜率最高的条件组合。</p><div className="insight-bar"><span style={{ width: '74%' }} /></div><small>信号吻合度 <strong>74%</strong></small></div><div className="workspace-panel insight-panel"><span className="insight-number">02</span><h3>下一步建议观察</h3><p>把止损从 200 点缩小至 150 点，仅作为回测建议；先进入模拟盘观察期。</p><button className="secondary-action" onClick={() => notify('已打开模拟观察参数：止损 150 点')}><FiSliders />查看观察参数</button></div></div></section>}

        {active === 'replay' && <section className="detail-view replay-view"><div className="detail-intro"><span className="panel-kicker">REPLAY / 2026.08.13</span><h2>收盘后，把每一次交易重新走一遍。</h2><p>电脑 App 负责复盘交易策略：逐笔查看入场依据、盘口变化、执行价格和最终盈亏。</p><div className="replay-controls"><button className="secondary-action" onClick={() => notify('日期已切换：2026 年 8 月 13 日')}><FiClock />2026.08.13</button><button className="primary-action" onClick={() => notify('正在播放今日交易回放')}><FiActivity />播放交易回放</button></div></div><div className="replay-summary"><div><small>今日交易</small><strong>23</strong><span>笔</span></div><div><small>胜率</small><strong>65.2%</strong><span className="up">+3.1%</span></div><div><small>净盈亏</small><strong className="up">+¥ 10,880</strong><span>含手续费</span></div><div><small>最大回撤</small><strong>1.8%</strong><span>日内</span></div></div><section className="workspace-panel replay-table-panel"><div className="panel-heading compact"><div><span className="panel-kicker">EXECUTION LOG</span><h2>逐笔交易</h2></div><button className="secondary-action" onClick={() => notify('已导出今日复盘 CSV')}><FiList />导出 CSV</button></div><div className="replay-table"><div className="replay-row replay-head"><span>时间</span><span>合约</span><span>动作</span><span>数量</span><span>价格</span><span>结果</span></div>{replayRows.map((row) => <button className="replay-row" key={row.time} onClick={() => notify(`${row.time} · ${row.symbol}：已打开交易前后盘口对比`)}><span>{row.time}</span><strong>{row.symbol}</strong><span className={row.action.startsWith('买') ? 'buy-text' : 'sell-text'}>{row.action}</span><span>{row.qty}</span><span>{row.price}</span><span className={row.positive ? 'up' : 'down'}>{row.result}</span></button>)}</div></section></section>}

        {active === 'accounts' && <section className="detail-view accounts-view"><div className="detail-intro"><span className="panel-kicker">ACCOUNTS / RISK CONTROL</span><h2>下单之前，先把风险看清楚。</h2><p>每笔委托经过账户资金、仓位、价格偏离和单日亏损限制检查；多账户拆单只在期货公司权限允许时执行。</p></div><div className="account-cards"><div className="workspace-panel"><span className="panel-kicker">SIM-01</span><h3>模拟账户 A</h3><strong>¥ 1,248,620</strong><p>可用资金 <b>¥ 742,300</b></p><span className="account-online"><StatusDot />CTP 已连接</span></div><div className="workspace-panel"><span className="panel-kicker">RISK LIMIT</span><h3>今日风控</h3><strong className="up">正常</strong><p>单日亏损限额 <b>¥ 30,000</b></p><button className="secondary-action" onClick={() => notify('风控配置已锁定，修改需要管理员确认')}><FiShield />查看风控规则</button></div></div></section>}
      </main>
    </div>
  )
}

export default FuturesTraderDemoPage
