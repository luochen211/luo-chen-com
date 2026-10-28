const shared = {
  scholar: {
    id: 'scholar', category: 'product', year: '2026', featured: true,
    liveHref: 'https://xysjwlwhcm.top/chat/',
    tech: ['Node.js', 'TypeScript', 'React', 'SQLite', 'RAG', 'Alibaba Cloud SMS'],
  },
  imaging: {
    id: 'imaging', category: 'product', year: '2026', featured: true,
    tech: ['WeChat Mini Program', 'FastAPI', 'React', 'SQLAlchemy', 'Alibaba Cloud'],
  },
  logistics: {
    id: 'logistics', category: 'product', year: '2026', featured: true,
    tech: ['React 19', 'TypeScript', 'Express', 'Prisma', 'SQLite'],
  },
  gita: {
    id: 'gita', category: 'indie', year: '2026', featured: true,
    tech: ['React', 'TypeScript', 'PostgreSQL', 'Playwright', 'Railway'],
  },
  career: {
    id: 'career', category: 'openSource', year: '2026', featured: true,
    href: 'https://github.com/santifer/career-ops/pulls?q=is%3Apr+author%3Aluochen211',
    tech: ['AI Agent', 'Node.js', 'Playwright', 'Workflow', 'Quality Gates'],
  },
  pptOps: {
    id: 'ppt-ops', category: 'tools', year: '2026', featured: false,
    href: 'https://github.com/luochen211/ppt-ops',
    tech: ['Node.js', 'MCP', 'PptxGenJS', 'HTML Slides', 'Zod'],
  },
  dagDelivery: {
    id: 'dag-delivery', category: 'tools', year: '2026', featured: false,
    href: 'https://github.com/luochen211/dag-delivery',
    tech: ['Codex Skill', 'Python', 'GitHub Issues', 'DAG'],
  },
  codexGuide: {
    id: 'codex-guide', category: 'tools', year: '2026', featured: false,
    href: 'https://github.com/luochen211/codex-enterprise-guide',
    liveHref: 'https://luochen211.github.io/codex-enterprise-guide/',
    tech: ['VitePress', 'Codex', 'GitHub Pages'],
  },
  neighborhood: {
    id: 'neighborhood', category: 'indie', year: '2026', featured: false,
    href: 'https://github.com/luochen211/neighborhood-exchange',
    tech: ['React', 'TypeScript', 'Fastify', 'SQLite', 'Drizzle', 'OpenAPI'],
  },
  sglang: {
    id: 'sglang', category: 'ai', year: '2026', featured: false,
    href: 'https://github.com/luochen211/sglang-teaching',
    tech: ['SGLang', 'Python', 'LLM Serving', 'KV Cache'],
  },
  harnessDemo: {
    id: 'harness-demo', category: 'ai', year: '2026', featured: false,
    href: 'https://github.com/luochen211/luo-chen-com/tree/main/public/demos/agent-harness',
    liveHref: '/demos/agent-harness/',
    tech: ['Agent Harness', 'ReAct', 'Tool Calling', 'Memory', 'RAG', 'Evaluation'],
  },
  odyssey: {
    id: 'odyssey', category: 'product', year: '2026', featured: false,
    href: 'https://github.com/luochen211/odyssey-fullstack-assignment',
    tech: ['TypeScript', 'Hono', 'Cloudflare Workers', 'Drizzle', 'OpenAPI'],
  },
  kenya: {
    id: 'kenya', category: 'product', year: '2026', featured: false,
    tech: ['Node.js', 'Express', 'SQLite', 'RBAC', 'Railway'],
  },
  acecoach: {
    id: 'acecoach', category: 'ai', year: '2026', featured: false,
    tech: ['WeChat Mini Program', 'MediaPipe', 'Python', 'FFmpeg', 'Pose Analysis'],
  },
  dashboard: {
    id: 'dashboard', category: 'frontend', year: '2026', featured: false,
    tech: ['Vue 3', 'ECharts', 'AMap', 'Data Visualization'],
  },
  paopao: {
    id: 'paopao', category: 'realtime', year: '2026', featured: false,
    tech: ['Flutter', 'Spring Boot', 'WebSocket', 'Agora RTC', 'SQLite'],
  },
}

const copy = {
  zh: {
    scholar: { name: '超级学霸 · AI 学习工作台', role: '产品设计 · 全栈开发', status: '已上线', summary: '面向家庭自学与成人 AI 实践的在线学习工作台：提问、借助资料学习、核对出处，再把练习和错题留在自己的账号里。', outcome: '内置数学学习板块覆盖小学到初中 109 个知识点、597 道题，诊断、练习与错题订正按账号保存。', details: ['手机号验证码登录，首次验证自动注册；回答附带资料来源，可展开核对原文。', '学币钱包按模型实际 Token 用量结算，单次预算可由用户自己设置。'] },
    imaging: { name: '得到影像在线修图订单系统', role: '商业交付 · 全栈工程师', status: '生产交付', summary: '把散落在微信群、表格和人工排期里的 ToB 修图业务，收口为可运行的多角色履约系统。', outcome: '客户下单、销售跟进、修图排期、交付结算、支付与运营管理形成完整闭环。', details: ['覆盖客户、销售、修图师、组长与运营等角色边界。', '包含小程序、FastAPI 服务、React 运营后台、迁移与部署文档。'] },
    logistics: { name: 'BEST GROUP 物流业务系统', role: '企业系统 · 全栈工程师', status: '一期交付', summary: '围绕一票货代业务，把托书、操作节点、费用申请、财务账单和利润汇总组织进同一数据链路。', outcome: '41 个业务页面支撑客户、操作、财务、分部和总部五类角色协作。', details: ['用数据隔离落实公司、分部与总部权限边界。', '前后端、部署模板和交付文档一并纳入仓库。'] },
    gita: { name: '行动之前 · 互动叙事游戏', role: '独立产品 · 设计与开发', status: '线上版暂停', summary: '一款以《薄伽梵歌》为思想底层的选择驱动叙事游戏，选择先产生现实后果，再回到动机与史实复盘。', outcome: '三个独立篇章、云端存档与全部选择路径校验，形成完整的产品。', details: ['内容引擎用纯函数处理选择效果、结局与重玩。', '测试枚举每篇 81 条四次选择组合并验证全部结局可达。'] },
    career: { name: 'career-ops · AI 求职工作流', role: '开源维护 · Top 10 Contributor', status: '持续维护', summary: '参与维护本地优先的 AI 求职自动化系统，让岗位评估、简历、扫描、追踪和批处理不止停在一次性对话。', outcome: '150 个 PR、112 个已合并，覆盖并发安全、质量门禁、更新器、PDF 与多 CLI 工作流。', details: ['围绕事实校验、状态写入、失败恢复和输出契约持续加固。', '把 Agent 输出变成可验证、可恢复、可复用的工作流资产。'] },
    pptOps: { name: 'PPT-Ops · 演示文稿工作流', role: '开源工具 · 设计与开发', status: '持续维护', summary: '把一堆资料变成能讲、能改、能交出去的演示文稿：先理清主线，再做页面，最后用工具检查一遍。', outcome: '交付浏览器可直接放映的 HTML 和可继续编辑的 PowerPoint，仓库已合并 52 个 PR。', details: ['按总时长估算每页讲多久，超时时提示先压缩哪几页。', '以 MCP 服务形式接入 AI 编程工具，流程负责把关，设计留给模型发挥。'] },
    dagDelivery: { name: 'DAG Delivery · Issue 依赖调度', role: 'Codex Skill · 设计与开发', status: '开源', summary: '把 GitHub Issues 从任务列表变成可计算、可执行、可验收的依赖图。', outcome: '校验 Issue 依赖后算出 Ready、Blocked、Review、Claimed 队列，协调多个 Codex 会话按依赖顺序推进。', details: ['先确认需求文档和目标仓库，再计算当前可做的 Issue。', '队列计算由脚本完成，不靠模型凭印象判断。'] },
    codexGuide: { name: 'Codex 从 0 到企业级项目', role: '开源指南 · 写作与建站', status: '在线文档', summary: '面向个人、创作者、开发者与团队的 Codex 实践指南，把用法沉淀成可学习、可复制、可团队化的工作流。', outcome: '以 VitePress 文档站发布在 GitHub Pages，可直接在线阅读。', details: ['按个人、创作者、开发者与团队分层组织内容。', '文档源、站点配置和主题扩展都在仓库里。'] },
    neighborhood: { name: '邻里闲置 · 社区闲置流转', role: '独立产品 · 全栈开发', status: '可运行', summary: '面向同一小区、楼栋或办公室的闲置流转 Web 应用，覆盖发布、搜索、意向留言、预约、双方确认和送出归档。', outcome: '前后端通过共享 OpenAPI / Zod 契约访问同源 API，发布者可请求 AI 整理文案后手动发布。', details: ['React + Vite 前端，Fastify + SQLite + Drizzle 后端。', '演示图片与身份数据均为虚构，并在页面明确标注。'] },
    sglang: { name: 'SGLang 教学实验室', role: '开源教程 · 设计与编写', status: '开源', summary: '以“能运行、能测量、能解释”为标准的 SGLang 学习仓库，讲清 LLM serving 如何把请求变成 token 计算。', outcome: '覆盖 prefill / decode、KV cache 与 RadixAttention，并用可复现实验验证优化效果。', details: ['包含 CPU 模拟，没有 GPU 也能跑通核心概念。', '每个结论都配有可复现的测量步骤。'] },
    harnessDemo: { name: 'Agent Harness 讲师演示台', role: '课程演示 · 产品与开发', status: '可在线演示', summary: '配合 5 节、45 页 Agent 与 Harness 基础课，把 Context、Tool、Correct、Memory、能力发现、A2A 交接与 Evaluation 变成现场可见的系统行为。', outcome: '演示内容围绕组成、运行、可靠性、信息分层、能力发现、新证据协作与过程/结果双重评测展开，并用固定评测驱动 Builder、Evaluator、Reviewer 的 Prompt 自迭代。', details: ['演示台只服务讲师控制节奏，每个实验都有唯一证明目标、观察点与一句话落点。', '本地确定性 Harness 无需 API Key，可稳定复现工具反馈、受限重试、信息归属、能力按需加载，以及评测失败证据驱动的 A2A 回归门禁。'] },
    odyssey: { name: 'Odyssey Restaurant Ops', role: '全栈作业 · 架构与实现', status: '可运行', summary: '面向餐厅运营团队的现代全栈后台，覆盖订单流、菜单、客户洞察和服务配置。', outcome: '以 schema 为源头贯通 OpenAPI、类型客户端与前端数据流。', details: ['采用 TypeScript monorepo、Hono Worker、Drizzle 与 React Query。', '后端持有金额计算、库存可用性和订单状态迁移规则。'] },
    kenya: { name: 'Kenya Realty OS', role: '业务原型 · 全栈开发', status: 'V1 原型', summary: '面向肯尼亚租售市场的可信房源平台，将提交、实名、验真、上线审核和公开展示拆成明确阶段。', outcome: '统一承接房东、经纪人、运营和客户线索，同时隔离公开信息与内部敏感字段。', details: ['公开房源必须通过验真与上线双重审核。', '付费与广告能力保持明确占位，不把原型包装成生产闭环。'] },
    acecoach: { name: 'AceCoach AI 网球教练', role: 'AI 产品实验 · 小程序开发', status: 'MVP', summary: '从训练视频中提取人体关键点，把发球动作转化为可读的评分与训练建议。', outcome: '完成 MediaPipe 姿态分析实验、报告 JSON 与小程序演示流程。', details: ['真实动作分析可独立运行；小程序主流程仍保留演示数据。', '同时沉淀 PRD、竞品研究、演示视频和赛事材料。'] },
    dashboard: { name: '高铁结构健康监测平台', role: '可视化前端 · Vue 开发', status: '展示 Demo', summary: '把线路站点、设备在线率、无人机巡检、病害、告警和工单集中到一张运行大屏。', outcome: '以地图为主场景，为智慧铁路巡检提供清晰的状态与处置入口。', details: ['使用 Vue 3、ECharts 与高德地图。', '适配站点切换、详情浮层与告警工单展示。'] },
    paopao: { name: 'Coco / PaopaoChat 实时通信', role: '项目改造 · 全栈开发', status: '项目归档', summary: '同一 IM 项目的版本与改造分支，覆盖多消息聊天、语音、ASR、音视频通话和离线消息。', outcome: '形成 Flutter 客户端、WebSocket/Netty 推送、Agora RTC 与本地消息存储的相邻经验。', details: ['包含语音录制、波形、播放进度与转文字入口。', '这是项目改造经验，不包装为两个独立产品。'] },
  },
  en: {
    scholar: { name: 'Super Scholar · AI Learning Workspace', role: 'Product design · Full-stack engineering', status: 'Live', summary: 'An online learning workspace for family self-study and adult AI practice: ask questions, learn from source material, check citations, and keep practice and mistakes in your own account.', outcome: 'The built-in maths module covers 109 primary-to-middle-school skills and 597 questions, with diagnostics, practice, and mistake review saved per account.', details: ['Phone verification sign-in registers new users on first use; answers cite their sources and expand to the original text.', 'A study-coin wallet bills by the model’s actual token usage, with a per-request budget the learner sets.'] },
    imaging: { name: 'Dedao Imaging Order System', role: 'Commercial delivery · Full-stack engineer', status: 'Production delivery', summary: 'Consolidated a fragmented B2B retouching operation into one multi-role order and fulfilment system.', outcome: 'Orders, sales follow-up, scheduling, delivery, settlement, payment, and operations now share one workflow.', details: ['Role boundaries cover customers, sales, retouchers, team leads, and operators.', 'The repository includes the Mini Program, FastAPI service, React console, migrations, and handoff docs.'] },
    logistics: { name: 'BEST GROUP Logistics System', role: 'Enterprise system · Full-stack engineer', status: 'Phase one delivered', summary: 'Modelled a freight-forwarding job from booking request through operations, expense approval, billing, reconciliation, and profit.', outcome: '41 business pages support customers, operators, finance, branches, and headquarters.', details: ['Data isolation enforces company, branch, and headquarters boundaries.', 'Frontend, backend, deployment templates, and handoff documentation ship together.'] },
    gita: { name: 'Before the Act · Narrative Game', role: 'Independent product · Design and engineering', status: 'Offline for now', summary: 'A choice-driven narrative game grounded in the Bhagavad Gita: consequences arrive before reflection on motive and history.', outcome: 'Three chapters, cloud saves, and exhaustive path validation make it a complete product.', details: ['A pure-function content engine handles effects, endings, and replay.', 'Tests enumerate all 81 four-choice paths per chapter and verify ending reachability.'] },
    career: { name: 'career-ops · AI Job Workflow', role: 'Open source · Top 10 contributor', status: 'Active', summary: 'Maintaining a local-first AI job-search system that turns evaluation, resumes, scanning, tracking, and batches into durable workflows.', outcome: '150 PRs with 112 merged across concurrency, quality gates, updating, PDF generation, and multi-CLI workflows.', details: ['Work centres on fact validation, state writes, recovery paths, and output contracts.', 'Agent output becomes verifiable, recoverable workflow material instead of disposable chat.'] },
    pptOps: { name: 'PPT-Ops · Presentation Workflow', role: 'Open-source tool · Design and engineering', status: 'Active', summary: 'Turns a pile of source material into a deck you can present, edit, and hand over: outline first, then pages, then automated checks.', outcome: 'Ships a browser-ready HTML deck plus an editable PowerPoint; 52 pull requests merged.', details: ['Budgets speaking time per slide from the script and flags which pages to cut when over time.', 'Runs as an MCP server for AI coding tools: the workflow guards quality and leaves design to the model.'] },
    dagDelivery: { name: 'DAG Delivery · Issue Dependency Scheduler', role: 'Codex skill · Design and engineering', status: 'Open source', summary: 'Turns GitHub Issues from a task list into a computable, executable, verifiable dependency graph.', outcome: 'Validates issue dependencies, computes Ready, Blocked, Review, and Claimed queues, and coordinates several Codex sessions in dependency order.', details: ['Confirms the requirements document and target repository before scheduling.', 'A script computes the queues instead of the model guessing.'] },
    codexGuide: { name: 'Codex: From Zero to Enterprise Projects', role: 'Open-source guide · Writing and site', status: 'Live docs', summary: 'A practical Codex guide for individuals, creators, developers, and teams that turns usage into learnable, repeatable team workflows.', outcome: 'Published as a VitePress site on GitHub Pages.', details: ['Content is layered for individuals, creators, developers, and teams.', 'Sources, site config, and theme extensions live in the repository.'] },
    neighborhood: { name: 'Neighborhood Exchange', role: 'Independent product · Full-stack engineer', status: 'Runnable', summary: 'A web app for passing on unused items within a building or office: listing, search, interest and messages, scheduling, mutual confirmation, and archiving.', outcome: 'Frontend and backend share OpenAPI / Zod contracts; sellers can ask AI to tidy a listing before publishing it themselves.', details: ['React + Vite frontend; Fastify, SQLite, and Drizzle backend.', 'Demo images and identities are fictional and labelled as such.'] },
    sglang: { name: 'SGLang Teaching Lab', role: 'Open-source course · Design and writing', status: 'Open source', summary: 'A runnable, measurement-first SGLang lab that explains how an LLM serving system turns requests into token computation.', outcome: 'Covers prefill / decode, KV cache, and RadixAttention, with reproducible experiments that test whether an optimisation helps.', details: ['CPU simulations make the core ideas runnable without a GPU.', 'Every claim comes with a reproducible measurement.'] },
    harnessDemo: { name: 'Agent Harness Presenter Console', role: 'Course demo · Product and engineering', status: 'Live demo', summary: 'A presenter-controlled companion to a five-lesson, 45-slide Agent Harness course that makes context, tools, correction, memory, capability discovery, and evaluation observable.', outcome: 'The demonstrations align composition, runtime, reliability, information layers, evidence-gaining collaboration, and process/outcome evaluation with the course.', details: ['Each demo has one proof target, three audience cues, and one closing takeaway.', 'The deterministic local harness needs no API key and reliably reproduces tool feedback, bounded retries, information ownership, capability loading, and evaluation-dataset checks.'] },
    odyssey: { name: 'Odyssey Restaurant Ops', role: 'Full-stack assignment · Architecture and implementation', status: 'Runnable', summary: 'A modern restaurant operations product spanning order flow, menus, customer insight, and service settings.', outcome: 'A schema-first pipeline connects OpenAPI, typed clients, and frontend data flows.', details: ['Built as a TypeScript monorepo with Hono Workers, Drizzle, and React Query.', 'The backend owns totals, availability, and valid order transitions.'] },
    kenya: { name: 'Kenya Realty OS', role: 'Business prototype · Full-stack engineer', status: 'V1 prototype', summary: 'A trusted-listing platform that separates submission, identity, verification, publishing review, and public display.', outcome: 'It serves landlords, agents, operators, and leads while protecting internal and sensitive fields.', details: ['Listings require both verification and publishing approval.', 'Paid capabilities remain explicit placeholders rather than overstated production features.'] },
    acecoach: { name: 'AceCoach AI Tennis Coach', role: 'AI product experiment · Mini Program engineer', status: 'MVP', summary: 'Extracts body landmarks from training video and turns a tennis serve into readable scores and advice.', outcome: 'A MediaPipe pose experiment produces report JSON consumed by the Mini Program demo.', details: ['The analysis pipeline runs independently; the primary Mini Program flow still uses demo data.', 'The repository also contains a PRD, competitor research, and demo assets.'] },
    dashboard: { name: 'Railway Structural Health Dashboard', role: 'Data visualization · Vue engineer', status: 'Demo', summary: 'Brings station health, devices, drone inspection, defects, alerts, and work orders into one operating view.', outcome: 'A map-led interface gives railway inspection a clear status and response surface.', details: ['Built with Vue 3, ECharts, and AMap.', 'Includes station switching, detail overlays, alerts, and work-order views.'] },
    paopao: { name: 'Coco / PaopaoChat Realtime IM', role: 'Project adaptation · Full-stack engineer', status: 'Archived', summary: 'Two versions of one IM project covering rich messaging, voice, ASR, RTC calls, and offline delivery.', outcome: 'Demonstrates adjacent experience across Flutter, WebSocket/Netty push, Agora RTC, and local persistence.', details: ['Includes recording, waveform, playback progress, and transcription entry points.', 'Presented as project adaptation—not as two independently authored platforms.'] },
  },
}

export const projectFilters = {
  zh: { all: '全部', product: '业务系统', openSource: '开源', tools: '开发工具', indie: '独立产品', ai: 'AI 实验', frontend: '可视化', realtime: '实时通信' },
  en: { all: 'All', product: 'Business systems', openSource: 'Open source', tools: 'Developer tools', indie: 'Independent', ai: 'AI experiments', frontend: 'Visualization', realtime: 'Realtime' },
}

export function getProjectShowcase(locale = 'zh') {
  return Object.entries(shared).map(([key, project]) => ({ ...project, ...copy[locale][key] }))
}
