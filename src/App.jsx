import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const content = {
  en: {
    seoTitle: 'Agent Harness Engineer & Full-Stack Builder',
    nav: {
      home: 'Home',
      now: 'Now',
      roundtable: 'Roundtable',
      summary: 'Summary',
      stack: 'Stack',
      work: 'Work',
      output: 'Output',
      ppt: 'PPT',
      contact: 'Contact',
    },
    toggle: '中文',
    hero: {
      eyebrow: 'AGENT HARNESS ENGINEER',
      title: 'I build harnesses for reliable agents.',
      meta: 'Agent Harness | AI Coding CLI | Full-Stack Delivery |',
      intro:
        'I am moving toward Agent Harness engineering: CLI tooling, tool-call safety, evaluation gates, batch workflows, and the full-stack systems that prove them in production.',
      manifestoLabel: 'Operating Principle',
      manifesto:
        'Stay curious, stay disciplined, and build things that genuinely help people. I believe steady progress, honest collaboration, and long-term reliability matter more than short-term noise.',
      primaryAction: 'View Work',
      secondaryAction: 'Contact Me',
      avatarAlt: 'Profile portrait',
      stats: [
        { value: '14+', label: 'Merged Agent PRs' },
        { value: '200k+', label: 'RMB GMV Delivered' },
        { value: 'End-to-End', label: 'Production Delivery' },
      ],
    },
    now: {
      label: 'Now',
      title: 'Now: June 2026',
      learningTitle: 'Learning',
      learning: [
        'Using the summer break to go deeper into Agent Harness, AI Coding CLI internals, tool-call safety, and evaluation gates.',
        'Improving English every day: listening, speaking practice, and technical writing for remote collaboration.',
      ],
      careerTitle: 'Career Goal',
      career: [
        'Open to remote engineering roles, contractor projects, and AI-native product delivery collaborations.',
        'Targeting AI Agent engineering, Agent CLI tooling, AI platform infrastructure, and full-stack product engineering roles.',
        'Best fit: teams that need someone who can read unfamiliar agent codebases, ship minimal fixes, add test harnesses, handle maintainer review, and also deliver production business systems end to end.',
        'I value async communication, clear technical writing, quality gates, and engineering work that connects model capability with real product operations.',
      ],
      buildingTitle: 'Current Projects',
      building: [
        'Continuing open-source practice around Agent CLI, test harnesses, command safety, and batch workflows.',
        'Turning Agent Harness and AI coding practice into articles, recorded videos, and community output.',
        'Continuing feature delivery and operations for the Image Retouching Order Mini Program.',
        'Updating this personal site as a living record of work and growth.',
      ],
      routineTitle: 'Weekly Routine',
      routine: [
        'Strength training every week to keep energy, posture, and execution stable.',
        'Practicing Ashtanga Yoga during the summer break for discipline, mobility, breath, and long-term focus.',
      ],
      mindsetTitle: 'Current Mindset',
      mindset:
        'Summer is for compounding: train the body, deepen the harness direction, publish consistently, and keep building visible proof.',
    },
    summary: {
      label: 'Professional Summary',
      title: 'From Agent Harness To Production Delivery',
      paragraphs: [
        'I am not only doing full-stack work. My long-term direction is Agent Harness engineering: the infrastructure around AI coding agents that makes them safe, testable, recoverable, and useful in real workflows.',
        'My recent work spans merged upstream PRs in Agent CLI / career automation projects, plus commercial systems covering orders, payment callbacks, role permissions, operations dashboards, and production deployment. Full-stack delivery is the ground where I test and sharpen harness thinking.',
      ],
      narrativeTitle: 'My Engineering Narrative',
      narrative: [
        'I care about the layer between model capability and real execution: harnesses, gates, traces, recovery paths, and operating constraints.',
        'I use full-stack delivery as a proving ground for agent workflows, not as the ceiling of my career direction.',
        'I treat AI agents as engineering collaborators, but keep strong human control over architecture, tool policy, validation, and production quality.',
      ],
      principlesTitle: 'Engineering Principles',
      principles: [
        'Spec-first delivery: translate fuzzy requirements into testable execution plans.',
        'Reliability by default: idempotency, retry strategy, and observability are built in early.',
        'Fast feedback loops: CI lint/build checks and release rollback paths for safer iteration.',
      ],
      workflowTitle: 'Delivery Workflow',
      workflow: [
        'Requirement modeling: define boundaries, contracts, and success metrics.',
        'Architecture split: isolate stateful services, async workers, and UI concerns.',
        'Production hardening: monitoring, fallback strategy, and post-release optimization.',
      ],
    },
    course: {
      label: 'Content Output',
      title: 'Articles, videos, and community around Agent Harness practice.',
      intro:
        'I keep turning Agent Harness, AI Coding CLI, and real delivery experience into public writing, recorded videos, and a paid community for people who want to practice with structure.',
      stats: [
        { value: 'Articles', label: 'Engineering Notes And Essays' },
        { value: 'PPT', label: 'Talks And Offline Sharing' },
        { value: 'Community', label: 'Paid Learning Group' },
      ],
      archive: {
        title: 'PPT Archive',
        description:
          'A public archive for my livestream decks, offline sharing materials, and AI product talks.',
        action: 'Open PPT Archive',
        href: 'https://ai-product-talk-guizang-b-production.up.railway.app/',
      },
      supportTitle: 'What I Publish',
      support: [
        'Articles about Agent Harness, AI Coding CLI workflow, tool safety, and production delivery.',
        'PPT decks from livestreams, offline talks, and AI product sharing sessions.',
        'Recorded videos that demonstrate real development process, debugging, and project decomposition.',
        'Reusable notes, checklists, and examples from open-source contribution and commercial projects.',
      ],
      outcomeTitle: 'How People Can Join',
      outcomes: [
        'Join the paid community to follow my ongoing output and practice with a group.',
        'Use the writing and videos as a learning path for AI coding, agent workflow, and delivery habits.',
        'Bring real questions from projects, open source, or job preparation into structured discussion.',
      ],
    },
    stack: {
      label: 'Technical Stack',
      title: 'AI-Native Engineering Stack',
      groups: [
        {
          title: 'AI Collaboration',
          items: [
            'Claude Code',
            'LLM Prompt Engineering',
            'Agentic Workflow Optimization',
          ],
        },
        {
          title: 'Backend Engineering',
          items: [
            'Python (FastAPI, Async API Services)',
            'Node.js (BFF & Engineering Tooling)',
            'SQLAlchemy + Alembic',
            'Redis (Cache & Task Queue)',
          ],
        },
        {
          title: 'Frontend Engineering',
          items: [
            'TypeScript',
            'WeChat Mini Program (Native)',
            'Vue.js',
            'Tailwind CSS',
            'ECharts / D3.js',
          ],
        },
        {
          title: 'Infrastructure',
          items: ['Docker', 'CI/CD', 'API Gateway Design', 'Observability'],
        },
      ],
      focusTitle: 'Current Technical Focus',
      focus: [
        'Agent Harness design for AI coding CLI workflows',
        'Tool-call safety, evaluation gates, and test harnesses',
        'Full-stack production systems as real-world validation grounds',
      ],
    },
    projects: {
      label: 'Work Highlights',
      title: 'Selected Work',
      detailTitle: 'Technical Details',
      list: [
        {
          name: 'career-ops AI Job Automation Agent Pipeline',
          role: 'Top 3 Contributor / Active Maintainer',
          period: 'Jun 2026',
          tech: ['AI Coding CLI', 'Playwright', 'Go TUI', 'Markdown/YAML', 'Batch Worker'],
          points: [
            'Maintained a local-first AI job automation pipeline across role evaluation, ATS resume generation, job scanning, application tracking, reports, and batch workers.',
            'Improved evaluation gates, report shape validation, tracker/report link normalization, scanner benchmark, feedback learning queue, and multi-CLI agent workflow.',
            'Turned AI-generated outputs into verifiable, recoverable, and reusable workflow artifacts instead of one-off chat results.',
          ],
          details: [
            'Worked with Claude Code, Codex, Gemini CLI, OpenCode, Qwen, Copilot, and Antigravity CLI integration paths.',
            'Handled batch score formatting, tracker writes, report migration, retry/rate-limit behavior, and duplicate-record avoidance.',
            'Added validation around portals.yml schema, liveness/role-match gates, and form-field contracts.',
          ],
        },
        {
          name: 'Step Realtime CLI Voice Agent',
          role: 'Core Contributor / Upstream PRs',
          period: 'Jun 2026',
          tech: ['TypeScript', 'Node.js', 'Realtime Voice', 'Vitest', 'GitHub Actions'],
          points: [
            'Contributed to a terminal AI coding assistant with text sessions, one-shot tasks, session resume, read-only planning mode, and realtime voice conversation.',
            'Built Windows voice installation and runtime support, including PowerShell installer, CI smoke checks, Windows 11 ARM VM validation, and browser audio driver paths.',
            'Merged command safety hardening that blocks risky command patterns in AI tool execution workflows.',
          ],
          details: [
            'Covered Chrome/Edge discovery, VAD installation, runtime driver selection, launcher compatibility, and package build checks.',
            'Added tool-policy regression tests for destructive command patterns including encoded destructive commands, find-delete, git clean, and workspace wipe cases.',
            'Responded to maintainer review with rebase, conflict resolution, test migration, and macOS/Windows validation notes.',
          ],
        },
        {
          name: 'PaopaoChat App',
          role: 'Full-Stack Engineer / Maintainer',
          period: 'Jan 2026 - May 2026',
          tech: ['TypeScript', 'Node.js', 'Redis', 'Docker', 'CI/CD'],
          points: [
            'Built and maintained production architecture across frontend, backend APIs, and deployment workflows during the project cycle.',
            'Optimized reliability and delivery speed with AI-assisted engineering practices.',
            'Owned maintenance, bug fixing, and iterative feature releases through project completion.',
          ],
          details: [
            'Designed layered service boundaries (UI, API gateway, domain services, async workers).',
            'Implemented context persistence and async task queue to keep long-running interactions stable.',
            'Added structured logs, request correlation IDs, and health checks for faster failure diagnosis.',
          ],
        },
        {
          name: 'Image Retouching Order Mini Program (Dedao Imaging)',
          role: 'Full-Stack Engineer',
          period: 'Feb 2026 - Present',
          tech: [
            'WeChat Mini Program (Native)',
            'FastAPI',
            'SQLAlchemy',
            'Alembic',
            'Admin Web',
          ],
          points: [
            'Delivered an end-to-end system including WeChat mini program frontend, FastAPI backend, and operation admin console.',
            'Implemented role-oriented business flows for customer, sales, retoucher, and leader/admin.',
            'Completed production feature hardening for order, points, invoice, notification, and analytics modules.',
          ],
          details: [
            'Structured backend by domain routers (`common/sales/customer/retoucher/leader_admin`) under `/api/v1` with unified error handling.',
            'Implemented database compatibility for SQLite/MySQL, plus schema evolution via Alembic migrations.',
            'Expanded reporting APIs for order summary, customer-invoice stats, and multi-role performance metrics; release test suite recorded 33 passed cases.',
          ],
        },
        {
          name: 'InsightHub | Multimodal AI Engineering Delivery',
          role: 'Engineering Lead',
          period: 'Dec 2025 - Feb 2026',
          tech: ['Python', 'Model Inference', 'Data Pipeline', 'Dashboard'],
          points: [
            'Led multimodal AI forecasting platform engineering with a Stanford top 2% scientist team at Hotel Icon (Hong Kong).',
            'Deployed and optimized cloud inference pipelines for TikTok and Xiaohongshu marketing datasets.',
            'Built a high-concurrency dashboard for real-time prediction monitoring and decision support.',
          ],
          details: [
            'Built ingestion pipelines for text/video metadata and multimodal features with batch + stream processing.',
            'Set up retry and dead-letter handling for unstable external data sources.',
            'Tracked inference latency, drift indicators, and queue depth as operational metrics.',
          ],
        },
        {
          name: 'Ralph Desktop | AI Agent Visual Control Center',
          role: 'Contributor',
          period: 'Jan 2026 - Present',
          tech: ['Agent Loop', 'Persistence Protocol', 'State Machine', 'UX Feedback'],
          points: [
            'Improved coding agent execution loops to increase conversion from ambiguous requirements to precise delivery.',
            'Enhanced iterative modules with persistence protocols to keep context consistency in complex logic.',
            'Improved execution-path feedback to reduce entropy during large-codebase refactoring.',
          ],
          details: [
            'Refined loop state transitions with checkpoints and recovery paths.',
            'Improved context compaction for better token-budget efficiency in long sessions.',
            'Contributed to execution trace visualization for easier debugging and intent alignment.',
          ],
        },
        {
          name: 'Overseas Virtual Commerce Platform',
          role: 'Full-Stack Lead',
          period: 'Jun 2025 - Dec 2025',
          tech: ['Backend API', 'Redis', 'Payment Gateway', 'Order Engine'],
          points: [
            'Built a virtual-asset commerce engine from zero to production, delivering over 200k RMB GMV.',
            'Implemented automated fulfillment and secure payment integrations to reduce manual operations.',
          ],
          details: [
            'Designed event-driven order state machine with idempotent payment callback handling.',
            'Added anti-abuse controls (rate limiting, anomaly checks) for higher transaction safety.',
            'Built asynchronous reconciliation jobs to improve finance and fulfillment consistency.',
          ],
        },
      ],
    },
    contact: {
      label: 'Contact',
      title: "Let's Work Together",
      cards: [
        {
          label: 'Email',
          value: 'cuidong111@gmail.com',
          href: 'mailto:cuidong111@gmail.com',
        },
        {
          label: 'GitHub',
          value: 'github.com/luochen211',
          href: 'https://github.com/luochen211',
        },
        {
          label: 'Domain',
          value: 'luo-chen.com',
          href: 'https://luo-chen.com',
        },
        {
          label: 'WeChat',
          value: 'luo002chen',
          note: 'Scan the QR code to add me on WeChat.',
          qrSrc: '/wechat-qr.png',
          qrAlt: 'WeChat QR code',
        },
      ],
    },
    footer: 'Agent Harness Engineer & Full-Stack Builder',
  },
  zh: {
    seoTitle: 'Agent Harness 工程师与全栈实践者',
    nav: {
      home: '首页',
      now: 'Now',
      roundtable: '专家圆桌',
      summary: '综述',
      stack: '技术栈',
      work: '作品',
      output: '产出',
      ppt: 'PPT',
      contact: '联系',
    },
    toggle: 'EN',
    hero: {
      eyebrow: 'AGENT HARNESS 工程师',
      title: '可靠 Agent 需要 Harness',
      meta: 'Agent Harness | AI Coding CLI | 全栈交付 |',
      intro:
        '我不只是做全栈，也在往 Agent Harness 方向深入：CLI 工具链、工具调用安全、评估门禁、批处理 workflow，以及能在生产系统里验证它们的全栈交付。',
      manifestoLabel: '行动原则',
      manifesto:
        '保持好奇，保持自律，持续做对他人真正有价值的产品。我相信长期主义、务实协作和稳定交付，胜过短期的喧哗。',
      primaryAction: '查看作品',
      secondaryAction: '联系我',
      avatarAlt: '个人头像',
      stats: [
        { value: '14+', label: 'Agent PR 合并' },
        { value: '20w+', label: '累计流水 RMB' },
        { value: '端到端', label: '生产系统交付' },
      ],
    },
    now: {
      label: 'Now',
      title: '我最近在做什么（2026年6月）',
      learningTitle: '学习中',
      learning: [
        '暑假期间集中深入 Agent Harness、AI Coding CLI 内部机制、工具调用安全和评估门禁。',
        '持续学习英语：听力、口语表达和技术写作同步推进，为海外远程协作做准备。',
      ],
      careerTitle: '职业目标',
      career: [
        '开放海外远程岗位、项目制合作，以及 AI 原生产品工程交付机会。',
        '重点方向是 AI Agent 工程化、Agent CLI 工具链、大模型平台基建和产品型全栈工程。',
        '我适合的不是只完成孤立需求的角色，而是能读陌生 Agent 仓库、拆最小修复、补测试 harness、处理 maintainer review，并把业务系统从需求推进到上线的人。',
        '我希望进入重视异步协作、英文文档、质量门禁和真实业务结果的团队，也接受 contractor / remote engineer / technical partner 形式的合作。',
      ],
      buildingTitle: '正在推进的项目',
      building: [
        '持续围绕 Agent CLI、测试 harness、命令安全和批处理 workflow 做开源实践。',
        '把 Agent Harness 和 AI 编程实践沉淀成文章、录制视频和社群内容。',
        '继续推进“得到影像在线修图订单小程序”的功能交付与线上运营支持。',
        '把个人网站作为长期更新的成长记录。',
      ],
      routineTitle: '长期习惯',
      routine: [
        '每周坚持撸铁，保持体能、姿态和稳定执行力。',
        '暑假期间持续练习阿斯汤加瑜伽，用来训练纪律、柔韧性、呼吸和长期专注。',
      ],
      mindsetTitle: '当前状态',
      mindset: '暑假是复利期：训练身体，深入 harness 方向，稳定输出内容，持续积累看得见的证据。',
    },
    summary: {
      label: '职业综述',
      title: '从 Agent Harness 到生产交付',
      paragraphs: [
        '我不是只在做全栈。我的长期方向是 Agent Harness 工程：围绕 AI 编程 Agent 构建安全、可测试、可恢复、可追踪、能进入真实工作流的工程基础设施。',
        '近期深度参与 Step Realtime CLI、career-ops 等 Agent 生态项目，上游已合并多项 PR；同时持续交付订单、支付、权限、运营后台和生产部署类商业系统。全栈交付是我验证 harness 思维的现实场地。',
      ],
      narrativeTitle: '我的技术论述',
      narrative: [
        '我关注模型能力和真实执行之间的中间层：harness、质量门禁、执行轨迹、恢复路径和工具约束。',
        '我把全栈交付当作 Agent workflow 的验证场，而不是职业方向的上限。',
        '我把 AI 智能体当作协作放大器，但架构边界、工具策略、验证标准和生产质量始终由工程判断主导。',
      ],
      principlesTitle: '工程方法论',
      principles: [
        'Spec-first：先把模糊需求收敛成可验证的执行规约。',
        '默认可靠性：幂等、重试、可观测性在早期就纳入设计。',
        '快速反馈闭环：通过自动化校验和回滚路径降低迭代风险。',
      ],
      workflowTitle: '交付流程',
      workflow: [
        '需求建模：明确边界、接口契约与目标指标。',
        '架构拆分：解耦状态服务、异步任务与前端体验层。',
        '生产强化：监控告警、故障兜底与上线后持续优化。',
      ],
    },
    course: {
      label: '内容产出',
      title: '围绕 Agent Harness 的文章、视频和社群',
      intro:
        '我会持续把 Agent Harness、AI Coding CLI 和真实项目交付经验，沉淀成文章、录制视频，以及可以加入的付费社群。',
      stats: [
        { value: '文章', label: '工程笔记与长文' },
        { value: 'PPT', label: '直播与线下分享' },
        { value: '社群', label: '付费学习小组' },
      ],
      archive: {
        title: 'PPT 归档',
        description: '这里会放我做过的直播、线下分享和 AI 产品相关演讲 PPT。',
        action: '打开 PPT 归档',
        href: 'https://ai-product-talk-guizang-b-production.up.railway.app/',
      },
      supportTitle: '我会持续输出',
      support: [
        '围绕 Agent Harness、AI Coding CLI、工具调用安全、质量门禁和生产交付写文章。',
        '整理直播、线下分享和 AI 产品相关演讲的 PPT。',
        '录制真实开发过程、调试过程、需求拆解和开源贡献复盘视频。',
        '把开源贡献和商业项目里的方法，整理成清单、案例、教程和可复用范式。',
      ],
      outcomeTitle: '你可以如何参与',
      outcomes: [
        '加入付费社群，跟随我的持续产出和实践节奏一起推进。',
        '通过文章和视频系统学习 AI 编程、Agent workflow 和真实交付习惯。',
        '把项目、开源、求职或商业化里的真实问题带进来，做结构化讨论和练习。',
      ],
    },
    stack: {
      label: '核心技术栈',
      title: 'AI 原生工程技术栈',
      groups: [
        {
          title: 'AI 协同',
          items: ['Claude Code', 'LLM Prompt Engineering', 'Agentic Workflow 优化'],
        },
        {
          title: '后端开发',
          items: [
            'Python（FastAPI、异步 API 服务）',
            'Node.js（BFF 与工程工具）',
            'SQLAlchemy + Alembic',
            'Redis（缓存与任务队列）',
          ],
        },
        {
          title: '前端工程',
          items: ['TypeScript', '微信小程序原生', 'Vue.js', 'Tailwind CSS', 'ECharts / D3.js'],
        },
        {
          title: '基础设施',
          items: ['Docker', 'CI/CD', 'API 网关设计', '可观测性'],
        },
      ],
      focusTitle: '当前技术重点',
      focus: [
        'AI Coding CLI 工作流中的 Agent Harness 设计',
        '工具调用安全、评估门禁与测试 harness',
        '用生产级全栈系统验证 Agent workflow 的真实可用性',
      ],
    },
    projects: {
      label: '精选作品',
      title: '项目与案例',
      detailTitle: '技术细节',
      list: [
        {
          name: 'career-ops AI 求职自动化 Agent Pipeline',
          role: 'Top 3 Contributor / Active Maintainer',
          period: '2026.06',
          tech: ['AI Coding CLI', 'Playwright', 'Go TUI', 'Markdown/YAML', 'Batch Worker'],
          points: [
            '参与维护本地优先的 AI 求职自动化 pipeline，覆盖岗位评估、ATS 简历生成、职位扫描、申请追踪、报告归档和批处理 worker。',
            '改进 evaluation gates、report shape validation、tracker/report link normalization、scanner benchmark、feedback learning queue 和多 CLI agent workflow。',
            '把 AI 输出纳入可验证、可恢复、可追踪的工程流程，而不是停留在一次性对话结果。',
          ],
          details: [
            '支持 Claude Code、Codex、Gemini CLI、OpenCode、Qwen、Copilot、Antigravity CLI 等多种 agent CLI 路径。',
            '处理批处理分数格式、tracker 写入、报告链接迁移、重试限流和重复记录规避等稳定性问题。',
            '补充 portals.yml schema、liveness / role-match gate 和表单字段契约保护。',
          ],
        },
        {
          name: 'Step Realtime CLI 语音 Agent CLI',
          role: '核心贡献者 / 上游 PR',
          period: '2026.06',
          tech: ['TypeScript', 'Node.js', 'Realtime Voice', 'Vitest', 'GitHub Actions'],
          points: [
            '参与面向终端 AI 编程助手的实时语音交互与代码执行 CLI，覆盖文本会话、一次性任务、会话恢复、只读计划模式和实时语音对话。',
            '建设 Windows voice install 与运行链路，补齐 PowerShell installer、CI smoke、Windows 11 ARM VM 验证和浏览器音频驱动路径。',
            '合并命令安全策略加固 PR，拦截 AI 工具执行中的高风险命令模式。',
          ],
          details: [
            '覆盖 Chrome / Edge 发现、VAD 安装、runtime driver selection、launcher 兼容和 package build 检查。',
            '补充 tool-policy 回归测试，拦截 base64 编码破坏性命令、find -delete、git clean -fdx、workspace wipe 等危险模式。',
            '根据 maintainer review 完成 rebase、冲突解决、测试迁移和 macOS / Windows 双端验证说明。',
          ],
        },
        {
          name: 'PaopaoChat App',
          role: '全栈开发 / 维护',
          period: '2026.01 - 2026.05',
          tech: ['TypeScript', 'Node.js', 'Redis', 'Docker', 'CI/CD'],
          points: [
            '在项目周期内负责前后端与部署流程的完整工程建设和维护。',
            '通过 AI 协同开发提升稳定性与迭代效率。',
            '完成线上维护、问题修复与迭代功能发布，项目于 2026 年 5 月结束。',
          ],
          details: [
            '设计分层服务边界（UI、API 网关、领域服务、异步 Worker）。',
            '构建上下文持久化与异步任务队列，保证长链路会话稳定性。',
            '增加结构化日志、请求链路 ID 与健康检查，提升故障排查效率。',
          ],
        },
        {
          name: '得到影像在线修图订单小程序',
          role: '全栈开发工程师',
          period: '2026.02 - 至今',
          tech: ['微信小程序原生', 'FastAPI', 'SQLAlchemy', 'Alembic', '运营后台'],
          points: [
            '交付了小程序前端 + FastAPI 后端 + 运营管理后台的一体化系统。',
            '完成客户、销售、修图师、组长/管理端的角色化业务流程建设。',
            '补齐订单、积分、发票、通知、统计中心等核心模块并推进上线。',
          ],
          details: [
            '后端按 `common/sales/customer/retoucher/leader_admin` 进行路由分层，在 `/api/v1` 下统一管理并配套统一异常响应。',
            '数据库层兼容 SQLite/MySQL，并通过 Alembic 做结构迁移与版本演进。',
            '新增订单汇总、客户发票统计、绩效统计等报表接口；版本交付记录中自动化测试结果为 33 项通过。',
          ],
        },
        {
          name: 'InsightHub | 多模态 AI 工程化落地',
          role: '工程负责人',
          period: '2025.12 - 2026.02',
          tech: ['Python', '模型推理', '数据管道', '实时看板'],
          points: [
            '联手斯坦福全球前 2% 科学家团队，在香港 Hotel Icon 完成平台工程化实施。',
            '完成 TikTok 与小红书营销数据的多模态云端推理部署与路径优化。',
            '构建高并发可视化看板，实现实时监控与决策支持。',
          ],
          details: [
            '构建文本/视频特征的多模态数据接入管道，支持批处理与流处理混合模式。',
            '为外部不稳定数据源加入重试机制与死信处理策略。',
            '监控推理延迟、模型漂移信号与队列积压深度。',
          ],
        },
        {
          name: 'Ralph Desktop | AI Agent 视觉控制中心',
          role: '贡献者',
          period: '2026.01 - 至今',
          tech: ['Agent Loop', '持久化协议', '状态机', '可视化反馈'],
          points: [
            '优化智能体执行循环，提升模糊需求到可执行结果的转换精度。',
            '改进需求迭代模块，利用持久化协议保障复杂逻辑下上下文一致性。',
            '增强执行路径反馈，降低大规模重构中的系统熵增。',
          ],
          details: [
            '优化 Loop 状态机，补充关键检查点与异常恢复路径。',
            '改进上下文压缩策略，提升长会话中的 token 预算利用率。',
            '参与执行轨迹可视化，降低调试与意图对齐成本。',
          ],
        },
        {
          name: '海外虚拟电商平台',
          role: '全栈负责人',
          period: '2025.06 - 2025.12',
          tech: ['后端 API', 'Redis', '支付网关', '订单引擎'],
          points: [
            '从零构建高频虚拟资产交易系统，累计流水超过 20w RMB。',
            '完成自动化履约流和安全支付网关集成，显著降低人工成本。',
          ],
          details: [
            '设计事件驱动订单状态机，支持支付回调幂等处理。',
            '增加限流与异常行为检测，提高交易安全性。',
            '构建异步对账任务，提升资金与履约一致性。',
          ],
        },
      ],
    },
    contact: {
      label: '联系',
      title: '欢迎交流合作',
      cards: [
        {
          label: '邮箱',
          value: 'cuidong111@gmail.com',
          href: 'mailto:cuidong111@gmail.com',
        },
        {
          label: 'GitHub',
          value: 'github.com/luochen211',
          href: 'https://github.com/luochen211',
        },
        { label: '域名', value: 'luo-chen.com', href: 'https://luo-chen.com' },
        {
          label: '微信',
          value: 'luo002chen',
          note: '扫码添加微信',
          qrSrc: '/wechat-qr.png',
          qrAlt: '微信二维码',
        },
      ],
    },
    footer: 'Agent Harness 工程师与全栈实践者',
  },
}

const expertOptions = [
  {
    id: 'munger',
    name: '查理·芒格',
    title: '反常识商业判断',
    stance: '用逆向思维、机会成本、激励机制和长期复利来拆问题。',
  },
  {
    id: 'kahneman',
    name: '丹尼尔·卡尼曼',
    title: '认知偏差校准',
    stance: '识别快思考误判、基准率忽略、损失厌恶和过度自信。',
  },
  {
    id: 'dalio',
    name: '雷·达里奥',
    title: '原则与系统循环',
    stance: '把议题放进因果链、债务周期、反馈机制和原则清单里看。',
  },
  {
    id: 'christensen',
    name: '克莱顿·克里斯坦森',
    title: '创新与任务理论',
    stance: '追问用户真正雇佣这个方案完成什么任务，以及旧方案为何失效。',
  },
  {
    id: 'drucker',
    name: '彼得·德鲁克',
    title: '管理与有效性',
    stance: '关注目标、贡献、组织责任和真正需要被衡量的结果。',
  },
  {
    id: 'taleb',
    name: '纳西姆·塔勒布',
    title: '风险与反脆弱',
    stance: '寻找尾部风险、脆弱性、杠铃策略和经不起现实打击的假设。',
  },
]

const exampleTopics = [
  '我是否应该把 AI 编程课从低价社群升级成高客单顾问产品？',
  '一个独立开发者应该先做工具产品，还是先做内容和服务？',
  '如果我要做个人品牌，短期赚钱和长期可信度之间怎么取舍？',
]

function RoundtablePage() {
  const [topic, setTopic] = useState(exampleTopics[0])
  const [selected, setSelected] = useState(['munger', 'kahneman', 'dalio'])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectedExperts = expertOptions.filter((expert) => selected.includes(expert.id))

  function toggleExpert(id) {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id)
      }
      return [...current, id]
    })
  }

  async function runRoundtable(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!topic.trim()) {
      setError('先输入一个值得讨论的问题。')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/roundtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, experts: selectedExperts }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || '圆桌生成失败，请稍后再试。')
      }

      setResult(payload)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="roundtable-page">
      <div className="roundtable-hero reveal">
        <p className="eyebrow">MULTI-AGENT EXPERT ROOM</p>
        <h1>专家圆桌聊天室</h1>
        <p>
          把一个问题交给多种思想模型同时审视：先交锋，再收束，最后形成可执行判断。
        </p>
      </div>

      <form className="roundtable-workspace reveal" onSubmit={runRoundtable}>
        <div className="roundtable-input">
          <label htmlFor="topic">议题</label>
          <textarea
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            rows="7"
            placeholder="输入你正在纠结的商业、产品、职业或投资判断..."
          />
          <div className="example-row">
            {exampleTopics.map((example) => (
              <button key={example} type="button" onClick={() => setTopic(example)}>
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="expert-picker">
          <div className="picker-head">
            <span>选择专家</span>
            <strong>{selected.length} 位</strong>
          </div>
          <div className="expert-grid">
            {expertOptions.map((expert) => {
              const active = selected.includes(expert.id)
              return (
                <button
                  className={`expert-tile ${active ? 'active' : ''}`}
                  key={expert.id}
                  type="button"
                  onClick={() => toggleExpert(expert.id)}
                  aria-pressed={active}
                >
                  <span>{expert.name}</span>
                  <strong>{expert.title}</strong>
                  <small>{expert.stance}</small>
                </button>
              )
            })}
          </div>
          <button className="btn primary roundtable-submit" type="submit" disabled={isLoading}>
            {isLoading ? '圆桌讨论中...' : '开始圆桌'}
          </button>
          {error ? <p className="roundtable-error">{error}</p> : null}
        </div>
      </form>

      {isLoading ? (
        <div className="roundtable-loading reveal">
          <span />
          <p>几位专家正在从各自的方法论出发拆解同一个问题。</p>
        </div>
      ) : null}

      {result ? (
        <div className="roundtable-result reveal">
          <div className="section-head">
            <p>Discussion</p>
            <h2>{result.topic}</h2>
          </div>
          <div className="turn-list">
            {result.turns?.map((turn, index) => (
              <article className="turn-item" key={`${turn.expert}-${index}`}>
                <div>
                  <span>{turn.expert}</span>
                  <strong>{turn.angle}</strong>
                </div>
                <p>{turn.argument}</p>
              </article>
            ))}
          </div>

          <div className="judge-panel">
            <p>主持人总结</p>
            <h3>{result.judge?.verdict}</h3>
            <div className="judge-grid">
              <ResultList title="真正有洞察" items={result.judge?.insights} />
              <ResultList title="核心冲突" items={result.judge?.conflicts} />
              <ResultList title="仍然盲区" items={result.judge?.blindSpots} />
              <ResultList title="下一步行动" items={result.judge?.actions} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function ResultList({ title, items = [] }) {
  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function HomePage({ t }) {
  const capabilities = [
    {
      title: t.summary.narrativeTitle,
      items: t.summary.narrative,
      tone: 'large',
    },
    {
      title: t.summary.principlesTitle,
      items: t.summary.principles,
      tone: 'medium',
    },
    {
      title: t.stack.focusTitle,
      items: t.stack.focus,
      tone: 'compact',
    },
    {
      title: t.summary.workflowTitle,
      items: t.summary.workflow,
      tone: 'medium',
      ordered: true,
    },
    {
      title: t.course.label,
      items: [t.course.intro],
      tone: 'medium',
    },
    {
      title: t.hero.manifestoLabel,
      items: [t.hero.manifesto],
      tone: 'medium',
    },
  ]

  return (
    <div className="home-flow">
      <section className="hero-content hero-scene">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="intro">{t.hero.intro}</p>
          <div className="actions">
            <Link className="btn primary" to="/work">
              {t.hero.primaryAction}
            </Link>
            <Link className="btn ghost" to="/contact">
              {t.hero.secondaryAction}
            </Link>
          </div>
          <p className="meta-line hero-meta">
            {t.hero.meta}
            <a href="https://github.com/luochen211" target="_blank" rel="noreferrer">
              github.com/luochen211
            </a>
            <a href="mailto:cuidong111@gmail.com">cuidong111@gmail.com</a>
          </p>
        </div>

        <div className="hero-visual">
          <div className="avatar-frame hero-portrait">
            <img
              src="/头像111.jpg"
              alt={t.hero.avatarAlt}
              width="940"
              height="938"
              fetchPriority="high"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
                event.currentTarget.parentElement?.classList.add('avatar-fallback')
              }}
            />
            <span className="avatar-fallback-text">CD</span>
          </div>
          <div className="hero-panel">
            <p>{t.hero.manifestoLabel}</p>
            <blockquote>{t.hero.manifesto}</blockquote>
          </div>
        </div>
      </section>

      <SummarySection t={t} />
      <section className="capability-matrix page-section">
        {capabilities.map((capability, index) => {
          const ListTag = capability.ordered ? 'ol' : 'ul'
          return (
            <article
              className={`capability-tile reveal ${capability.tone}`}
              key={capability.title}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{capability.title}</h3>
              <ListTag>
                {capability.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ListTag>
            </article>
          )
        })}
      </section>
      <CourseSection t={t} />
      <StackSection t={t} />
    </div>
  )
}

function NowPage({ t }) {
  const nowSections = [
    {
      key: 'learning',
      title: t.now.learningTitle,
      items: t.now.learning,
      variant: 'focus',
    },
    {
      key: 'career',
      title: t.now.careerTitle,
      items: t.now.career,
      variant: 'career',
    },
    {
      key: 'building',
      title: t.now.buildingTitle,
      items: t.now.building,
      variant: 'building',
    },
    {
      key: 'routine',
      title: t.now.routineTitle,
      items: t.now.routine,
      variant: 'routine',
    },
  ]

  return (
    <section className="page-section now-page">
      <div className="section-head reveal">
        <p>{t.now.label}</p>
        <h2>{t.now.title}</h2>
      </div>

      <div className="now-mindset reveal">
        <span>{t.now.mindsetTitle}</span>
        <p>{t.now.mindset}</p>
      </div>

      <div className="now-stack">
        {nowSections.map((section, index) => (
          <article className={`now-entry reveal ${section.variant}`} key={section.key}>
            <div className="now-entry-head">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{section.title}</h3>
            </div>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function SummarySection({ t }) {
  return (
    <section className="page-section editorial-section">
      <div className="section-head reveal">
        <p>{t.summary.label}</p>
        <h2>{t.summary.title}</h2>
      </div>
      <div className="about-panel reveal">
        {t.summary.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

function CourseSection({ t, standalone = false }) {
  return (
    <section className="page-section course-section">
      <div className="section-head reveal">
        <p>{t.course.label}</p>
        <h2>{t.course.title}</h2>
      </div>
      <div className="course-archive reveal">
        <div className="course-lead">
          <p className="course-intro">{t.course.intro}</p>
          <ul className="course-stats">
            {t.course.stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <article>
          <h3>{t.course.supportTitle}</h3>
          <ul className="list-tight">
            {t.course.support.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{t.course.outcomeTitle}</h3>
          <ul className="list-tight">
            {t.course.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      {standalone ? (
        <>
          <a
            className="course-fit course-link reveal"
            href={t.course.archive.href}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t.course.archive.action}</span>
            <h3>{t.course.archive.title}</h3>
            <p>{t.course.archive.description}</p>
          </a>
          <div className="course-fit reveal">
            <h3>{t.now.careerTitle}</h3>
            <ul className="list-tight">
              {t.now.career.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </section>
  )
}

function StackSection({ t }) {
  return (
    <section className="page-section stack-section">
      <div className="section-head reveal">
        <p>{t.stack.label}</p>
        <h2>{t.stack.title}</h2>
      </div>
      <div className="stack-grid">
        {t.stack.groups.map((group) => (
          <article className="stack-column reveal" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="stack-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProjectsPage({ t }) {
  return (
    <section className="page-section work-archive">
      <div className="section-head reveal">
        <p>{t.projects.label}</p>
        <h2>{t.projects.title}</h2>
      </div>
      <div className="timeline">
        {t.projects.list.map((project, index) => (
          <article className="timeline-item reveal" key={project.name}>
            <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
            <div className="project-head">
              <h3>
                {project.link ? (
                  <a
                    className="project-title-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              <span>{project.period}</span>
            </div>
            <p className="project-role">{project.role}</p>
            <div className="chip-row">
              {project.tech.map((tech) => (
                <span className="chip" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
            <ul className="project-points">
              {project.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="project-detail-title">{t.projects.detailTitle}</p>
            <ul className="project-details">
              {project.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function OutputPage({ t }) {
  return <CourseSection t={t} standalone />
}

function ContactPage({ t }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.contact.label}</p>
        <h2>{t.contact.title}</h2>
      </div>
      <div className="contact-grid">
        {t.contact.cards.map((card) => {
          const isLink = Boolean(card.href)
          const linkProps = isLink
            ? {
                href: card.href,
                target: card.href.startsWith('mailto:') ? undefined : '_blank',
                rel: card.href.startsWith('mailto:') ? undefined : 'noreferrer',
              }
            : {}

          return (
            <a className="contact-card reveal" key={card.value} {...linkProps}>
              <p>{card.label}</p>
              <h3>{card.value}</h3>
              {card.note ? <span className="contact-note">{card.note}</span> : null}
              {card.qrSrc ? (
                <img
                  className="contact-qr"
                  src={card.qrSrc}
                  alt={card.qrAlt || `${card.label} QR code`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
            </a>
          )
        })}
      </div>
    </section>
  )
}

function SiteApp() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem('site-locale')
    return saved === 'zh' ? 'zh' : 'en'
  })
  const location = useLocation()
  const t = content[locale]

  useEffect(() => {
    window.localStorage.setItem('site-locale', locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = t.seoTitle
  }, [locale, t.seoTitle])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
          }
        })
      },
      { threshold: 0.16 },
    )

    const revealItems = document.querySelectorAll('.reveal')
    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [location.pathname, locale])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-copy > *',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
        },
      )

      gsap.fromTo(
        '.hero-visual',
        { opacity: 0, y: 42, rotate: -1.5 },
        { opacity: 1, y: 0, rotate: 0, duration: 1.1, ease: 'power3.out', delay: 0.12 },
      )

      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.78, y: 26 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              end: 'top 42%',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray('.capability-tile').forEach((tile) => {
        gsap.fromTo(
          tile,
          { scale: 0.96, opacity: 0.42 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: tile,
              start: 'top 92%',
              end: 'top 58%',
              scrub: true,
            },
          },
        )
      })
    })

    return () => context.revert()
  }, [location.pathname, locale])

  return (
    <div className="page">
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="topbar container">
        <nav className="nav">
          <Link className="brand" to="/">
            luo-chen.com
          </Link>
          <div className="nav-right">
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                {t.nav.home}
              </NavLink>
              <NavLink to="/now" className={({ isActive }) => (isActive ? 'active' : '')}>
                {t.nav.now}
              </NavLink>
              <NavLink
                to="/work"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t.nav.work}
              </NavLink>
              <NavLink
                to="/output"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t.nav.output}
              </NavLink>
              <a
                href={t.course.archive.href}
                target="_blank"
                rel="noreferrer"
              >
                {t.nav.ppt}
              </a>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t.nav.contact}
              </NavLink>
            </div>
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLocale((current) => (current === 'en' ? 'zh' : 'en'))}
            >
              {t.toggle}
            </button>
          </div>
        </nav>
      </header>

      <main className="container route-main">
        <Routes>
          <Route path="/" element={<HomePage t={t} />} />
          <Route path="/now" element={<NowPage t={t} />} />
          <Route path="/roundtable" element={<RoundtablePage />} />
          <Route path="/work" element={<ProjectsPage t={t} />} />
          <Route path="/projects" element={<Navigate replace to="/work" />} />
          <Route path="/output" element={<OutputPage t={t} />} />
          <Route path="/course" element={<Navigate replace to="/output" />} />
          <Route path="/contact" element={<ContactPage t={t} />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>

      <footer className="footer container">
        <p>
          © {new Date().getFullYear()} {t.footer}
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteApp />
    </BrowserRouter>
  )
}

export default App
