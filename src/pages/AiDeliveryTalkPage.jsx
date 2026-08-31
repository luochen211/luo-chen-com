import './AiDeliveryTalkPage.css'

const copy = {
  zh: {
    eyebrow: 'AI 编程深海圈 · 首批线下聚会',
    date: '09.12 · 14:00—17:00',
    title: '客户为什么\n愿意把结果交给你？',
    intro: '从毕业设计、第一笔商单，到万元级企业项目。讲清楚一个普通学生如何从“做出 Demo”，走到“稳定交付”。',
    stamp: '落尘 / 分享提纲',
    thesisLabel: '核心判断',
    thesis: '客户真正购买的，不是你的身份、技术栈或几句 AI 指令，而是一个能够被稳定交付的结果。',
    bridge: '一条从个人项目走向企业交付的路径',
    modules: [
      {
        number: '01',
        title: '从毕设到商单',
        subtitle: '客户为什么愿意相信一个学生',
        viewpoint: '个人项目的价值，不只是展示功能，而是证明你能不能把一件事完整做完。',
        points: [
          '我的项目经历与成长路径：从学习、毕设到第一次真实交付。',
          '第一笔商单是怎么来的，客户为什么愿意把事情交给我。',
          '从个人项目到真实客户项目，需求、沟通和责任发生了哪些变化。',
          'AI 编程如何参与接单、方案思考与实际开发。',
        ],
      },
      {
        number: '02',
        title: '万元级企业项目',
        subtitle: '一个项目如何从需求走到交付',
        viewpoint: '企业项目不是把功能写出来，而是把需求、范围、进度和验收标准一起推进到结果。',
        points: [
          '如何把客户的模糊描述，整理成可以报价和交付的方案。',
          '如何判断工作量，确定报价、项目周期与交付边界。',
          '项目从开发、演示、迭代到验收的关键节点。',
          '项目中最容易出问题的地方，以及我的避坑经验。',
        ],
      },
      {
        number: '03',
        title: '企业项目需要什么能力',
        subtitle: 'AI 提速之后，人仍然要做判断',
        viewpoint: 'AI 可以缩短执行时间，但不能替你承担需求判断、质量判断和交付责任。',
        points: [
          '把模糊需求推进成明确、可执行、可验收的结果。',
          '在功能之外，关注稳定性、可用性和可维护性。',
          '哪些工作适合交给 AI，哪些判断必须由人完成。',
          '如何让项目上线、验收、交接，并能够持续使用。',
        ],
      },
      {
        number: '04',
        title: '从 Demo 走向第一单',
        subtitle: '给想通过 AI 编程接单的同学',
        viewpoint: '不要等到什么都会以后才进入真实项目，先完整走完一次小而真实的交付。',
        points: [
          '如何判断自己是否具备接单基础。',
          '接单前需要准备哪些项目、案例与基本能力。',
          '如何从 Demo、个人项目和小单逐步走向真实商单。',
          '现场答疑：工具、接单、报价、沟通与验收。',
        ],
      },
    ],
    closeLabel: '带走的不是一套工具，而是一种交付判断',
    close: '从能做出来，到值得被交给你。',
    footer: 'AI 编程 · 真实项目 · 稳定交付',
  },
  en: {
    eyebrow: 'AI Coding Deep Sea Circle · Offline Meetup',
    date: '09.12 · 14:00—17:00',
    title: 'Why would a client\ntrust you with the result?',
    intro: 'From graduation projects and a first paid order to enterprise delivery. A practical path from “I can build a demo” to “I can deliver reliably.”',
    stamp: 'LUOCHEN / TALK OUTLINE',
    thesisLabel: 'THE CORE JUDGMENT',
    thesis: 'Clients are not really buying your identity, stack, or prompts. They are buying a result that can be delivered reliably.',
    bridge: 'A path from personal projects to enterprise delivery',
    modules: [
      { number: '01', title: 'From Thesis to Paid Work', subtitle: 'Why a client trusts a student', viewpoint: 'A personal project should prove more than features: it should prove that you can finish the whole thing.', points: ['My path from learning and graduation projects to a first real delivery.', 'How the first order arrived, and why the client trusted me.', 'What changed when a personal project became a client project.', 'How AI coding helped with sales, planning, and implementation.'] },
      { number: '02', title: 'A Five-Figure Enterprise Project', subtitle: 'How a project moves from brief to delivery', viewpoint: 'Enterprise work is not just writing features. It is moving scope, schedule, quality, and acceptance toward one result.', points: ['Turning a vague client brief into a quotable delivery plan.', 'Setting price, timeline, scope, and boundaries.', 'Key moments from development and iteration to acceptance.', 'Where projects break, and the lessons I now use to avoid it.'] },
      { number: '03', title: 'The Capabilities Enterprise Work Requires', subtitle: 'AI accelerates execution; people still make the calls', viewpoint: 'AI can shorten execution time, but it cannot carry requirement, quality, or delivery responsibility for you.', points: ['Turning ambiguity into an executable, testable result.', 'Caring about stability, usability, and maintainability beyond features.', 'What AI can handle, and what humans must still judge.', 'Getting a project live, accepted, handed over, and kept useful.'] },
      { number: '04', title: 'From Demo to First Order', subtitle: 'For people who want to earn with AI coding', viewpoint: 'Do not wait until you know everything. Complete one small, real delivery first.', points: ['How to tell whether you are ready to take a project.', 'What projects, cases, and skills to prepare first.', 'How to move from demos and personal work into paid delivery.', 'Open Q&A on tools, sales, pricing, communication, and acceptance.'] },
    ],
    closeLabel: 'What you take away is not another tool, but delivery judgment',
    close: 'From being able to build it to being trusted with it.',
    footer: 'AI CODING · REAL PROJECTS · RELIABLE DELIVERY',
  },
}

export default function AiDeliveryTalkPage({ locale = 'zh' }) {
  const t = copy[locale] || copy.zh
  return (
    <article className="ai-talk-page">
      <header className="ai-talk-hero">
        <div className="ai-talk-hero-copy">
          <p className="ai-talk-eyebrow"><span>{t.eyebrow}</span><span>{t.date}</span></p>
          <h1>{t.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="ai-talk-intro">{t.intro}</p>
        </div>
        <img className="ai-talk-hero-art" src="/media/ai-delivery-hero-v2.png" alt={locale === 'zh' ? 'AI 交付系统插画' : 'AI delivery system illustration'} width="1354" height="1161" />
        <div className="ai-talk-hero-foot"><span>01 / 04</span><span>SHARE OUTLINE</span></div>
      </header>

      <section className="ai-talk-thesis reveal" aria-labelledby="ai-talk-thesis-title">
        <div className="ai-talk-section-label"><span>01</span><span>{t.thesisLabel}</span></div>
        <div>
          <h2 id="ai-talk-thesis-title">{t.thesis}</h2>
          <p className="ai-talk-thesis-note">{t.bridge}</p>
        </div>
      </section>

      <section className="ai-talk-outline" aria-labelledby="ai-talk-outline-title">
        <header className="ai-talk-outline-heading reveal">
          <p className="ai-talk-section-label"><span>02</span><span>THE ROUTE</span></p>
          <h2 id="ai-talk-outline-title">四个模块，<br /><em>一条交付主线。</em></h2>
        </header>
        <div className="ai-talk-modules">
          {t.modules.map((module) => (
            <section className="ai-talk-module reveal" key={module.number}>
              <div className="ai-talk-module-index">{module.number}</div>
              <div className="ai-talk-module-title"><h3>{module.title}</h3><p>{module.subtitle}</p></div>
              <div className="ai-talk-module-body">
                <blockquote>{module.viewpoint}</blockquote>
                <ul>{module.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="ai-talk-close reveal">
        <p className="ai-talk-section-label"><span>03</span><span>{t.closeLabel}</span></p>
        <h2>{t.close}</h2>
        <div className="ai-talk-close-line"><span>{t.footer}</span><span>09.12 / 14:00—17:00</span></div>
      </section>
    </article>
  )
}
