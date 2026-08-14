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

建议控制在 8–10 页，每页只承担一个判断：

| 页码 | 页面任务 | 主要内容 | 是否放视频 |
| --- | --- | --- | --- |
| 01 | 定调 | 个人网站为什么值得做 | 否 |
| 02 | 误解 | 炫酷不是动效越多越好 | 否 |
| 03 | 术语 | 滚动叙事、Sticky、视差 | 否 |
| 04 | 结构 | 信息如何从定位推进到行动 | 否 |
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

使用 Guizang Swiss 模板生成单 HTML 网页 PPT，视频作为某个 slide 内的原生 HTML5 视频：

```html
<video controls muted playsinline preload="metadata" poster="./assets/site-03.png">
  <source src="./assets/website-interaction-demo.mp4" type="video/mp4">
</video>
```

必须满足：

- 视频有 `controls`，用户可以暂停、拖动和重新播放。
- 视频有 `poster`，加载前不显示空白黑框。
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
