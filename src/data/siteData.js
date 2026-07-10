export const projects = [
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
]

export const expertOptions = [
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

export const exampleTopics = [
  '我是否应该把 AI 编程课从低价社群升级成高客单顾问产品？',
  '一个独立开发者应该先做工具产品，还是先做内容和服务？',
  '如果我要做个人品牌，短期赚钱和长期可信度之间怎么取舍？',
]

export const writingColumns = [
  {
    slug: 'where-do-we-go',
    title: '我们将何去何从',
    eyebrow: 'ONGOING TOPIC',
    status: '持续更新',
    summary:
      'AI 时代下个体如何重新选择：不只选职业，也选市场、作品、关系、收入结构和身体秩序。',
    href: '/topics/where-do-we-go',
    series: [
      {
        slug: 'preface',
        title: '序章：旧坐标正在失效',
        summary: '先把问题说清楚：过去那套坐标为什么不再稳定。',
        articles: [
          {
            slug: '2026-07-05-where-do-we-go-preface',
            title: '我们将何去何从：旧坐标失效之后',
            date: '2026-07-05',
            summary:
              '旧坐标失效后，每个人都要重新回答：我靠什么被定价，靠什么被信任，靠什么走远。',
            tags: ['AI时代', '个人战略', '职业发展'],
            related: [
              '2026-07-05-stop-low-value-outsourcing',
              '2026-07-05-english-is-remote-work-ticket',
              '2026-07-05-knowledge-product-is-leverage',
            ],
          },
        ],
      },
      {
        slug: 'position',
        title: '重新定价自己',
        summary: '停止低价值忙碌，把时间投向能抬高位置的机会。',
        articles: [
          {
            slug: '2026-07-05-stop-low-value-outsourcing',
            title: '别让低价值现金流，吞掉你的未来位置',
            date: '2026-07-05',
            summary:
              '最危险的不是穷，而是被低价值现金流训练成低价值的人。它会切碎时间、压低标准，让人越来越难进入更大的机会池。',
            tags: ['低价值交付', '职业选择', '职业发展'],
            related: [
              '2026-07-05-internship-is-strategic-attempt',
              '2026-07-05-resume-needs-breakthrough-projects',
              '2026-07-05-relaxed-state-is-long-term-edge',
            ],
          },
          {
            slug: '2026-07-05-internship-is-strategic-attempt',
            title: '别用现在的自己，拒绝高势能机会',
            date: '2026-07-05',
            summary: '真正改变位置的机会，往往不是你现在配得上的，而是你需要提前冲刺的。',
            tags: ['高势能机会', 'AI', '职业发展'],
            related: [
              '2026-07-05-stop-low-value-outsourcing',
              '2026-07-05-resume-needs-breakthrough-projects',
              '2026-07-05-open-source-is-career-asset',
            ],
          },
        ],
      },
      {
        slug: 'public-assets',
        title: '进入更大市场',
        summary: '用英语、公开作品和强信号进入更大的协作网络。',
        articles: [
          {
            slug: '2026-07-05-english-is-remote-work-ticket',
            title: '英语不是加分项，是进入更大市场的通行证',
            date: '2026-07-05',
            summary:
              '英语真正改变的不是表达能力，而是你能进入哪个协作网络、哪个价格体系，以及和谁一起工作。',
            tags: ['英语', '远程工作', '全球协作'],
            related: [
              '2026-07-05-open-source-is-career-asset',
              '2026-07-05-programmers-need-social-surface',
              '2026-07-05-resume-needs-breakthrough-projects',
            ],
          },
          {
            slug: '2026-07-05-open-source-is-career-asset',
            title: '公开作品比私下交付更像职业资产',
            date: '2026-07-05',
            summary:
              '私下交付证明你能完成任务，公开作品证明你能被看见、被验证，并进入更高质量的协作网络。',
            tags: ['公开作品', '职业资产', '协作网络'],
            related: [
              '2026-07-05-english-is-remote-work-ticket',
              '2026-07-05-resume-needs-breakthrough-projects',
              '2026-07-05-programmers-need-social-surface',
            ],
          },
          {
            slug: '2026-07-05-resume-needs-breakthrough-projects',
            title: '你的履历不需要很满，只需要有强信号',
            date: '2026-07-05',
            summary: '别人记住你的方式，不是你做过很多事，而是你在某个方向上有强信号。',
            tags: ['履历', '作品资产', '职业发展'],
            related: [
              '2026-07-05-open-source-is-career-asset',
              '2026-07-05-stop-low-value-outsourcing',
              '2026-07-05-internship-is-strategic-attempt',
            ],
          },
        ],
      },
      {
        slug: 'trust-network',
        title: '建立信任半径',
        summary: '进入连接、训练表达，也在热闹里保住判断权。',
        articles: [
          {
            slug: '2026-07-05-programmers-need-social-surface',
            title: '只会做事的人，很容易输给会被信任的人',
            date: '2026-07-05',
            summary:
              '一个人越往上走，越不是只靠专业能力竞争，而是靠信任、表达和协作半径竞争。',
            tags: ['社交能力', '知识工作者', '职业发展'],
            related: [
              '2026-07-05-less-contact-zhongdeng',
              '2026-07-05-english-is-remote-work-ticket',
              '2026-07-05-open-source-is-career-asset',
            ],
          },
          {
            slug: '2026-07-05-less-contact-zhongdeng',
            title: '成年人最该守住的，是热闹里的判断权',
            date: '2026-07-05',
            summary:
              '陌生场合会制造临时安全感，但不是所有连接都值得深入。真正重要的是在热闹里保住自己的准则。',
            tags: ['关系', '自我判断', '内在准则'],
            related: [
              '2026-07-05-programmers-need-social-surface',
              '2026-07-05-relaxed-state-is-long-term-edge',
              '2026-07-04-offline-ppt-reflection',
            ],
          },
        ],
      },
      {
        slug: 'leverage-order',
        title: '把经验变成杠杆',
        summary: '从一次性交付走向可复用系统，同时保住长期状态。',
        articles: [
          {
            slug: '2026-07-05-knowledge-product-is-leverage',
            title: '不要只卖时间，要把经验做成系统',
            date: '2026-07-05',
            summary:
              '一个人真正的跃迁，是把经验从一次性交付变成可复用系统，让收入结构开始有杠杆。',
            tags: ['知识付费', '杠杆', '产品化'],
            related: [
              '2026-07-05-stop-low-value-outsourcing',
              '2026-07-05-open-source-is-career-asset',
              '2026-07-05-relaxed-state-is-long-term-edge',
            ],
          },
          {
            slug: '2026-07-05-relaxed-state-is-long-term-edge',
            title: '长期紧绷的人，最容易失去未来',
            date: '2026-07-05',
            summary: '长期紧绷的人，看似努力，其实是在用短期安全感毁掉长期判断力。',
            tags: ['松弛感', '长期主义', '健康'],
            related: [
              '2026-07-05-knowledge-product-is-leverage',
              '2026-07-05-less-contact-zhongdeng',
              '2026-07-05-stop-low-value-outsourcing',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'agent-harness',
    title: 'Agent Harness 实践',
    eyebrow: 'ENGINEERING NOTES',
    status: '预留栏目',
    summary: '工具调用安全、评估门禁、AI Coding CLI、多 Agent 工作流和开源贡献复盘。',
    href: '/columns/agent-harness',
    series: [],
  },
  {
    slug: 'expression-review',
    title: '表达与复盘',
    eyebrow: 'PUBLIC OUTPUT',
    status: '持续更新',
    summary: '公开分享、PPT、内容表达和沟通失败复盘。',
    href: '/columns/expression-review',
    series: [
      {
        slug: 'offline-sharing',
        title: '公开表达复盘',
        summary: '把分享里的失败拆开，重新训练入口、案例、动作和反馈。',
        articles: [
          {
            slug: '2026-07-04-offline-ppt-reflection',
            title: '我以为我在分享，其实我在自说自话',
            date: '2026-07-04',
            summary:
              '这场线下分享真正失败的地方，不是 PPT 不够漂亮，而是我没有和听众发生交流。',
            tags: ['PPT', '线下分享', '内容表达'],
            related: [
              '2026-07-05-programmers-need-social-surface',
              '2026-07-05-open-source-is-career-asset',
              '2026-07-05-less-contact-zhongdeng',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'after-watching',
    title: '看完之后',
    eyebrow: 'AFTER WATCHING',
    status: '持续更新',
    summary: '不做评分，不复述剧情，只讲一部作品留在人身上的那道痕。',
    href: '/columns/after-watching',
    series: [
      {
        slug: 'screen-and-book-notes',
        title: '影视与书的回声',
        summary: '借影视剧和书，讲人为什么会这样活。',
        articles: [
          {
            slug: '2026-07-09-after-watching-dragon-year-archive',
            title: '看完《龙年档案》之后：我尊重罗成，但我不会成为罗成',
            date: '2026-07-09',
            summary:
              '有些人值得敬佩，但不适合被模仿。看完《龙年档案》之后，我更清楚地承认：我尊重罗成，也承认自己不是罗成。',
            tags: ['看完之后', '龙年档案', '罗成', '普通人'],
            related: ['2026-07-05-less-contact-zhongdeng', '2026-07-04-offline-ppt-reflection'],
          },
        ],
      },
    ],
  },
  {
    slug: 'project-reviews',
    title: '项目复盘',
    eyebrow: 'CASE NOTES',
    status: '预留栏目',
    summary: '真实项目、商业交付、开源贡献和产品迭代里的方法复盘。',
    href: '/columns/project-reviews',
    series: [],
  },
]

export const articleIndex = writingColumns.flatMap((column) =>
  column.series.flatMap((series) =>
    series.articles.map((article, index) => ({
      ...article,
      href: `/articles/${article.slug}`,
      column: {
        slug: column.slug,
        title: column.title,
        href: column.href,
      },
      series: {
        slug: series.slug,
        title: series.title,
        href: `${column.href}#${series.slug}`,
      },
      order: index,
    })),
  ),
)

export const getPublicColumns = () =>
  writingColumns.filter((column) =>
    column.series.some((series) => series.articles.length > 0),
  )

export const findColumn = (slug) =>
  getPublicColumns().find((column) => column.slug === slug)
