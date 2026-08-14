# Remotion 动态演示

这是“个人网站如何做得炫酷”的动态演示版本。它用 React 描述页面，用 Remotion 的时间轴控制每一页的进入、进度条和视觉变化，再渲染成 MP4。

## 预览

```bash
npm run remotion:studio
```

## 渲染

```bash
npm run remotion:render
```

输出：`docs/personal-site-coolness-deck/final/coolness-deck.mp4`

网站交互案例演示：

```bash
npx remotion render docs/personal-site-coolness-deck/remotion/entry.jsx WebsiteInteractionDemo docs/personal-site-coolness-deck/final/website-interaction-demo.mp4 --codec=h264 --concurrency=1
```

这个版本使用当前网站真实滚动位置的画面，演示滚动叙事、Sticky 场景、项目 Orbit、文章叠卡和 CTA 展开。

## 生成内嵌视频的 PPTX

```bash
npm run ppt:build
```

输出：`docs/personal-site-coolness-deck/final/personal-site-coolness-with-remotion.pptx`

第 10 页内嵌 `coolness-deck.mp4`，PowerPoint 演示时可以直接点击播放。
