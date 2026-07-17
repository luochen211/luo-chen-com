const shared = {
  imaging: {
    id: 'imaging', category: 'product', year: '2026', featured: true,
    href: 'https://github.com/luochen211/Imaging-OnlineRetouchingOrder-Mini-App-main',
    tech: ['WeChat Mini Program', 'FastAPI', 'React', 'SQLAlchemy', 'Alibaba Cloud'],
  },
  logistics: {
    id: 'logistics', category: 'product', year: '2026', featured: true,
    href: 'https://github.com/luochen211/best-group-logistics-system',
    tech: ['React 19', 'TypeScript', 'Express', 'Prisma', 'SQLite'],
  },
  gita: {
    id: 'gita', category: 'indie', year: '2026', featured: true,
    href: 'https://github.com/luochen211/bhagavad-gita-game',
    liveHref: 'https://before-the-act-production.up.railway.app',
    tech: ['React', 'TypeScript', 'PostgreSQL', 'Playwright', 'Railway'],
  },
  career: {
    id: 'career', category: 'openSource', year: '2026', featured: true,
    href: 'https://github.com/santifer/career-ops/pulls?q=is%3Apr+author%3Aluochen211',
    tech: ['AI Agent', 'Node.js', 'Playwright', 'Workflow', 'Quality Gates'],
  },
  odyssey: {
    id: 'odyssey', category: 'product', year: '2026', featured: false,
    href: 'https://github.com/luochen211/odyssey-fullstack-assignment',
    tech: ['TypeScript', 'Hono', 'Cloudflare Workers', 'Drizzle', 'OpenAPI'],
  },
  kenya: {
    id: 'kenya', category: 'product', year: '2026', featured: false,
    href: 'https://github.com/luochen211/kenya-realty-os',
    tech: ['Node.js', 'Express', 'SQLite', 'RBAC', 'Railway'],
  },
  acecoach: {
    id: 'acecoach', category: 'ai', year: '2026', featured: false,
    href: 'https://github.com/luochen211/acecoach-ai-tennis',
    tech: ['WeChat Mini Program', 'MediaPipe', 'Python', 'FFmpeg', 'Pose Analysis'],
  },
  dashboard: {
    id: 'dashboard', category: 'frontend', year: '2026', featured: false,
    href: 'https://github.com/luochen211/spec-dashboard',
    tech: ['Vue 3', 'ECharts', 'AMap', 'Data Visualization'],
  },
  paopao: {
    id: 'paopao', category: 'realtime', year: '2026', featured: false,
    href: 'https://github.com/luochen211/paopaoChat',
    tech: ['Flutter', 'Spring Boot', 'WebSocket', 'Agora RTC', 'SQLite'],
  },
}

const copy = {
  zh: {
    imaging: { name: '得到影像在线修图订单系统', role: '商业交付 · 全栈工程师', status: '生产交付', summary: '把散落在微信群、表格和人工排期里的 ToB 修图业务，收口为可运行的多角色履约系统。', outcome: '客户下单、销售跟进、修图排期、交付结算、支付与运营管理形成完整闭环。', details: ['覆盖客户、销售、修图师、组长与运营等角色边界。', '包含小程序、FastAPI 服务、React 运营后台、迁移与部署文档。'] },
    logistics: { name: 'BEST GROUP 物流业务系统', role: '企业系统 · 全栈工程师', status: '一期交付', summary: '围绕一票货代业务，把托书、操作节点、费用申请、财务账单和利润汇总组织进同一数据链路。', outcome: '41 个业务页面支撑客户、操作、财务、分部和总部五类角色协作。', details: ['用数据隔离落实公司、分部与总部权限边界。', '前后端、部署模板和交付文档一并纳入仓库。'] },
    gita: { name: '行动之前 · 互动叙事游戏', role: '独立产品 · 设计与开发', status: '已上线', summary: '一款以《薄伽梵歌》为思想底层的选择驱动叙事游戏，选择先产生现实后果，再回到动机与史实复盘。', outcome: '三个独立篇章、云端存档与全部选择路径校验，形成可公开体验的完整产品。', details: ['内容引擎用纯函数处理选择效果、结局与重玩。', '测试枚举每篇 81 条四次选择组合并验证全部结局可达。'] },
    career: { name: 'career-ops · AI 求职工作流', role: '开源维护 · Top 3 Contributor', status: '持续维护', summary: '参与维护本地优先的 AI 求职自动化系统，让岗位评估、简历、扫描、追踪和批处理不止停在一次性对话。', outcome: '73 个 PR、35 个已合并，覆盖并发安全、质量门禁、更新器、PDF 与多 CLI 工作流。', details: ['围绕事实校验、状态写入、失败恢复和输出契约持续加固。', '把 Agent 输出变成可验证、可恢复、可复用的工作流资产。'] },
    odyssey: { name: 'Odyssey Restaurant Ops', role: '全栈作业 · 架构与实现', status: '可运行', summary: '面向餐厅运营团队的现代全栈后台，覆盖订单流、菜单、客户洞察和服务配置。', outcome: '以 schema 为源头贯通 OpenAPI、类型客户端与前端数据流。', details: ['采用 TypeScript monorepo、Hono Worker、Drizzle 与 React Query。', '后端持有金额计算、库存可用性和订单状态迁移规则。'] },
    kenya: { name: 'Kenya Realty OS', role: '业务原型 · 全栈开发', status: 'V1 原型', summary: '面向肯尼亚租售市场的可信房源平台，将提交、实名、验真、上线审核和公开展示拆成明确阶段。', outcome: '统一承接房东、经纪人、运营和客户线索，同时隔离公开信息与内部敏感字段。', details: ['公开房源必须通过验真与上线双重审核。', '付费与广告能力保持明确占位，不把原型包装成生产闭环。'] },
    acecoach: { name: 'AceCoach AI 网球教练', role: 'AI 产品实验 · 小程序开发', status: 'MVP', summary: '从训练视频中提取人体关键点，把发球动作转化为可读的评分与训练建议。', outcome: '完成 MediaPipe 姿态分析实验、报告 JSON 与小程序演示流程。', details: ['真实动作分析可独立运行；小程序主流程仍保留演示数据。', '同时沉淀 PRD、竞品研究、演示视频和赛事材料。'] },
    dashboard: { name: '高铁结构健康监测平台', role: '可视化前端 · Vue 开发', status: '展示 Demo', summary: '把线路站点、设备在线率、无人机巡检、病害、告警和工单集中到一张运行大屏。', outcome: '以地图为主场景，为智慧铁路巡检提供清晰的状态与处置入口。', details: ['使用 Vue 3、ECharts 与高德地图。', '适配站点切换、详情浮层与告警工单展示。'] },
    paopao: { name: 'Coco / PaopaoChat 实时通信', role: '项目改造 · 全栈开发', status: '项目归档', summary: '同一 IM 项目的版本与改造分支，覆盖多消息聊天、语音、ASR、音视频通话和离线消息。', outcome: '形成 Flutter 客户端、WebSocket/Netty 推送、Agora RTC 与本地消息存储的相邻经验。', details: ['包含语音录制、波形、播放进度与转文字入口。', '这是项目改造经验，不包装为两个独立产品。'] },
  },
  en: {
    imaging: { name: 'Dedao Imaging Order System', role: 'Commercial delivery · Full-stack engineer', status: 'Production delivery', summary: 'Consolidated a fragmented B2B retouching operation into one multi-role order and fulfilment system.', outcome: 'Orders, sales follow-up, scheduling, delivery, settlement, payment, and operations now share one workflow.', details: ['Role boundaries cover customers, sales, retouchers, team leads, and operators.', 'The repository includes the Mini Program, FastAPI service, React console, migrations, and handoff docs.'] },
    logistics: { name: 'BEST GROUP Logistics System', role: 'Enterprise system · Full-stack engineer', status: 'Phase one delivered', summary: 'Modelled a freight-forwarding job from booking request through operations, expense approval, billing, reconciliation, and profit.', outcome: '41 business pages support customers, operators, finance, branches, and headquarters.', details: ['Data isolation enforces company, branch, and headquarters boundaries.', 'Frontend, backend, deployment templates, and handoff documentation ship together.'] },
    gita: { name: 'Before the Act · Narrative Game', role: 'Independent product · Design and engineering', status: 'Live', summary: 'A choice-driven narrative game grounded in the Bhagavad Gita: consequences arrive before reflection on motive and history.', outcome: 'Three chapters, cloud saves, and exhaustive path validation make it a complete public product.', details: ['A pure-function content engine handles effects, endings, and replay.', 'Tests enumerate all 81 four-choice paths per chapter and verify ending reachability.'] },
    career: { name: 'career-ops · AI Job Workflow', role: 'Open source · Top 3 contributor', status: 'Active', summary: 'Maintaining a local-first AI job-search system that turns evaluation, resumes, scanning, tracking, and batches into durable workflows.', outcome: '73 PRs with 35 merged across concurrency, quality gates, updating, PDF generation, and multi-CLI workflows.', details: ['Work centres on fact validation, state writes, recovery paths, and output contracts.', 'Agent output becomes verifiable, recoverable workflow material instead of disposable chat.'] },
    odyssey: { name: 'Odyssey Restaurant Ops', role: 'Full-stack assignment · Architecture and implementation', status: 'Runnable', summary: 'A modern restaurant operations product spanning order flow, menus, customer insight, and service settings.', outcome: 'A schema-first pipeline connects OpenAPI, typed clients, and frontend data flows.', details: ['Built as a TypeScript monorepo with Hono Workers, Drizzle, and React Query.', 'The backend owns totals, availability, and valid order transitions.'] },
    kenya: { name: 'Kenya Realty OS', role: 'Business prototype · Full-stack engineer', status: 'V1 prototype', summary: 'A trusted-listing platform that separates submission, identity, verification, publishing review, and public display.', outcome: 'It serves landlords, agents, operators, and leads while protecting internal and sensitive fields.', details: ['Listings require both verification and publishing approval.', 'Paid capabilities remain explicit placeholders rather than overstated production features.'] },
    acecoach: { name: 'AceCoach AI Tennis Coach', role: 'AI product experiment · Mini Program engineer', status: 'MVP', summary: 'Extracts body landmarks from training video and turns a tennis serve into readable scores and advice.', outcome: 'A MediaPipe pose experiment produces report JSON consumed by the Mini Program demo.', details: ['The analysis pipeline runs independently; the primary Mini Program flow still uses demo data.', 'The repository also contains a PRD, competitor research, and demo assets.'] },
    dashboard: { name: 'Railway Structural Health Dashboard', role: 'Data visualization · Vue engineer', status: 'Demo', summary: 'Brings station health, devices, drone inspection, defects, alerts, and work orders into one operating view.', outcome: 'A map-led interface gives railway inspection a clear status and response surface.', details: ['Built with Vue 3, ECharts, and AMap.', 'Includes station switching, detail overlays, alerts, and work-order views.'] },
    paopao: { name: 'Coco / PaopaoChat Realtime IM', role: 'Project adaptation · Full-stack engineer', status: 'Archived', summary: 'Two versions of one IM project covering rich messaging, voice, ASR, RTC calls, and offline delivery.', outcome: 'Demonstrates adjacent experience across Flutter, WebSocket/Netty push, Agora RTC, and local persistence.', details: ['Includes recording, waveform, playback progress, and transcription entry points.', 'Presented as project adaptation—not as two independently authored platforms.'] },
  },
}

export const projectFilters = {
  zh: { all: '全部', product: '业务系统', openSource: '开源', indie: '独立产品', ai: 'AI 实验', frontend: '可视化', realtime: '实时通信' },
  en: { all: 'All', product: 'Business systems', openSource: 'Open source', indie: 'Independent', ai: 'AI experiments', frontend: 'Visualization', realtime: 'Realtime' },
}

export function getProjectShowcase(locale = 'zh') {
  return Object.entries(shared).map(([key, project]) => ({ ...project, ...copy[locale][key] }))
}
