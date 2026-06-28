import { useEffect, useState } from 'react'
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

const content = {
  en: {
    seoTitle: 'AI Coding Engineer & Full-Stack Builder',
    nav: {
      home: 'Home',
      now: 'Now',
      roundtable: 'Roundtable',
      summary: 'Summary',
      stack: 'Stack',
      work: 'Work',
      course: 'Course',
      contact: 'Contact',
    },
    toggle: '中文',
    hero: {
      eyebrow: 'AI-NATIVE CODING ENGINEER',
      title: 'AI Coding Engineer & Full-Stack Builder',
      meta: 'AI Agent Engineering | Full-Stack Delivery |',
      intro:
        'I build AI-native engineering workflows and production business systems, from agent tooling and quality gates to full-stack delivery.',
      manifestoLabel: 'Personal Manifesto',
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
      title: 'What I am focused on (February 2026)',
      learningTitle: 'Learning',
      learning: [
        'Improving English every day: listening, speaking practice, and technical writing.',
        'Training for remote collaboration in international teams with asynchronous communication habits.',
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
        'Continuing feature delivery and operations for the Image Retouching Order Mini Program.',
        'Updating this personal site as a living record of work and growth.',
      ],
      routineTitle: 'Weekly Routine',
      routine: [
        'Strength training every week to keep energy, posture, and execution stable.',
        'Practicing yoga regularly for mobility, breathing, recovery, and long-term focus.',
      ],
      mindsetTitle: 'Current Mindset',
      mindset:
        'Stay consistent, train the body, communicate clearly, and keep improving in small but meaningful steps.',
    },
    summary: {
      label: 'Professional Summary',
      title: 'Converting Complex Requirements Into Reliable Systems',
      paragraphs: [
        'I am a computer-science-trained engineer focused on AI Agent engineering, AI Coding CLI tooling, and production full-stack delivery.',
        'My recent work spans merged upstream PRs in Agent CLI / career automation projects, plus commercial systems covering orders, payment callbacks, role permissions, operations dashboards, and production deployment.',
      ],
      narrativeTitle: 'My Engineering Narrative',
      narrative: [
        'I work from problem framing to production operations, not just feature implementation.',
        'I prioritize high Sharpe-ratio output: measurable impact, lower system entropy, and stable iteration speed.',
        'I treat AI agents as engineering collaborators, but keep strong human control over architecture and quality gates.',
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
      label: 'AI Monetization Course',
      title: 'I Am Running an AI Coding Commercialization Program',
      intro:
        'I am currently running a practical AI coding commercialization course focused on real delivery, client communication, and order conversion.',
      stats: [
        { value: '30+', label: 'Members in Learning Group' },
        { value: '4-Digit', label: 'Orders Landed by Students' },
        { value: 'Live', label: 'Ongoing Mentorship' },
      ],
      supportTitle: 'What I Provide',
      support: [
        'From skill packaging to offer design for AI coding services.',
        'Hands-on support for client requirement breakdown and quote strategy.',
        'Practical guidance on delivery workflow, acceptance, and repeat-order conversion.',
      ],
      outcomeTitle: 'Current Outcomes',
      outcomes: [
        'The community already has dozens of active members learning and practicing together.',
        'I have helped part of the group secure four-digit freelance orders.',
        'The focus is to keep building repeatable, execution-first business results.',
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
        'Prompt-to-production workflow with AI coding agents',
        'Modular architecture for 10k+ LOC codebases',
        'Operational metrics design for product and model systems',
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
    footer: 'AI Coding Engineer & Full-Stack Builder',
  },
  zh: {
    seoTitle: 'AI 编程工程师与全栈实践者',
    nav: {
      home: '首页',
      now: 'Now',
      roundtable: '专家圆桌',
      summary: '综述',
      stack: '技术栈',
      work: '作品',
      course: '课程',
      contact: '联系',
    },
    toggle: 'EN',
    hero: {
      eyebrow: 'AI 编程工程师',
      title: 'AI 编程工程师与全栈实践者',
      meta: 'AI Agent 工程化 | 全栈交付 |',
      intro:
        '专注 AI Agent / AI Coding CLI 工程化与生产级业务系统交付，覆盖工具链、质量门禁、全栈开发和上线运维。',
      manifestoLabel: '个人宣言',
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
      title: '我最近在做什么（2026年2月）',
      learningTitle: '学习中',
      learning: [
        '持续学习英语：听力、口语表达和技术写作同步推进。',
        '针对海外远程协作场景，训练异步沟通与英文文档表达能力。',
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
        '继续推进“得到影像在线修图订单小程序”的功能交付与线上运营支持。',
        '把个人网站作为长期更新的成长记录。',
      ],
      routineTitle: '长期习惯',
      routine: [
        '每周坚持撸铁，保持体能、姿态和稳定执行力。',
        '持续练习瑜伽，用来提升柔韧性、呼吸、恢复能力和长期专注。',
      ],
      mindsetTitle: '当前状态',
      mindset: '保持稳定节奏，训练身体，真诚沟通，持续做出看得见的进步。',
    },
    summary: {
      label: '职业综述',
      title: '将复杂需求转化为稳定可用的系统',
      paragraphs: [
        '具备计算机科班背景，重点关注 AI Agent 工程化、AI Coding CLI 工具链和生产级全栈系统交付。',
        '近期深度参与 Step Realtime CLI、career-ops 等 Agent 生态项目，上游已合并多项 PR；同时持续交付订单、支付、权限、运营后台和生产部署类商业系统。',
      ],
      narrativeTitle: '我的技术论述',
      narrative: [
        '我不只关注“功能完成”，更关注从需求抽象到线上稳定运行的完整链路。',
        '我追求高夏普比率技术产出：更高业务价值、更低系统熵增、更可持续迭代速度。',
        '我把 AI 智能体当作协作放大器，但架构边界与质量标准始终由工程判断主导。',
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
      label: 'AI 编程商业化课程',
      title: '我正在做一门 AI 编程商业化实战课程',
      intro:
        '目前我在持续推进一门 AI 编程商业化课程，核心是围绕真实交付、客户沟通和商单转化，带大家把技能变成稳定收入。',
      stats: [
        { value: '30+', label: '学习群成员' },
        { value: '四位数', label: '已落地商单' },
        { value: '进行中', label: '实战陪跑' },
      ],
      supportTitle: '我提供的支持',
      support: [
        '从 AI 编程能力包装到服务报价方案设计。',
        '陪跑拆解客户需求，明确范围、报价与交付节奏。',
        '结合真实项目训练交付流程、验收与复购转化。',
      ],
      outcomeTitle: '阶段成果',
      outcomes: [
        '社群里已经有几十位同学在持续学习和实战。',
        '我已帮助其中一部分同学拿到四位数商单。',
        '接下来会继续沉淀可复制的商业化打法与案例。',
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
        '从 Prompt 到生产交付的 AI 编程工作流',
        '万行级代码库的模块化重构与工程可维护性',
        '面向产品与模型系统的可观测指标设计',
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
    footer: 'AI 编程工程师与全栈实践者',
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
  return (
    <>
      <section className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="meta-line">
            {t.hero.meta}
            <a href="https://github.com/luochen211" target="_blank" rel="noreferrer">
              github.com/luochen211
            </a>
            |
            <a href="mailto:cuidong111@gmail.com">cuidong111@gmail.com</a>
          </p>
          <p className="intro">{t.hero.intro}</p>
          <div className="actions">
            <Link className="btn primary" to="/work">
              {t.hero.primaryAction}
            </Link>
            <Link className="btn ghost" to="/contact">
              {t.hero.secondaryAction}
            </Link>
          </div>
          <ul className="stats">
            {t.hero.stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
          <div className="manifesto-card">
            <p>{t.hero.manifestoLabel}</p>
            <blockquote>{t.hero.manifesto}</blockquote>
          </div>
        </div>

        <div className="hero-avatar">
          <div className="avatar-frame">
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
        </div>
      </section>
      <SummarySection t={t} />
      <CourseSection t={t} />
      <StackSection t={t} />
    </>
  )
}

function NowPage({ t }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.now.label}</p>
        <h2>{t.now.title}</h2>
      </div>
      <div className="now-grid">
        <article className="card reveal">
          <h3>{t.now.learningTitle}</h3>
          <ul className="list-tight">
            {t.now.learning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card reveal">
          <h3>{t.now.careerTitle}</h3>
          <ul className="list-tight">
            {t.now.career.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card reveal">
          <h3>{t.now.buildingTitle}</h3>
          <ul className="list-tight">
            {t.now.building.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card reveal">
          <h3>{t.now.routineTitle}</h3>
          <ul className="list-tight">
            {t.now.routine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="card now-mindset reveal">
        <h3>{t.now.mindsetTitle}</h3>
        <p>{t.now.mindset}</p>
      </div>
    </section>
  )
}

function SummarySection({ t }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.summary.label}</p>
        <h2>{t.summary.title}</h2>
      </div>
      <div className="about-panel reveal">
        {t.summary.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="summary-grid">
        <article className="card reveal">
          <h3>{t.summary.narrativeTitle}</h3>
          <ul className="list-tight">
            {t.summary.narrative.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card reveal">
          <h3>{t.summary.principlesTitle}</h3>
          <ul className="list-tight">
            {t.summary.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card reveal">
          <h3>{t.summary.workflowTitle}</h3>
          <ol className="workflow-list">
            {t.summary.workflow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  )
}

function CourseSection({ t, standalone = false }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.course.label}</p>
        <h2>{t.course.title}</h2>
      </div>
      <div className="card reveal">
        <p className="course-intro">{t.course.intro}</p>
      </div>
      <ul className="course-stats reveal">
        {t.course.stats.map((stat) => (
          <li key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>
      <div className="summary-grid">
        <article className="card reveal">
          <h3>{t.course.supportTitle}</h3>
          <ul className="list-tight">
            {t.course.support.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card reveal">
          <h3>{t.course.outcomeTitle}</h3>
          <ul className="list-tight">
            {t.course.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      {standalone ? (
        <div className="card course-fit reveal">
          <h3>{t.now.careerTitle}</h3>
          <ul className="list-tight">
            {t.now.career.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

function StackSection({ t }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.stack.label}</p>
        <h2>{t.stack.title}</h2>
      </div>
      <div className="stack-grid">
        {t.stack.groups.map((group) => (
          <article className="card reveal" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="stack-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="card focus-card reveal">
        <h3>{t.stack.focusTitle}</h3>
        <ul className="list-tight">
          {t.stack.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectsPage({ t }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.projects.label}</p>
        <h2>{t.projects.title}</h2>
      </div>
      <div className="timeline">
        {t.projects.list.map((project) => (
          <article className="timeline-item reveal" key={project.name}>
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

function CoursePage({ t }) {
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
                to="/course"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t.nav.course}
              </NavLink>
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
          <Route path="/course" element={<CoursePage t={t} />} />
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
