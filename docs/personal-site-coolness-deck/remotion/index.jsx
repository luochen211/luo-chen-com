import React from 'react'
import { AbsoluteFill, Composition, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import site01 from './assets/site-01.png'
import site02 from './assets/site-02.png'
import site03 from './assets/site-03.png'
import site04 from './assets/site-04.png'
import site05 from './assets/site-05.png'

const C = { bg: '#070809', paper: '#efe9dd', ink: '#f4f1e9', muted: '#9c9b92', orange: '#df7138', blue: '#2b8ca5', line: 'rgba(244,241,233,.2)' }

const slides = [
  { kicker: 'PERSONAL SITE / 01', title: '个人网站，怎么做得炫酷？', sub: '不是堆特效，而是设计信息如何被看见。', type: 'hero' },
  { kicker: 'WHY OWN A SITE / 02', title: '为什么还要做个人网站？', sub: '把简历、作品、判断和联系方式，放进一个自己能控制的公开资产。', type: 'why' },
  { kicker: 'REFRAME / 03', title: '炫酷，不是动得多', sub: '视觉效果服务于注意力和理解。', type: 'reframe' },
  { kicker: 'SCROLLTELLING / 04', title: '先让滚动变成叙事', sub: '把滚动位置，变成信息推进的时间轴。', type: 'story' },
  { kicker: 'SPACE / 05', title: '用空间制造“正在发生”', sub: '固定、进入、覆盖：让网页从平面变成一个空间。', type: 'space' },
  { kicker: 'RHYTHM / 06', title: '动效要有节奏，不要有噪音', sub: '出现、停留、转场、回收。', type: 'rhythm' },
  { kicker: 'LETTERING / 07', title: '艺术字：先描述视觉，再反推提示词', sub: '字体结构 + 材质 + 光线 + 构图 + 禁止项。', type: 'lettering' },
  { kicker: 'DEPLOYMENT / 08', title: '从本地到线上：Cloudflare Pages', sub: 'Git push → build → Pages → custom domain。国内访问还要单独核验。', type: 'deploy' },
  { kicker: 'CASE STUDY / 09', title: '这个网站的滚动编排', sub: 'Hero → Proof → Orbit → Stack → CTA。', type: 'case' },
  { kicker: 'REMOTION / 10', title: '把设计方法变成动态演示', sub: 'React 负责表达，Remotion 负责逐帧预览与渲染。', type: 'remotion' },
  { kicker: 'CLOSING / 11', title: '最好的炫酷，是让人愿意继续往下看', sub: 'Design the next scroll, not just the first screen.', type: 'closing' },
]

function Progress({ index, frame, duration }) {
  const p = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
  return <><div style={{ position: 'absolute', top: 66, right: 88, color: C.muted, fontSize: 19, letterSpacing: 3 }}>0{index + 1} / 11</div><div style={{ position: 'absolute', left: 88, right: 88, bottom: 66, height: 2, background: C.line }}><div style={{ width: `${((index + p) / slides.length) * 100}%`, height: '100%', background: C.orange }} /></div></>
}

function Visual({ type }) {
  const frame = useCurrentFrame(); const pulse = Math.sin(frame / 16) * 12
  if (type === 'hero' || type === 'closing') return <div style={{ position: 'absolute', right: 120, top: 210, width: 560, height: 560, border: `1px solid ${C.line}`, borderRadius: '50%', transform: `rotate(${frame / 12}deg)` }}><div style={{ position: 'absolute', inset: 65, border: `1px solid ${C.orange}`, borderRadius: '50%' }} /><div style={{ position: 'absolute', width: 190, height: 190, right: 20 + pulse, top: 100, background: C.blue, opacity: .6, filter: 'blur(1px)' }} /></div>
  if (type === 'why') return <div style={{ position: 'absolute', right: 110, top: 245, width: 570, height: 420 }}>{['简历', '作品', '判断', '联系'].map((x, i) => <div key={x} style={{ position: 'absolute', left: i * 62, top: i * 48, width: 370, height: 150, border: `1px solid ${C.line}`, background: '#101417', padding: 26, color: C.ink, fontSize: 26, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}><span style={{ color: C.orange, fontSize: 16 }}>0{i + 1}</span><br />{x}</div>)}</div>
  if (type === 'reframe') return <div style={{ position: 'absolute', right: 120, top: 250, width: 570, display: 'flex', gap: 48, alignItems: 'center' }}><div style={{ fontSize: 70, color: C.muted, opacity: .35, transform: `rotate(${frame / 10}deg)` }}>✳︎</div><div style={{ width: 3, height: 230, background: C.orange }} /><div>{['注意力', '理解', '记忆'].map((x, i) => <div key={x} style={{ fontSize: 42, marginBottom: 25, color: i === 1 ? C.orange : C.ink }}>{x}</div>)}</div></div>
  if (type === 'story') return <div style={{ position: 'absolute', right: 170, top: 210, height: 480, borderLeft: `2px solid ${C.orange}` }}>{['定位', '证据', '作品', '行动'].map((x, i) => <div key={x} style={{ position: 'relative', margin: `${i ? 62 : 0}px 0 0 42px`, fontSize: 34, color: C.ink }}><i style={{ position: 'absolute', left: -54, top: 13, width: 20, height: 20, borderRadius: '50%', background: i === 2 ? C.orange : C.blue }} />{x}</div>)}</div>
  if (type === 'space') return <div style={{ position: 'absolute', right: 125, top: 220, width: 600, height: 420, perspective: 900 }}><div style={{ position: 'absolute', inset: 0, border: `1px solid ${C.orange}`, transform: `rotateY(${frame / 8}deg)` }} />{[0, 1, 2].map(i => <div key={i} style={{ position: 'absolute', left: 90 + i * 48, top: 60 + i * 48, width: 390, height: 210, border: `1px solid ${C.line}`, background: `rgba(43,140,165,${.12 + i * .08})`, transform: `translateZ(${i * 60}px)`, padding: 22, color: C.muted, fontSize: 18 }}>{['STICKY', 'LAYERS', 'DEPTH'][i]}</div>)}</div>
  if (type === 'rhythm') return <div style={{ position: 'absolute', right: 110, top: 300, width: 600 }}>{['REVEAL', 'HOLD', 'TRANSITION', 'PAYOFF'].map((x, i) => <div key={x} style={{ display: 'flex', alignItems: 'center', marginBottom: 34, opacity: .45 + ((frame + i * 22) % 80) / 160 }}><span style={{ width: 110, color: C.orange, fontSize: 15 }}>{x}</span><div style={{ flex: 1, height: 2, background: C.line }}><div style={{ width: `${35 + i * 18}%`, height: 2, background: i === 3 ? C.orange : C.blue }} /></div></div>)}</div>
  if (type === 'lettering') return <div style={{ position: 'absolute', right: 110, top: 250, width: 610 }}><div style={{ fontSize: 82, fontWeight: 800, color: C.orange, letterSpacing: -6, textShadow: '12px 12px 0 rgba(43,140,165,.55)' }}>LAYER</div><div style={{ marginTop: 35, padding: 24, border: `1px solid ${C.line}`, color: C.muted, fontSize: 20, lineHeight: 1.65 }}>结构 / 材质 / 光线<br />构图 / 禁止项</div></div>
  if (type === 'deploy') return <div style={{ position: 'absolute', right: 100, top: 280, width: 630 }}>{['GIT PUSH', 'BUILD', 'PAGES', 'DOMAIN'].map((x, i) => <React.Fragment key={x}><div style={{ display: 'inline-flex', width: 130, height: 70, border: `1px solid ${i === 3 ? C.orange : C.line}`, alignItems: 'center', justifyContent: 'center', color: C.ink, fontSize: 16 }}>{x}</div>{i < 3 && <span style={{ color: C.orange, padding: 12 }}>→</span>}</React.Fragment>)}<div style={{ marginTop: 45, padding: 18, borderLeft: `3px solid ${C.orange}`, color: C.muted, fontSize: 19 }}>国内访问 = 部署成功 + 域名 / DNS / 缓存 / 网络条件核验</div></div>
  if (type === 'case') return <div style={{ position: 'absolute', right: 80, top: 310, width: 700, display: 'flex', gap: 12 }}>{['Hero', 'Proof', 'Orbit', 'Stack', 'CTA'].map((x, i) => <div key={x} style={{ width: 125, height: 180 + (i % 2) * 45, border: `1px solid ${i === 2 ? C.orange : C.line}`, background: '#111519', padding: 16, color: C.ink, fontSize: 20, alignSelf: 'end' }}>{x}<div style={{ height: 2, background: C.blue, marginTop: 35, transform: `scaleX(${.3 + ((frame + i * 20) % 60) / 100})`, transformOrigin: 'left' }} /></div>)}</div>
  if (type === 'remotion') return <div style={{ position: 'absolute', right: 105, top: 250, width: 620, height: 350, border: `1px solid ${C.line}`, background: '#101417', padding: 30 }}><div style={{ color: C.orange, fontSize: 18, letterSpacing: 3 }}>FRAME {String(Math.round(frame)).padStart(3, '0')}</div><div style={{ marginTop: 60, height: 3, background: C.line }}><div style={{ height: 3, width: `${(frame % 120) / 120 * 100}%`, background: C.orange }} /></div><div style={{ marginTop: 68, color: C.ink, fontSize: 36 }}>React → 时间轴 → MP4</div></div>
}

function Slide({ data, index, duration }) {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const enter = spring({ frame, fps, config: { damping: 20, stiffness: 100 } })
  return <AbsoluteFill style={{ background: C.bg, color: C.ink, fontFamily: 'Arial, PingFang SC, sans-serif', padding: '160px 88px' }}><Progress index={index} frame={frame} duration={duration} /><div style={{ position: 'absolute', left: 88, top: 155, width: 650, transform: `translateY(${interpolate(enter, [0, 1], [35, 0])}px)`, opacity: enter }}><div style={{ color: C.orange, fontSize: 18, letterSpacing: 4, marginBottom: 34 }}>{data.kicker}</div><h1 style={{ margin: 0, fontSize: 76, lineHeight: 1.04, letterSpacing: -4, fontWeight: 750 }}>{data.title}</h1><p style={{ marginTop: 38, color: C.muted, fontSize: 28, lineHeight: 1.5, maxWidth: 610 }}>{data.sub}</p></div><Visual type={data.type} /><div style={{ position: 'absolute', left: 88, bottom: 112, color: C.muted, fontSize: 15, letterSpacing: 2 }}>LUOCHEN / PERSONAL SITE / MOTION STUDY</div></AbsoluteFill>
}

function Deck() { const { fps } = useVideoConfig(); const duration = 5 * fps; return <AbsoluteFill>{slides.map((data, index) => <Sequence key={data.kicker} from={index * duration} durationInFrames={duration}><Slide data={data} index={index} duration={duration} /></Sequence>)}</AbsoluteFill> }

export function RemotionRoot() { return <><Composition id="CoolnessDeck" component={Deck} durationInFrames={11 * 5 * 30} fps={30} width={1920} height={1080} /><InteractionComposition /></> }

const interactionScenes = [
  { image: site01, kicker: '01 / SCROLLTELLING', title: '滚动叙述', copy: '用户向下滚动，信息按“定位 → 证据 → 作品 → 行动”推进。' },
  { image: site02, kicker: '02 / STICKY SCENE', title: '粘性场景', copy: '左侧视觉固定在视口，右侧内容继续进入，形成对照。' },
  { image: site03, kicker: '03 / PROJECT ORBIT', title: '项目 3D Orbit', copy: '滚动距离被转译成项目卡片的旋转，作品像在空间里环绕。' },
  { image: site04, kicker: '04 / CARD STACK', title: '文章叠卡', copy: '每张文章卡片停在顶部，下一张继续覆盖，形成阅读节奏。' },
  { image: site05, kicker: '05 / CTA EXPANSION', title: '行动展开', copy: '最后一个区域从一个圆形视觉扩张成完整的联系入口。' },
]

function InteractionScene({ scene, index, duration }) {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig()
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 100 } })
  const imageScale = interpolate(frame, [0, duration], [1.02, 1], { extrapolateRight: 'clamp' })
  return <AbsoluteFill style={{ background: C.bg, color: C.ink, fontFamily: 'Arial, PingFang SC, sans-serif', padding: '112px 88px' }}>
    <div style={{ position: 'absolute', top: 66, left: 88, color: C.orange, fontSize: 18, letterSpacing: 4 }}>{scene.kicker}</div>
    <div style={{ position: 'absolute', top: 66, right: 88, color: C.muted, fontSize: 18, letterSpacing: 3 }}>SITE INTERACTION / {String(index + 1).padStart(2, '0')} / 05</div>
    <div style={{ position: 'absolute', left: 88, top: 255, width: 560, opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [36, 0])}px)` }}>
      <h1 style={{ margin: 0, fontSize: 82, lineHeight: .98, letterSpacing: -5, fontWeight: 750 }}>{scene.title}</h1>
      <p style={{ marginTop: 36, color: C.muted, fontSize: 28, lineHeight: 1.55, maxWidth: 520 }}>{scene.copy}</p>
      <div style={{ marginTop: 56, color: C.blue, fontSize: 18, letterSpacing: 2 }}>SCROLL POSITION → VISUAL STATE</div>
    </div>
    <div style={{ position: 'absolute', left: 730, top: 170, width: 1040, height: 650, overflow: 'hidden', border: `1px solid ${C.line}`, background: '#111417', transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`, opacity: enter }}>
      <Img src={scene.image} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${imageScale})` }} />
      <div style={{ position: 'absolute', left: 24, bottom: 20, color: C.ink, fontSize: 16, letterSpacing: 2 }}>ACTUAL SITE FRAME / {String(index + 1).padStart(2, '0')}</div>
    </div>
    <div style={{ position: 'absolute', left: 88, right: 88, bottom: 66, height: 2, background: C.line }}><div style={{ width: `${((index + (frame / duration)) / interactionScenes.length) * 100}%`, height: '100%', background: C.orange }} /></div>
  </AbsoluteFill>
}

function InteractionDemo() {
  const { fps } = useVideoConfig(); const duration = 5 * fps
  return <AbsoluteFill>{interactionScenes.map((scene, index) => <Sequence key={scene.kicker} from={index * duration} durationInFrames={duration}><InteractionScene scene={scene} index={index} duration={duration} /></Sequence>)}</AbsoluteFill>
}

export function InteractionComposition() { return <Composition id="WebsiteInteractionDemo" component={InteractionDemo} durationInFrames={5 * 5 * 30} fps={30} width={1920} height={1080} /> }
