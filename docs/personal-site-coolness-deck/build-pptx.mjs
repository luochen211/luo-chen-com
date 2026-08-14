import pptxgen from 'pptxgenjs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, 'final', 'personal-site-coolness-with-remotion.pptx')
const video = path.join(here, 'final', 'coolness-deck.mp4')
const cover = path.join(here, 'final', 'coolness-deck-frame-330.png')
const coverData = `data:image/png;base64,${fs.readFileSync(cover).toString('base64')}`

const W = 13.333; const H = 7.5
const C = { bg: '070809', ink: 'F4F1E9', muted: 'A8A69B', orange: 'DF7138', blue: '2B8CA5', line: '394047' }
const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'Luochen'
pptx.subject = '个人网站如何做得炫酷'
pptx.title = '个人网站，怎么做得炫酷？'
pptx.company = 'Luochen'
pptx.lang = 'zh-CN'
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'zh-CN' }
pptx.defineSlideMaster({ title: 'DARK', background: { color: C.bg }, objects: [] })

function text(slide, value, x, y, w, h, opts = {}) {
  slide.addText(value, { x, y, w, h, margin: 0, fontFace: opts.fontFace || 'Aptos', fontSize: opts.fontSize || 18, color: opts.color || C.ink, bold: opts.bold || false, breakLine: false, fit: 'shrink', valign: opts.valign || 'mid', align: opts.align || 'left', charSpacing: opts.charSpacing || 0, italic: opts.italic || false })
}
function base(slide, index, kicker) {
  text(slide, kicker, .62, .42, 4.7, .2, { fontSize: 9, color: C.orange, bold: true, charSpacing: 2.2 })
  text(slide, `${String(index).padStart(2, '0')} / 11`, 11.8, .42, .9, .2, { fontSize: 9, color: C.muted, align: 'right', charSpacing: 1.4 })
  slide.addShape(pptx.ShapeType.line, { x: .62, y: 7.08, w: 12.1, h: 0, line: { color: C.line, width: 1 } })
  text(slide, 'LUOCHEN / PERSONAL SITE / MOTION STUDY', .62, 7.16, 4.5, .15, { fontSize: 7, color: C.muted, charSpacing: 1.4 })
}
function title(slide, value, sub) {
  text(slide, value, .62, 1.35, 6.35, 1.25, { fontSize: 34, bold: true, valign: 'top' })
  if (sub) text(slide, sub, .62, 2.85, 5.7, .75, { fontSize: 16, color: C.muted, valign: 'top' })
}
function circle(slide, x, y, d, color, transparency = 0) { slide.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color, transparency }, line: { color, transparency: 100 } }) }
function card(slide, x, y, w, h, label, accent = C.blue) { slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: .05, fill: { color: '101417' }, line: { color: C.line, width: 1 } }); text(slide, label, x + .18, y + .18, w - .36, .28, { fontSize: 12, color: accent, bold: true, charSpacing: 1.2 }) }

const slides = [
  ['PERSONAL SITE / 01', '个人网站，怎么做得炫酷？', '不是堆特效，而是设计信息如何被看见。'],
  ['WHY OWN A SITE / 02', '为什么还要做个人网站？', '把简历、作品、判断和联系方式，放进一个自己能控制的公开资产。'],
  ['REFRAME / 03', '炫酷，不是动得多', '视觉效果服务于注意力和理解。'],
  ['SCROLLTELLING / 04', '先让滚动变成叙事', '把滚动位置，变成信息推进的时间轴。'],
  ['SPACE / 05', '用空间制造“正在发生”', '固定、进入、覆盖：让网页从平面变成一个空间。'],
  ['RHYTHM / 06', '动效要有节奏，不要有噪音', '出现、停留、转场、回收。'],
  ['LETTERING / 07', '艺术字：先描述视觉，再反推提示词', '字体结构 + 材质 + 光线 + 构图 + 禁止项。'],
  ['DEPLOYMENT / 08', '从本地到线上：Cloudflare Pages', 'Git push → build → Pages → custom domain。国内访问还要单独核验。'],
  ['CASE STUDY / 09', '这个网站的滚动编排', 'Hero → Proof → Orbit → Stack → CTA。'],
]

for (let i = 0; i < slides.length; i += 1) {
  const slide = pptx.addSlide('DARK'); const [kicker, heading, sub] = slides[i]; base(slide, i + 1, kicker); title(slide, heading, sub)
  if (i === 0) { circle(slide, 9.0, 1.5, 3.5, C.blue, 35); circle(slide, 9.55, 2.05, 2.4, C.orange, 15); slide.addShape(pptx.ShapeType.arc, { x: 8.6, y: 1.08, w: 4.3, h: 4.3, line: { color: C.ink, width: 1, transparency: 25 }, adjustPoint: .2 }) }
  if (i === 1) ['简历', '作品', '判断', '联系'].forEach((v, n) => card(slide, 7.3 + n * .3, 1.8 + n * .62, 3.7, 1.05, `0${n + 1}  ${v}`, n === 2 ? C.orange : C.blue))
  if (i === 2) { text(slide, '注意力', 8.1, 1.8, 3, .45, { fontSize: 26 }); text(slide, '理解', 8.1, 2.65, 3, .45, { fontSize: 26, color: C.orange }); text(slide, '记忆', 8.1, 3.5, 3, .45, { fontSize: 26 }); slide.addShape(pptx.ShapeType.line, { x: 7.65, y: 1.85, w: 0, h: 2.45, line: { color: C.orange, width: 2 } }) }
  if (i === 3) ['定位', '证据', '作品', '行动'].forEach((v, n) => { circle(slide, 8, 1.6 + n * .83, .18, n === 2 ? C.orange : C.blue); text(slide, v, 8.45, 1.48 + n * .83, 2, .4, { fontSize: 22 }); if (n < 3) slide.addShape(pptx.ShapeType.line, { x: 8.09, y: 1.78 + n * .83, w: 0, h: .65, line: { color: C.orange, width: 1.5 } }) })
  if (i === 4) ['STICKY', 'LAYERS', 'DEPTH'].forEach((v, n) => card(slide, 7.1 + n * .45, 2 + n * .45, 3.8, 2.2, v, n === 1 ? C.orange : C.blue))
  if (i === 5) ['REVEAL', 'HOLD', 'TRANSITION', 'PAYOFF'].forEach((v, n) => { text(slide, v, 7.05, 1.55 + n * .7, 1.5, .3, { fontSize: 10, color: C.orange, bold: true, charSpacing: 1.2 }); slide.addShape(pptx.ShapeType.line, { x: 8.6, y: 1.72 + n * .7, w: 3.2 - n * .45, h: 0, line: { color: n === 3 ? C.orange : C.blue, width: 2 } }) })
  if (i === 6) { text(slide, 'LAYER', 7.05, 1.8, 4.8, .85, { fontSize: 44, bold: true, color: C.orange }); text(slide, '结构 / 材质 / 光线\n构图 / 禁止项', 7.1, 3.05, 3.9, 1.25, { fontSize: 17, color: C.muted, valign: 'top' }) }
  if (i === 7) ['GIT PUSH', 'BUILD', 'PAGES', 'DOMAIN'].forEach((v, n) => { card(slide, 6.85 + n * 1.38, 2.2, 1.1, .72, v, n === 3 ? C.orange : C.blue); if (n < 3) text(slide, '→', 8.02 + n * 1.38, 2.3, .2, .3, { fontSize: 18, color: C.orange }) }); text(slide, '国内访问 = 部署成功 + 域名 / DNS / 缓存 / 网络条件核验', 6.85, 3.55, 5.2, .7, { fontSize: 15, color: C.muted, valign: 'top' })
  if (i === 8) ['Hero', 'Proof', 'Orbit', 'Stack', 'CTA'].forEach((v, n) => card(slide, 6.75 + n * 1.05, 2.2 + (n % 2) * .35, .9, 2.0 - (n % 2) * .2, v, n === 2 ? C.orange : C.blue))
  slide.addNotes('来源：当前落尘网站源码；动态演示由 Remotion 生成并在第 10 页嵌入。')
}

const demo = pptx.addSlide('DARK'); base(demo, 10, 'REMOTION / 10'); title(demo, '把设计方法变成动态演示', '这一页不是截图，而是 PPT 内嵌的 Remotion 视频。演示时点击播放。'); demo.addShape(pptx.ShapeType.roundRect, { x: 6.2, y: 1.1, w: 6.45, h: 5.25, rectRadius: .05, fill: { color: '101417' }, line: { color: C.line, width: 1 } }); demo.addMedia({ type: 'video', path: video, cover: coverData, x: 6.35, y: 1.25, w: 6.15, h: 4.95 }); text(demo, 'React → 时间轴 → MP4', 6.35, 6.35, 4.2, .3, { fontSize: 15, color: C.orange, bold: true }); demo.addNotes('内嵌视频源：coolness-deck.mp4，由 docs/personal-site-coolness-deck/remotion/entry.jsx 渲染。')

const end = pptx.addSlide('DARK'); base(end, 11, 'CLOSING / 11'); title(end, '最好的炫酷，是让人愿意继续往下看', 'Design the next scroll, not just the first screen.'); circle(end, 9.2, 2, 2.8, C.orange, 55); end.addShape(pptx.ShapeType.arc, { x: 8.4, y: 1.2, w: 4.5, h: 4.5, line: { color: C.ink, width: 1, transparency: 25 }, adjustPoint: .2 }); end.addNotes('结论：个人网站的炫酷来自内容、空间、动效与留白的统一。')

await pptx.writeFile({ fileName: out })
console.log(out)
