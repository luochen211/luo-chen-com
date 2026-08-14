# 个人网站炫酷交互 PPT：落地实施方案

## 1. 目标定义

这份交付物不是“把 PPT 做成一条视频”，也不是用一段视频代替 PPT。

目标是制作一份网页 PPT：

```text
PPT 是主体
├── 解释个人网站为什么需要交互设计
├── 介绍滚动叙事、Sticky、视差、叠卡等呈现方式
├── 拆解当前个人网站的实际结构
└── 在其中一页内嵌网站交互案例视频
```

内嵌视频的任务，是让观众看到网站中真实存在的交互效果，包括：

- 滚动叙事 Scrollytelling
- Sticky Stage 粘性舞台
- 项目 3D Orbit
- 文章 Card Stack
- CTA Expansion

视频不是在讲 PPT 内容，而是在 PPT 中作为“真实案例证据”播放。

## 2. 内容边界

### PPT 负责解释

PPT 页面回答三个问题：

1. 这个交互方式叫什么？
2. 它解决了什么信息传递问题？
3. 当前网站在哪个位置使用了它？

### 视频负责证明

视频只展示真实网站的交互案例，不再额外塞入大量方法论文字。每个案例用以下结构：

```text
交互名称 → 网站画面 → 用户动作 → 视觉变化 → 信息作用
```

例如：

```text
滚动叙事
用户向下滚动
右侧内容逐段进入
左侧视觉保持节奏
观众从定位走到证据，再走到行动
```

已有的呈现方式清单见：[website-presentation-patterns.md](./website-presentation-patterns.md)。它负责提供术语和选择范围；本文负责规定如何把其中少数方式制作成 PPT 与视频。

## 3. 推荐 PPT 结构

当前版本是 1 张封面 + 8 张内容页，共 9 页；每页只承担一个判断：

| 页码 | 页面任务 | 主要内容 | 是否放视频 |
| --- | --- | --- | --- |
| 01 | 封面 | 个人网站如何做得炫酷 | 否 |
| 02 | 定调 | 个人网站为什么值得做 | 否 |
| 03 | 误解 | 炫酷不是动效越多越好 | 否 |
| 04 | 术语 | 滚动叙事、Sticky、视差 | 否 |
| 05 | 方法 | 艺术字如何通过提示词反推 | 否 |
| 06 | 交付 | Cloudflare Pages 部署与国内访问边界 | 否 |
| 07 | 案例入口 | 当前网站使用了哪些交互 | 可放封面/按钮 |
| 08 | 案例演示 | 播放真实网站交互视频 | 是 |
| 09 | 总结 | 内容骨架 × 空间关系 × 动效反馈 × 留白 | 否 |

当前网页 PPT 使用 Guizang Swiss 风格，并以第三种 `S03 Statement` 左侧大字版式承载核心判断。视频页采用：

```text
左侧：交互名称和一句解释
右侧：内嵌视频播放器
底部：案例范围和播放提示
```

这样可以保持“PPT 讲清楚，视频证明真实效果”的分工。

## 4. 视频制作方案

### 4.1 素材来源

视频优先使用当前网站的真实画面，不使用抽象 UI 代替实际案例。

素材采集流程：

1. 启动当前网站本地开发服务。
2. 使用 Playwright 打开首页。
3. 在关键滚动位置截图，保留真实文字、项目图和页面结构。
4. 将截图作为 Remotion 的输入素材。
5. 用 Remotion 给每个画面加上交互名称、解释文字和时间轴。

关键位置至少包括：

```text
首屏 Hero
Proof / Sticky 场景
Selected Work / 项目 Orbit
Selected Writing / 文章叠卡
Collaboration CTA / 行动展开
```

### 4.2 Remotion 时间轴

每个案例建议 4–6 秒，总片长控制在 20–30 秒：

```text
0.0–0.6s   交互名称进入
0.6–1.2s   网站画面进入
1.2–4.2s   画面保持，突出交互关系
4.2–5.0s   进度推进，切换下一个案例
```

Remotion 的角色是“案例视频生成器”，不是网站运行时：

```text
真实网站：React + CSS + GSAP / ScrollTrigger
案例视频：React + Remotion + 真实网站截图
网页 PPT：HTML + Guizang 模板 + <video>
```

### 4.3 视频文案原则

视频内每一页只保留三类文字：

- 交互名称：例如 `SCROLLTELLING`
- 中文名称：例如“滚动叙事”
- 一句作用说明：例如“把滚动位置变成信息推进的时间轴”

不要在视频里重复整段 PPT 讲稿，也不要把所有技术实现细节堆到画面上。

## 5. 网页 PPT 嵌入方案

使用 Guizang Swiss 模板生成单 HTML 网页 PPT，视频作为第 08 页内的原生 HTML5 视频：

```html
<video controls muted playsinline preload="metadata" poster="./assets/website-interaction-demo-poster.png">
  <source src="./assets/website-interaction-demo.mp4" type="video/mp4">
</video>
```

必须满足：

- 视频有 `controls`，用户可以暂停、拖动和重新播放。
- 视频有 `poster`，加载前先显示真实网站案例画面，不显示空白黑框。
- 视频默认 `muted`，避免翻页时突然播放声音。
- 视频旁边有简短说明，不要求观众先看完整视频才能理解页面。
- 移动端保持 16:9 比例，不让播放器撑破页面。
- 首页或封面提供“交互案例 / 08”入口，避免观众不知道视频在哪一页。

当前实现位置：

- 网页 PPT：`public/slides/decks/personal-site-coolness/index.html`
- 视频素材：`public/slides/decks/personal-site-coolness/assets/website-interaction-demo.mp4`
- Remotion 组合：`WebsiteInteractionDemo`
- Remotion 源码：`docs/personal-site-coolness-deck/remotion/index.jsx`

## 6. 运行与生成命令

### 生成网站交互案例视频

```bash
npx remotion render \
  docs/personal-site-coolness-deck/remotion/entry.jsx \
  WebsiteInteractionDemo \
  docs/personal-site-coolness-deck/final/website-interaction-demo.mp4 \
  --codec=h264 \
  --concurrency=1
```

如果本机没有 Remotion 自带的 Chrome，可以显式指定本机 Chrome：

```bash
--browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### 本地预览网页 PPT

```bash
npm run dev
open http://localhost:5173/slides/decks/personal-site-coolness/?slide=8
```

### 验证网页 PPT

```bash
node /Users/luochen/.codex/skills/guizang-ppt-skill/scripts/validate-swiss-deck.mjs \
  public/slides/decks/personal-site-coolness/index.html
```

## 7. 发布路径

网页 PPT 和视频都属于 `public/` 静态资源，因此发布链路是：

```text
修改网页 PPT / 重新生成 MP4
        ↓
复制视频到 public/slides/decks/personal-site-coolness/assets/
        ↓
git commit + git push
        ↓
GitHub Actions lint + build
        ↓
Cloudflare Pages 部署
        ↓
线上检查 HTML 与 MP4 资源
```

部署成功不等于所有网络环境都可访问。上线后至少检查：

- 网页 PPT URL 是否返回 200。
- 视频 URL 是否返回 `Content-Type: video/mp4`。
- 视频是否支持拖动和分段加载。
- 自定义域名是否命中最新版本，而不是旧缓存。
- 中国大陆访问是否受 DNS、IPv4/IPv6、运营商、地区网络或备案要求影响。

## 8. 验收标准

### 内容验收

- 观众能说出网站为什么使用滚动叙事。
- 观众能区分滚动叙事、Sticky、Orbit 和叠卡。
- 每种交互都绑定了当前网站的真实画面。
- PPT 和视频之间没有重复堆砌。

### 交互验收

- PPT 可以通过键盘、滚轮和触屏翻页。
- 第 8 页存在可见视频播放器。
- 视频可以播放、暂停、拖动和重新播放。
- 封面可以直接跳到“交互案例 / 08”。
- 视频加载失败时，旁边的文字仍能说明案例是什么。

### 工程验收

- Guizang Swiss deck validation 通过。
- `npm test`、`npm run lint`、`npm run build` 通过。
- MP4 为 1920×1080、H.264，片长约 20–30 秒。
- 视频文件被复制到 `public/`，不会依赖本机路径。
- 推送后 CI/CD 到达成功终态。
- 线上 HTML 和 MP4 资源分别完成核验。

## 9. 非目标

本方案暂不要求：

- 把所有 27 种网站呈现方式都塞入 PPT。
- 把网站所有页面完整录制成一条长视频。
- 在 PPT 中复刻网站全部 GSAP 动画逻辑。
- 用视频替代可访问的 HTML 文本。
- 把 Remotion 当作网站线上运行时。

最终的判断标准只有一个：

> PPT 让观众理解交互方式，视频让观众相信这些交互真的存在于网站里。

## 10. 当前网站的真实交互地图

制作案例视频时，不要先凭想象写一个“看起来像网站”的动画，再给它套术语。应当先从当前网站的 DOM、CSS 和 GSAP 触发器中确认交互，再决定视频里展示什么。

当前首页结构在 src/pages/HomePage.jsx，滚动触发逻辑在 src/App.jsx，空间和层叠关系在 src/redesign.css。

| 网站区域 | 用户动作 | 实现方式 | 对应术语 | 视频表达重点 |
| --- | --- | --- | --- | --- |
| Hero 头像区域 | 移入、点击、键盘聚焦 | React state + CSS filter/transform | Focus Reveal / Hover Reveal | 模糊头像变清晰，说明交互也可以是“聚焦” |
| Proof 区域 | 向下滚动 | position: sticky + GSAP ScrollTrigger | Scrollytelling / Sticky Stage | 左侧舞台固定，右侧四个证据场景依次进入 |
| Selected Work | 持续向下滚动 | perspective + transform-style: preserve-3d + GSAP rotateY | 3D Orbit / Spatial Navigation | 三张项目卡沿 Y 轴旋转，计数器从 01 到 03 |
| Selected Writing | 向下滚动 | 每张卡 position: sticky，不同 top 值 | Card Stack / Layered Reveal | 下一张文章卡覆盖上一张，卡片同时放大和变亮 |
| Collaboration CTA | 向下滚动 | GSAP clipPath + sticky surface | CTA Expansion / Reveal | 联系区域从小范围圆形扩张成完整行动入口 |
| Hero Marquee | 页面打开后自动运行 | CSS @keyframes | Marquee / Ambient Motion | 作为背景节奏，不承担主要信息 |

### 10.1 Hero：不是滚动案例，而是交互式显影

Hero 的核心不是 scroll，而是“用户把注意力放到头像上，头像才显影”。当前实现用 React state 保存清晰状态，用 CSS 负责模糊、亮度和缩放：

~~~jsx
const [portraitRevealed, setPortraitRevealed] = useState(false)

<button
  aria-pressed={portraitRevealed}
  className={`hero-portrait-background${portraitRevealed ? ' is-revealed' : ''}`}
  onClick={() => setPortraitRevealed((current) => !current)}
>
  <img src="/头像111.jpg" alt={t.hero.avatarAlt} />
</button>
~~~

~~~css
.hero-portrait-background img {
  filter: blur(13px) saturate(0.76) brightness(0.68);
  transform: scale(1.035);
  transition: filter 0.72s ease, transform 0.9s ease;
}

.hero-portrait-background:hover img,
.hero-portrait-background.is-revealed img {
  filter: blur(0) saturate(1.03) brightness(0.94);
  transform: scale(1);
}
~~~

视频里不要把这个效果标成 Scrollytelling。正确的讲法是 Hover / Focus Reveal：通过注意力聚焦改变信息清晰度。

### 10.2 Proof：滚动叙事与 Sticky Stage

Proof 区域由两列组成：

~~~text
左列：proof-scene-stage，固定在视口
右列：proof-scene-list，四个可滚动场景
~~~

关键 CSS 是：

~~~css
.proof-scene-stage {
  position: sticky;
  top: 0;
  height: 100svh;
}

.proof-scene-list {
  padding-block: 36svh;
}

.proof-scene {
  min-height: 72svh;
  opacity: 0.28;
}
~~~

关键 GSAP 关系是：

~~~js
gsap.fromTo(scene, { opacity: 0.28, y: 32 }, {
  opacity: 1,
  y: 0,
  scrollTrigger: {
    trigger: scene,
    start: 'top 76%',
    end: 'center 54%',
    scrub: true,
  },
})
~~~

这里的炫酷来自三个关系同时成立：

1. 滚动位置决定当前叙事节点。
2. 左侧视觉不离开视口。
3. 当前节点变亮，前后节点降低存在感。

所以案例视频必须同时拍到左侧固定舞台和右侧内容推进，只截一张局部图无法证明 Sticky 的存在。

### 10.3 Selected Work：滚动驱动的 3D Orbit

项目区是一个 360svh 的长滚动段，内部舞台保持一屏高度：

~~~css
.selected-work {
  height: 360svh;
}

.project-orbit-stage {
  position: sticky;
  top: 0;
  height: 100svh;
}

.project-orbit-viewport {
  perspective: 2100px;
}

.project-orbit {
  transform-style: preserve-3d;
}
~~~

GSAP 将滚动进度映射为旋转角度：

~~~js
gsap.to('.project-orbit', {
  rotateY: -240,
  ease: 'none',
  scrollTrigger: {
    trigger: '.selected-work',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  },
})
~~~

视频里要展示三个状态，而不是只展示最终状态：

~~~text
状态 A：第一张项目卡正面
状态 B：第一张离开、第二张进入
状态 C：第三张项目卡成为当前项目
~~~

这三个状态才能让观众理解“滚动距离 → 空间旋转 → 当前项目”的转换关系。

### 10.4 Selected Writing：文章 Card Stack

文章卡片使用浏览器原生 sticky 叠放能力，每张卡的顶部位置由文章序号决定：

~~~css
.writing-stack > a {
  position: sticky;
  top: calc(6.2rem + var(--article-index) * 0.75rem);
  min-height: min(68svh, 44rem);
  margin-bottom: 16svh;
}
~~~

GSAP 负责让卡片从较小、较暗的状态进入当前状态：

~~~js
gsap.fromTo(article, { scale: 0.94, opacity: 0.58 }, {
  scale: 1,
  opacity: 1,
  scrollTrigger: {
    trigger: article,
    start: 'top 92%',
    end: 'top 26%',
    scrub: true,
  },
})
~~~

因此叠卡由三部分共同完成：

- CSS sticky：决定卡片停留在哪里。
- --article-index：决定每张卡的层级节奏。
- GSAP scrub：决定卡片进入时的缩放和透明度。

### 10.5 CTA：从圆形视觉扩张成行动入口

CTA 不是普通的底部按钮。当前实现先让 surface 只显示一个较小的圆形区域，再随着滚动扩大：

~~~js
gsap.to('.cta-expansion-surface', {
  clipPath: 'circle(78% at 50% 50%)',
  ease: 'none',
  scrollTrigger: {
    trigger: '.collaboration-cta',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  },
})
~~~

案例视频应当保留“从小到大”的过程，不能只截 CTA 完成后的画面。视频中的一句话可以写成：

> 当观众完成浏览，视觉范围扩大，下一步行动也变得明确。

## 11. 从网站到视频的完整生产流程

### 第一步：先建立案例表

不要直接打开 Remotion 写动画，先填写一张表：

| 字段 | 示例 |
| --- | --- |
| 案例编号 | 03 |
| 网站区域 | Selected Work |
| 用户动作 | 向下滚动 |
| 视觉状态 A | 第一张项目卡正面 |
| 视觉状态 B | 第二张项目卡进入 |
| 视觉状态 C | 第三张项目卡成为当前项 |
| 交互术语 | 3D Orbit / Scroll-linked Motion |
| 信息作用 | 把项目列表变成空间浏览 |
| 截图文件 | site-03.png |
| 视频时长 | 5 秒 |

这张表是 PPT 文案、截图顺序和 Remotion interactionScenes 数组的共同来源。

### 第二步：启动网站并采集真实画面

终端一启动当前网站：

~~~bash
npm run dev -- --host 127.0.0.1
~~~

终端二打开首页：

~~~text
http://127.0.0.1:5173/
~~~

采集时固定以下条件：

- 浏览器视口：1920 × 1080 或 1440 × 900。
- 语言：固定中文或英文，不要在截图过程中切换。
- 页面状态：从页面顶部开始，等待图片和字体加载完成。
- 动效：采集前等待 GSAP 初始化，避免截到未初始化状态。
- 滚动位置：记录实际 scrollY，不要凭感觉拖动。

当前仓库已有五张真实网站截图：

~~~text
docs/personal-site-coolness-deck/remotion/assets/site-01.png  Hero / Scrollytelling 起点
docs/personal-site-coolness-deck/remotion/assets/site-02.png  Sticky Proof
docs/personal-site-coolness-deck/remotion/assets/site-03.png  Project Orbit
docs/personal-site-coolness-deck/remotion/assets/site-04.png  Writing Stack
docs/personal-site-coolness-deck/remotion/assets/site-05.png  CTA Expansion
~~~

### 第三步：把截图接入 Remotion

docs/personal-site-coolness-deck/remotion/index.jsx 中的 interactionScenes 是视频的内容配置：

~~~jsx
const interactionScenes = [
  {
    image: site01,
    kicker: '01 / SCROLLTELLING',
    title: '滚动叙述',
    copy: '用户向下滚动，信息按“定位 → 证据 → 作品 → 行动”推进。',
  },
]
~~~

每个 scene 由 InteractionScene 统一渲染：

~~~text
左侧：名称、中文解释、信息作用
右侧：真实网站截图
顶部：案例编号
底部：整条视频的进度条
~~~

新增第六个案例时：

1. 增加一张网站截图。
2. 增加一个 interactionScenes 配置项。
3. 更新进度显示的总案例数。
4. 重新渲染 MP4。
5. 复制 MP4 到 public。

### 第四步：渲染并检查视频

~~~bash
npx remotion render \
  docs/personal-site-coolness-deck/remotion/entry.jsx \
  WebsiteInteractionDemo \
  docs/personal-site-coolness-deck/final/website-interaction-demo.mp4 \
  --codec=h264 \
  --concurrency=1
~~~

检查视频技术属性：

~~~bash
ffprobe -v error \
  -show_entries stream=width,height,codec_name \
  -show_entries format=duration \
  -of default=noprint_wrappers=1 \
  docs/personal-site-coolness-deck/final/website-interaction-demo.mp4
~~~

期望结果：

~~~text
width=1920
height=1080
codec_name=h264
duration=25.0 左右
~~~

复制到静态资源目录：

~~~bash
cp docs/personal-site-coolness-deck/final/website-interaction-demo.mp4 \
  public/slides/decks/personal-site-coolness/assets/website-interaction-demo.mp4
~~~

从视频中抽取 poster：

~~~bash
ffmpeg -y -ss 3 \
  -i docs/personal-site-coolness-deck/final/website-interaction-demo.mp4 \
  -frames:v 1 \
  public/slides/decks/personal-site-coolness/assets/website-interaction-demo-poster.png
~~~

### 第五步：嵌入网页 PPT

视频页位于 public/slides/decks/personal-site-coolness/index.html。

~~~html
<video
  controls
  muted
  playsinline
  preload="metadata"
  poster="./assets/website-interaction-demo-poster.png"
  aria-label="网站交互案例演示视频"
>
  <source src="./assets/website-interaction-demo.mp4" type="video/mp4">
</video>
~~~

属性与作用：

| 属性 | 作用 |
| --- | --- |
| controls | 允许暂停、拖动和重新播放 |
| muted | 翻页时不突然播放声音 |
| playsinline | 手机端不强制跳出全屏播放器 |
| preload="metadata" | 先获取时长和尺寸，不抢占大量带宽 |
| poster | 视频加载前先显示有意义的画面 |
| aria-label | 让辅助技术知道视频的内容 |

### 第六步：本地验收网页 PPT

~~~bash
npm run dev
open 'http://localhost:5173/slides/decks/personal-site-coolness/?slide=8'
~~~

按顺序检查：

1. 封面点击“交互案例 / 08”后，确实跳到视频页。
2. 视频页左侧标题为“把网站交互讲清楚”。
3. 视频播放器显示 poster，而不是黑色空框。
4. 点击播放后能看到真实网站截图和五个交互标签。
5. 暂停、拖动、重新播放都正常。
6. 翻到下一页后，视频不会自动带声音播放。
7. 缩窄浏览器窗口后，视频仍保持 16:9，不撑破页面。

## 12. 当前实现与后续增强的边界

### 当前已经落地

- Guizang Swiss 单 HTML 网页 PPT。
- 第 08 页原生 HTML5 视频播放器。
- Remotion WebsiteInteractionDemo 组合。
- 五张来自当前网站的真实交互截图。
- 约 25 秒、1920 × 1080、H.264 案例视频。
- poster、视频资源和网页 PPT 均位于 public 静态目录。
- 封面可通过 ?slide=8 直接跳到视频页。

### 还可以继续增强

- 把截图采集过程整理成独立 Playwright 脚本，减少手工滚动误差。
- 为每个案例加上“用户动作 → 页面状态”的可视化箭头。
- 在视频页增加静音播放按钮和当前案例名称同步显示。
- 增加移动端专用视频比例或备用 poster。
- 录制真实浏览器滚动过程，展示 GSAP 连续运动，而不仅是关键帧截图。
- 为 PPT 增加讲解者备注，标记每页讲 30–60 秒时应该说什么。

这些增强不应改变核心分工：网站负责真实交互，Remotion 负责案例可视化，网页 PPT 负责解释和组织。

## 13. 最终交付检查表

### 内容层

- [ ] 每个案例都有明确术语。
- [ ] 每个术语都说明解决的信息问题。
- [ ] 每个术语都绑定当前网站的真实区域。
- [ ] 视频没有重复整段 PPT 讲稿。

### 画面层

- [ ] 封面是左侧大字的 Guizang Swiss 版式。
- [ ] 案例视频页左文右视频。
- [ ] 五个案例有清晰的编号和进度关系。
- [ ] poster 不是黑帧，也不是与视频无关的旧素材。
- [ ] 桌面和窄屏都没有文字或播放器溢出。

### 工程层

- [ ] validate-swiss-deck.mjs 通过。
- [ ] npm test -- --run 通过。
- [ ] npm run lint 通过。
- [ ] npm run build 通过。
- [ ] ffprobe 确认视频是 1920×1080 H.264。
- [ ] MP4 和 poster 都在 public/slides/decks/personal-site-coolness/assets/。
- [ ] GitHub Actions 到达成功终态。
- [ ] 线上 HTML、MP4、poster 分别返回 200。

### 讲解层

- [ ] 先解释为什么做个人网站。
- [ ] 再解释炫酷不是动效越多越好。
- [ ] 然后讲术语和信息作用。
- [ ] 最后播放真实网站交互视频。
- [ ] 收束到一句话：PPT 解释，视频证明。
