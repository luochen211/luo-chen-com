import { iterationEvalCases, iterationPrompts, scenarios } from "./data.mjs";
import { evaluateAgentPolicy, runSelfIteration, ShoppingHarness } from "./harness.mjs";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lessons = [
  {
    id: "start",
    course: "第 01 课",
    deck: "lesson-01",
    title: "没有 Agent，会买错什么？",
    slides: "02—05",
    startSlide: 2,
    time: "25 min",
    objective: "如果只输出一段推荐，系统不会继续核对实时商品和完成条件，用户就可能在预算、佩戴或通话上买错；Agent 的必要性，是让任务在结果出来前继续推进。",
    concepts: [
      ["没有外部事实", "模型只能用当前看到的内容，可能把过时信息或猜测当成推荐依据。"],
      ["没有完成条件", "系统只能生成“看起来合理”的答案，不知道预算和禁忌是否真的满足。"],
      ["没有持续行动", "第一次回答结束后，缺口不会自动补齐；查询、筛选和回退都不会继续。"],
      ["没有有用标准", "推荐得再多，也无法确认买错概率下降了：预算、禁忌和证据必须能验收。"],
      ["没有可靠边界", "能行动不等于达成结果；没有外部约束和评测，系统可能把自信误当成正确。"]
    ],
    boundary: "如果只是解释 ANC，一段回答就够；但如果没有查询、筛选、确认和回退，预算、佩戴、降噪和当前商品事实就无法同时兑现。Agent 只能把过程推进下去，不能靠自我声明证明结果正确。实时库存不在这个本地 Demo 的证明范围内。",
    slideMap: [
      ["02", "如果只生成推荐，用户会在哪些约束上买错。"],
      ["03", "如果没有持续行动，外部事实为什么不会自己出现。"],
      ["04", "如果没有完成条件，系统凭什么知道已经选对。"],
      ["05", "即使 Agent 继续行动，没有验证仍可能把错误带到结果。"]
    ],
    experiment: "一次真实耳机选择",
    instruction: "先选你要的结果，再让系统推进一次购买任务。只看 Context、Tool 和 Tool Result 怎样改变结论。",
    mode: "boundary",
    question: "如果系统只回答“推荐 A、B、C”，用户会在哪一步买错？",
    answers: ["因为答案不够长", "因为没有验证实时事实与硬约束", "因为必须使用多 Agent"],
    correct: 1,
    feedback: "价值不由文本流畅度决定，而由预算、佩戴形式、规格和证据是否满足验收条件决定；Agent 能推进过程，但还需要外部机制确认结果。"
  },
  {
    id: "agent",
    course: "第 01 课",
    deck: "lesson-01",
    title: "没有 Context，下一轮会忘掉什么？",
    slides: "06—09",
    startSlide: 6,
    time: "25 min",
    objective: "如果上一轮 Tool Result 没有写回 Context，Agent 下一轮就会看不到刚查到的事实，重复查询或凭空推荐；所以 Context 不是名词，而是让连续行动不丢状态。",
    concepts: [
      ["没有 LLM 判断", "系统只会机械执行，遇到新结果时不知道下一步该改什么。"],
      ["没有 Context", "模型下一轮看不到任务、约束和之前结果，只能重新猜。"],
      ["没有 Tools", "当前库存、价格和商品事实进不来，系统只能依赖旧信息。"],
      ["没有 Loop", "Tool Result 不会成为下一轮观察，系统会在第一次回答处提前结束。"]
    ],
    boundary: "如果 Context 不包含用户约束和 Tool Result，下一轮就会丢掉决定所需的信息；LLM、Context、Tools 解释系统怎样行动，却不承诺结果可靠。",
    slideMap: [
      ["06", "如果没有 Context，下一轮为什么会忘掉任务和约束。"],
      ["07—08", "如果没有 Tool，当前商品事实为什么进不来。"],
      ["09", "如果没有 Loop，Tool Result 为什么不会改变下一轮判断。"]
    ],
    experiment: "如果结果不写回，下一轮会怎样？",
    instruction: "运行一次完整购物需求，逐步展开每个变化；只看 Tool Result 写回后，下一轮 Context 多了什么。",
    mode: "trace",
    question: "为什么 Loop 不应该被写成 Agent 的第四个内部组件？",
    answers: ["Loop 是三部分的运行机制，不是内部能力来源", "Loop 只属于 Tool", "Loop 与 Context 完全相同"],
    correct: 0,
    feedback: "LLM、Context、Tools 描述 Agent 有什么；Loop 描述它们怎样随环境反馈持续协同。"
  },
  {
    id: "harness",
    course: "第 02 课",
    deck: "lesson-02",
    title: "没有 Harness，为什么能用还会错？",
    slides: "02—09",
    startSlide: 2,
    time: "30 min",
    objective: "如果没有 Harness，Agent 依然可以调用工具、生成结果，看起来“可以用”；但最后可能给出假的商品链接，或者给出真实却不符合用户需求的商品，错误判断会被交给用户。",
    concepts: [
      ["没有事实核验", "Agent 可能编造一个假的商品链接，用户点进去才发现根本买不到。"],
      ["没有需求约束", "链接是真的，但商品可能超预算、佩戴不合适，或降噪和通话不满足要求。"],
      ["没有结果验证", "Agent 只要说“查到了”就能交付，系统不会区分真实来源和看似合理的幻觉。"],
      ["没有 Correct", "一次错误会直接进入最终判断，没有有限重试、降级或交还人的出口。"],
      ["没有完成门槛", "真实链接也会被误当成正确推荐，用户承担的是买错后的成本。"]
    ],
    boundary: "没有 Harness，Agent 不是不能用，而是能用却不可信：结果可能是假的，也可能是真的但不适合用户。Harness 必须同时核验事实真假和需求是否满足，再允许结果交付。",
    slideMap: [
      ["02—03", "如果没有 Harness，Agent 为什么能运行却不能直接相信。"],
      ["04—08", "分别核验链接是真的、商品符合需求，并阻止错误进入最终判断。"],
      ["09", "看一次故障如何被留在系统内部，而不是变成用户的错误决定。"]
    ],
    experiment: "能运行，不等于判断可信",
    instruction: "触发一次工具故障，比较没有 Harness 和加入 Harness 后，Agent 会把什么样的判断交给用户。",
    mode: "recovery",
    question: "为什么真实商品链接也不能证明推荐正确？",
    answers: ["链接能打开就代表适合", "事实真实和符合用户需求是两层验证", "必须使用多 Agent"],
    correct: 1,
    feedback: "因为“链接是真的”和“商品符合这个用户”是两层不同的判断；没有 Harness，任何一层都可能缺失，Agent 仍会把结果说得像真的。"
  },
  {
    id: "information",
    course: "第 03 课",
    deck: "lesson-03",
    title: "信息放错，会拿旧事实做决定",
    slides: "02—08",
    startSlide: 2,
    time: "25 min",
    objective: "如果把轨迹、长期记忆、业务状态、共享知识和实时事实放错位置，系统就会拿旧库存、旧偏好或错误阶段做决定。",
    concepts: [
      ["没有 Trajectory", "下一轮看不到刚刚发生过什么，系统会重复动作或丢掉失败原因。"],
      ["没有 User Memory 边界", "临时偏好会污染下一次任务，用户已经改变的要求仍被旧记忆绑住。"],
      ["没有 Business State", "系统不知道是在澄清、处理中还是完成，可能在未完成时提前收尾。"],
      ["没有 RAG 边界", "共享知识和本次事实混在一起，静态说明会被误当成当前库存。"],
      ["没有实时 Tool", "价格、库存和业务状态变化后，推荐仍会引用已经过期的信息。"]
    ],
    boundary: "如果把“查资料”和“查现在”放进同一个来源，库存一变化，系统仍会用旧内容做决定；RAG 解决共享知识，实时 Tool 才能补当前事实。",
    slideMap: [
      ["02—04", "如果 State 和 Context 不分开，任务阶段会被错误地当成普通文本。"],
      ["05—07", "如果历史、记忆和知识没有时间边界，旧信息会继续影响新任务。"],
      ["08", "如果静态知识代替实时 Tool，当前库存变化就不会进入判断。"]
    ],
    experiment: "缺少正确来源，哪个结果会失真？",
    instruction: "给每条信息选择主要归属；放错后，看它会让哪一个判断变旧、变错或提前结束。",
    mode: "classification",
    question: "“此刻某款耳机是否有货”最可靠的来源是什么？",
    answers: ["Memory", "RAG 文档库", "实时库存 Tool"],
    correct: 2,
    feedback: "库存是高频变化的业务状态，必须从实时业务系统查询，不能依赖记忆或静态知识。"
  },
  {
    id: "capability",
    course: "第 04 课",
    deck: "lesson-04",
    title: "没有新增证据，多 Agent 只会增加什么？",
    slides: "02—08",
    startSlide: 2,
    time: "20 min",
    objective: "如果多 Agent 没有带来单 Agent 原本拿不到的新证据，新增角色只会增加交接、状态同步和出错位置；所以先问协作缺什么，再决定要不要拆。",
    concepts: [
      ["没有 Agent 目标", "各角色只完成自己的动作，却没人负责最终结果。"],
      ["没有 Skill 边界", "步骤和规则散落在 Prompt 里，换一次任务就容易漏掉关键动作。"],
      ["没有 Tool 证据", "角色之间只能转发观点，不能带来新的事实或验证结果。"],
      ["没有 Discovery", "所有能力一开始都塞进 Context，噪声变多，真正需要的动作反而更容易选错。"]
    ],
    boundary: "如果协作没有引入单 Agent 原本拿不到的新信息，多一个 Agent 就多一个交接和失误点；拆分的理由必须是新增证据，而不是角色听起来更专业。",
    slideMap: [
      ["02—03", "如果所有能力一开始都展开，Context 会变长，选择错误会增加。"],
      ["04—05", "如果没有 Skill 边界，重复步骤会散落在每次对话里。"],
      ["06—08", "只有 Reviewer 带来新验证结果时，拆 Agent 才值得承担交接成本。"]
    ],
    experiment: "拆 Agent 前，先看缺了什么证据",
    instruction: "选择不同请求并运行；如果没有新增信息，系统会展示为什么不该拆，如果有缺口，再看 Skill 和 Tool 如何补上。",
    mode: "routing",
    question: "什么时候才值得把售后拆成另一个 Agent？",
    answers: ["只要名字不同就拆", "当协作能引入单 Agent 原本拿不到的新信息时", "任何项目都应该默认多 Agent"],
    correct: 1,
    feedback: "拆分依据不是角色名字或流程复杂度，而是协作是否带来测试结果、外部验证或其他新增证据。"
  },
  {
    id: "evaluation",
    course: "第 05 课",
    deck: "lesson-05",
    title: "没有 Case，谁能证明它变好了？",
    slides: "02—06",
    startSlide: 2,
    time: "20 min",
    objective: "如果没有固定 Case，评测就只剩一个模糊总分；每个 Case 都要固定输入、环境、期望行为和验收断言，才能知道 v2 到底修掉了哪个错误后果。",
    concepts: [
      ["没有 Case 输入", "每次任务都不一样，分数变化无法说明系统真的变好了。"],
      ["没有 Case 断言", "Evaluator 只能说“看起来不错”，无法判断真假链接或错配商品是否被拦住。"],
      ["没有失败证据", "Reviewer 只能凭感觉改 Prompt，找不到是哪条规则导致了错误。"],
      ["没有 Regression Gate", "新版本即使伤害安全约束，也可能因为一次漂亮 Demo 被接受。"]
    ],
    boundary: "如果没有固定 Case 和验收断言，Agent 自己说“我变好了”就足以把坏版本放行；自迭代必须在同一批 Case 上重跑，并且每个后果都有可判定的 PASS/FAIL。",
    slideMap: [
      ["02—03", "如果没有 Case，失败只能变成一句模糊的“不好用”。"],
      ["04", "如果没有输入、环境和断言，PASS/FAIL 就没有依据。"],
      ["05—06", "如果不重复跑同一批 Case，修订就不能安全写回下一轮。"]
    ],
    experiment: "靠 Case，怎么测评？",
    instruction: "先查看每个 Case 要拦住的后果，再运行同一批 Case；看 v1 的失败如何交给 Reviewer，最后由 PASS/FAIL 决定 v2 能不能接受。",
    mode: "evaluation",
    question: "一个技术 Case 什么时候算 PASS？",
    answers: ["Agent 自己说结果更好了", "输入和环境固定，期望行为与验收断言都满足", "参与的 Agent 数量变多"],
    correct: 1,
    feedback: "Case 把后果变成可判定的断言；同一批 Case 重跑后，只有 PASS 增加且安全断言不回退，才说明系统真的改善。"
  }
];

const classificationItems = [
  { title: "没有阶段状态：系统会提前收尾", note: "当前任务处于“等待用户确认”", answer: "Business State" },
  { title: "没有当前上下文：模型会丢掉本轮候选", note: "本轮模型看到的商品摘要", answer: "Context" },
  { title: "没有记忆边界：旧偏好会污染新任务", note: "用户长期偏好半入耳式", answer: "User Memory" },
  { title: "没有共享知识：稳定原理无法被复用", note: "耳机降噪原理与选购指南", answer: "RAG" },
  { title: "没有实时来源：库存变化不会进入判断", note: "QuietPod S3 此刻是否有货", answer: "实时 Tool" },
  { title: "没有运行轨迹：系统会忘掉上次缺货", note: "上一次工具调用返回“缺货”", answer: "Trajectory" }
];

const demoGuides = {
  boundary: {
    proof: "如果没有外部事实和完成条件，答案看起来正确，也可能把用户带到错误购买结果。",
    cues: ["没有 Context：任务约束不会留下", "没有 Tool：当前商品事实进不来", "没有 Tool Result：下一轮无法修正"],
    takeaway: "Agent 不是为了多说，而是为了在缺口未补齐时继续行动；缺少它，任务会在答案生成处提前结束。"
  },
  trace: {
    proof: "如果 Tool Result 不写回 Context，下一轮就会重复查询或凭空判断；Loop 解决的是状态丢失。",
    cues: ["没有 Context：下一轮看不到任务和约束", "没有 Tool：外部事实进不来", "没有 Tool Result：下一轮无法改变判断"],
    takeaway: "如果结果不能进入下一轮，Agent 的内部结构就无法形成连续判断；每一次行动都会像从零开始。"
  },
  recovery: {
    proof: "没有 Harness，Agent 可能给你一个假的商品链接；即使链接是真的，也不代表符合你的需求。",
    cues: ["假的链接：结果根本不存在", "真的链接：商品仍可能不符合约束", "没有验证：两种错误都会被交付"],
    takeaway: "Harness 要同时验证事实真假和需求匹配，阻止“能行动”被误认为“判断正确”。"
  },
  classification: {
    proof: "轨迹、用户长期记忆、业务状态与 RAG 知识管道解决的是不同的信息问题。",
    cues: ["它是否属于本次运行历史", "它是否值得跨会话保存", "它是否来自共享知识库"],
    takeaway: "轨迹只增不改，长期记忆会被整理，业务状态表达任务阶段，RAG 把外部知识注入当前上下文。"
  },
  routing: {
    proof: "能力应按需发现；多 Agent 的价值来自协作过程中新增的外部信息。",
    cues: ["先加载索引再展开细节", "Skill 描述流程", "Reviewer 是否拿到了新的验证结果"],
    takeaway: "Agent 决策，Skill 组织任务方法，Tool 执行动作；协作没有新增信息时，不必拆多 Agent。"
  },
  evaluation: {
    proof: "评测证据必须能跨 Agent 传递，并由回归门禁决定 Prompt 修订是否真的生效。",
    cues: ["Evaluator 是否返回失败证据", "Reviewer 是否只提出可解释的修订", "v2 是否提升且没有安全回退"],
    takeaway: "A2A 不是把角色串起来，而是让评测结果成为下一轮 Prompt 与代码的输入，并用 Harness 门禁控制自迭代边界。"
  }
};

let currentLesson = 0;
let currentTrace = [];
let revealedTrace = 0;
const harness = new ShoppingHarness({ delay: 0 });

function setStatus(text, kind = "") {
  $("#labStatus").textContent = text;
  $("#labStatus").className = `lab-status ${kind}`;
}

function renderCurriculum() {
  $("#lessonList").innerHTML = lessons.map((lesson, index) => `
    <button type="button" class="lesson-button ${index === currentLesson ? "active" : ""}" data-lesson="${index}">
      <span class="lesson-nb">${index + 1}</span>
      <span><strong>${lesson.title}</strong><small>${lesson.course} · PPT ${lesson.slides}</small></span>
      <span class="lesson-time">${lesson.time}</span>
    </button>
  `).join("");
  $$(".lesson-button").forEach((button) => button.addEventListener("click", () => switchLesson(Number(button.dataset.lesson))));
}

function switchLesson(index) {
  currentLesson = Math.max(0, Math.min(lessons.length - 1, index));
  const lesson = lessons[currentLesson];
  harness.reset();
  currentTrace = [];
  revealedTrace = 0;

  const guide = demoGuides[lesson.mode];
  $("#lessonNumber").textContent = `模块 ${currentLesson + 1} / ${lessons.length}`;
  $("#lessonTitle").textContent = lesson.title;
  $("#lessonObjective").textContent = lesson.objective;
  const pptBase = location.pathname.includes("/demos/agent-harness")
    ? `/slides/decks/agent-harness/lessons/${lesson.deck}/`
    : `../ppt/lessons/${lesson.deck}/`;
  const pptHref = `${pptBase}?slide=${lesson.startSlide}`;
  $("#lessonPptLink").textContent = `${lesson.course} · 课件 ${lesson.slides} ↗`;
  $("#lessonPptLink").href = pptHref;
  $("#headerPptLink").href = pptHref;
  $("#conceptList").innerHTML = lesson.concepts.map((concept, index) => `
    <div class="concept-item"><span>${index + 1}</span><div><strong>${concept[0]}</strong><p>${concept[1]}</p></div></div>
  `).join("");
  $("#boundaryText").textContent = lesson.boundary;
  $("#slideMap").innerHTML = lesson.slideMap.map((item) => `<li><span>${item[0]}</span><div>${item[1]}</div></li>`).join("");
  $("#experimentTitle").textContent = lesson.experiment;
  $("#experimentInstruction").textContent = lesson.instruction;
  $("#proofStatement").textContent = guide.proof;
  $("#presenterTakeaway").textContent = guide.takeaway;
  $("#audienceCueList").innerHTML = guide.cues.map((cue, index) => `<li><span>0${index + 1}</span>${cue}</li>`).join("");
  $("#prevLesson").disabled = currentLesson === 0;
  $("#nextLesson").disabled = currentLesson === lessons.length - 1;
  renderExperiment(lesson.mode);
  renderCurriculum();
  setStatus("等待操作");
  if (window.innerWidth <= 900) window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderExperiment(mode) {
  const workspace = $("#experimentWorkspace");
  if (mode === "boundary") renderBoundary(workspace);
  if (mode === "trace") renderTraceLab(workspace);
  if (mode === "recovery") renderRecovery(workspace);
  if (mode === "classification") renderClassification(workspace);
  if (mode === "routing") renderRouting(workspace);
  if (mode === "evaluation") renderEvaluation(workspace);
}

function renderBoundary(workspace) {
  const taskPrompt = scenarios[0].prompt;
  workspace.innerHTML = `
    <section class="task-journey" id="taskJourney" data-phase="choice">
      <div class="journey-topline">
        <span>一个真实任务</span>
        <strong id="journeyProgress">先决定你要什么结果</strong>
      </div>
      <div class="journey-intro">
        <div>
          <span class="journey-kicker">500 元通勤耳机</span>
          <h3>你需要的是一句解释，还是一个能买的结果？</h3>
          <p>同样是“推荐耳机”，前者可以直接回答；后者必须把约束、外部事实和完成条件都跑完。</p>
        </div>
        <div class="journey-choice-list">
          <button class="journey-choice" type="button" data-choice="answer">
            <span>01</span><strong>只听懂 ANC</strong><small>稳定知识，回答就结束</small>
          </button>
          <button class="journey-choice" type="button" data-choice="agent">
            <span>02</span><strong>买到不踩坑</strong><small>预算、场景、证据都要兑现</small>
          </button>
        </div>
      </div>
      <div class="journey-panel" id="journeyPanel" aria-live="polite">
        <div class="journey-placeholder">选一个结果，任务才会开始。</div>
      </div>
    </section>
  `;

  $$(".journey-choice").forEach((button) => button.addEventListener("click", () => {
    $$(".journey-choice").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    if (button.dataset.choice === "answer") renderAnswerPath();
    else renderContextPath(taskPrompt);
  }));

  function renderAnswerPath() {
    $("#taskJourney").dataset.phase = "answer";
    $("#journeyProgress").textContent = "回答已足够";
    $("#journeyPanel").innerHTML = `
      <div class="journey-answer">
        <div class="journey-phase-label"><span>完成</span><strong>这件事不需要 Agent</strong></div>
        <p>解释 ANC 只依赖稳定知识，没有实时商品、外部动作或必须兑现的完成条件。</p>
        <div class="answer-mark"><span>✓</span><strong>生成回答 → 任务结束</strong></div>
        <button class="journey-link" type="button" id="tryAgentPath">换成“买到不踩坑” →</button>
      </div>
    `;
    $("#tryAgentPath").addEventListener("click", () => {
      $(".journey-choice[data-choice=answer]").classList.remove("selected");
      $(".journey-choice[data-choice=agent]").classList.add("selected");
      renderContextPath(taskPrompt);
    });
    setStatus("回答已足够", "success");
  }

  function renderContextPath(prompt) {
    $("#taskJourney").dataset.phase = "context";
    $("#journeyProgress").textContent = "任务还没有完成";
    $("#journeyPanel").innerHTML = `
      <div class="journey-phase-head">
        <div><span>01 Context</span><strong>先把需求变成可验收的任务</strong></div>
        <em>已生成</em>
      </div>
      <div class="journey-request"><span>用户说</span><strong>${prompt}</strong></div>
      <div class="constraint-line" aria-label="当前任务约束">
        <span>预算 ≤ ¥500</span><span>每天地铁 40 分钟</span><span>降噪强</span><span>通话清楚</span>
      </div>
      <div class="journey-gap"><strong>现在还不能下结论</strong><span>这些是约束，不是当前商品事实。</span></div>
      <button class="journey-action" type="button" id="journeyQuery">02 Tool · 去查商品信息 <span>→</span></button>
    `;
    $("#journeyQuery").addEventListener("click", () => runJourneyTool(prompt));
    setStatus("等待外部信息", "running");
  }

  async function runJourneyTool(prompt) {
    const panel = $("#journeyPanel");
    $("#taskJourney").dataset.phase = "tool";
    $("#journeyProgress").textContent = "正在执行外部动作";
    panel.innerHTML = `
      <div class="journey-phase-head">
        <div><span>02 Tool</span><strong>去商品系统查一次</strong></div>
        <em class="is-running">查询中</em>
      </div>
      <div class="tool-live"><span class="tool-pulse"></span><code>search_products</code><span>按预算、通勤、降噪和通话筛选</span></div>
      <div class="journey-gap"><strong>Agent 暂时不回答</strong><span>它先去拿会变化的外部事实。</span></div>
    `;
    setStatus("Tool 查询中", "running");
    harness.reset();
    const result = await harness.run(prompt);
    await wait(420);
    renderToolResult(result);
  }

  function renderToolResult(result) {
    const products = result.products || [];
    const first = products[0];
    $("#taskJourney").dataset.phase = "result";
    $("#journeyProgress").textContent = "完成条件已满足";
    $("#journeyPanel").innerHTML = `
      <div class="journey-phase-head">
        <div><span>03 Tool Result</span><strong>结果写回下一轮判断</strong></div>
        <em class="is-done">已返回 ${products.length} 件</em>
      </div>
      <div class="tool-result-line"><strong>Tool Result</strong><span>返回结构化商品记录，下一轮 Context 可以继续判断。</span></div>
      <div class="journey-products" role="list" aria-label="商品结果">
        ${products.slice(0, 3).map((product, index) => `
          <button class="journey-product ${index === 0 ? "selected" : ""}" type="button" data-product="${product.id}" role="listitem">
            <span>0${index + 1}</span><strong>${product.brand} ${product.name}</strong><b>¥${product.price}</b><small>${product.anc}dB 降噪 · 通话 ${product.mic}/10</small>
          </button>`).join("")}
      </div>
      <div class="journey-evidence" id="journeyEvidence">
        <div><span>为什么首选</span><strong>${first ? first.brand + " " + first.name : "没有符合项"}</strong></div>
        <p>${first ? first.evidence[0] : "当前约束下没有可验证的商品结果。"}</p>
        <small>${first ? `代价：${first.tradeoff}` : "系统没有为了给出答案而忽略硬约束。"}</small>
      </div>
      <div class="journey-completion"><span>完成条件</span><strong>3 / 3</strong><small>预算 · 场景 · 证据</small></div>
      <div class="journey-finish"><strong>现在才可以回答“选哪一副”</strong><span>不是因为模型多说了一轮，而是因为外部结果回来了。</span></div>
    `;
    $$(".journey-product").forEach((button) => button.addEventListener("click", () => {
      $$(".journey-product").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      const product = products.find((item) => item.id === button.dataset.product);
      if (!product) return;
      $("#journeyEvidence").innerHTML = `
        <div><span>为什么选它</span><strong>${product.brand} ${product.name}</strong></div>
        <p>${product.evidence[0]}</p>
        <small>代价：${product.tradeoff}</small>
      `;
    }));
    setStatus("任务完成", "success");
  }
}

function renderTraceLab(workspace) {
  workspace.innerHTML = `
    <div class="lab-toolbar">
      <select id="tracePrompt" aria-label="实验需求">
        <option>${scenarios[0].prompt}</option>
      </select>
      <button id="prepareTrace" class="run-button" type="button">运行并暂停</button>
      <button id="revealStep" class="step-button" type="button" disabled>显示下一步</button>
    </div>
    <div class="trace-panel"><div class="trace-empty" id="traceEmpty">尚未运行。轨迹会按步骤逐个出现。</div><ol class="trace-list" id="traceList"></ol><div id="traceResult"></div></div>
  `;
  $("#prepareTrace").addEventListener("click", prepareTrace);
  $("#revealStep").addEventListener("click", revealNextTrace);
}

async function prepareTrace() {
  setStatus("正在运行", "running");
  $("#prepareTrace").disabled = true;
  harness.reset();
  const result = await harness.run($("#tracePrompt").value);
  currentTrace = result.trace;
  revealedTrace = 0;
  $("#traceList").innerHTML = "";
  $("#traceResult").innerHTML = "";
  $("#traceEmpty").textContent = `已生成 ${currentTrace.length} 个 Harness 步骤。现在不要一次看完，逐步展开。`;
  $("#revealStep").disabled = false;
  $("#prepareTrace").disabled = false;
  setStatus("轨迹已暂停");
}

function mapPhase(step) {
  if (step.type === "router" || step.type === "context") return "OBSERVE / REASON";
  if (step.type === "tool") return "ACT / UPDATE";
  if (step.type === "rag" || step.type === "ranker") return "OBSERVE / REASON";
  if (step.type === "recovery") return "CORRECT";
  return step.type.toUpperCase();
}

function appendTraceStep(step, index, list = $("#traceList")) {
  $("#traceEmpty")?.remove();
  const node = $("#traceStepTemplate").content.firstElementChild.cloneNode(true);
  node.classList.add(step.status);
  node.querySelector(".trace-index").textContent = index + 1;
  node.querySelector("strong").textContent = step.title;
  node.querySelector("p").textContent = step.detail;
  node.querySelector("b").textContent = mapPhase(step);
  list.append(node);
}

function revealNextTrace() {
  if (revealedTrace >= currentTrace.length) return;
  appendTraceStep(currentTrace[revealedTrace], revealedTrace);
  revealedTrace += 1;
  if (revealedTrace === currentTrace.length) {
    $("#revealStep").disabled = true;
    $("#traceResult").className = "result-strip";
    $("#traceResult").textContent = "关键结论：工具返回不是日志附件，它被写回 State，并成为下一轮 Context 的来源。";
    setStatus("查看完成", "success");
  } else {
    $("#revealStep").textContent = `显示下一步（${revealedTrace}/${currentTrace.length}）`;
  }
}

function renderRecovery(workspace) {
  workspace.innerHTML = `
    <div class="lab-toolbar">
      <div style="flex:1;font-size:11px;color:#667085">触发一次工具故障；看没有 Harness 时，Agent 为什么仍能说出一个错误结论。</div>
      <button id="runRecovery" class="run-button" type="button">让后果发生</button>
    </div>
    <div class="compare-board" style="margin-top:10px">
      <section class="compare-column unsafe"><header><span>没有 Harness</span><strong>Agent 能用，但判断会漂</strong></header><ul id="unsafeList"><li>等待实验</li></ul></section>
      <section class="compare-column safe"><header><span>有 Harness</span><strong>把错误挡在交付前</strong></header><ul id="safeList"><li>等待实验</li></ul></section>
    </div>
    <div class="trace-panel" style="margin-top:10px;border-top:1px solid #dfe3ea;border-radius:9px"><ol class="trace-list" id="traceList"></ol></div>
  `;
  $("#runRecovery").addEventListener("click", runRecovery);
}

async function runRecovery() {
  $("#runRecovery").disabled = true;
  setStatus("注入工具故障", "running");
  harness.reset();
  harness.failNextTool = true;
  const result = await harness.run(scenarios[0].prompt);
  $("#unsafeList").innerHTML = `
    <li>工具没有返回，Agent 仍然可能继续生成一个假的商品链接。</li>
    <li>即使链接碰巧是真的，也没有重新核对预算、佩戴、降噪和通话。</li>
    <li>用户看到的是“能用”的回答，却无法知道它是否真实、是否适合自己。</li>`;
  $("#safeList").innerHTML = `
    <li>故障由代码判定，不让 Agent 自己宣布“已经查到”。</li>
    <li>返回后同时核验来源和用户硬约束，真实但不合适也不能通过。</li>
    <li>仍无法确认就停止生成，不把幻觉或错配商品交给用户。</li>`;
  $("#traceList").innerHTML = "";
  result.trace.forEach(appendTraceStep);
  $("#runRecovery").disabled = false;
  setStatus("恢复成功", "success");
}

function renderClassification(workspace) {
  const options = ["请选择", "Trajectory", "Business State", "Context", "User Memory", "RAG", "实时 Tool"];
  workspace.innerHTML = `
    <div class="classification-list">${classificationItems.map((item, index) => `
      <div class="classification-row" data-row="${index}">
        <div><strong>${item.title}</strong><small>${item.note}</small></div>
        <select aria-label="${item.title} 的信息归属">${options.map((option) => `<option>${option}</option>`).join("")}</select>
        <span class="mark">·</span>
      </div>`).join("")}
    </div>
    <div class="classification-actions"><button id="checkClassification" class="check-button" type="button">检查 6 项归属</button></div>
  `;
  $("#checkClassification").addEventListener("click", () => {
    let correct = 0;
    $$(".classification-row").forEach((row, index) => {
      const pass = row.querySelector("select").value === classificationItems[index].answer;
      row.classList.toggle("pass", pass);
      row.classList.toggle("fail", !pass);
      row.querySelector(".mark").textContent = pass ? "✓" : "×";
      if (pass) correct += 1;
    });
    setStatus(`${correct} / 6 正确`, correct === 6 ? "success" : "running");
  });
}

function renderRouting(workspace) {
  const routingScenarios = [...scenarios, {
    title: "没有权限边界，售后会越界",
    prompt: "耳机坏了，我要查订单并申请售后退货。"
  }];
  workspace.innerHTML = `
    <div class="lab-toolbar">
      <select id="routePrompt">${routingScenarios.map((item) => `<option value="${item.prompt}">${item.title}：${item.prompt}</option>`).join("")}</select>
      <button id="runRoute" class="run-button" type="button">运行能力选择</button>
    </div>
    <div id="routeMap" class="route-map pending">
      <div class="route-node"><span>WHO / AGENT</span><strong id="routeAgent">购物 Agent</strong><p>如果没有结果目标，角色只会完成动作，却没人负责后果。</p></div>
      <div class="route-arrow">→</div>
      <div class="route-node"><span>HOW / SKILL</span><strong id="routeSkill">等待判断</strong><p id="routeSkillNote">如果没有 Skill 边界，步骤会散落并漏掉关键动作。</p></div>
      <div class="route-arrow">→</div>
      <div class="route-node"><span>ACT / TOOL</span><strong id="routeTool">等待判断</strong><p id="routeToolNote">如果没有 Tool 证据，角色之间只能转发观点。</p></div>
    </div>
    <div class="trace-panel" style="margin-top:10px;border-top:1px solid #dfe3ea;border-radius:9px"><ol class="trace-list" id="traceList"></ol></div>
  `;
  $("#runRoute").addEventListener("click", runRoute);
}

async function runRoute() {
  $("#runRoute").disabled = true;
  setStatus("能力选择中", "running");
  harness.reset();
  const result = await harness.run($("#routePrompt").value);
  $("#routeMap").classList.remove("pending");
  const route = result.state.intent;
  if (result.kind === "clarify") {
    $("#routeSkill").textContent = "需求澄清";
    $("#routeSkillNote").textContent = "缺少会改变推荐结果的预算。";
    $("#routeTool").textContent = "暂不调用";
    $("#routeToolNote").textContent = "信息不完整时，先追问而不是盲目搜索。";
  } else if (result.kind === "handoff") {
    $("#routeAgent").textContent = "购物 Agent → 售后流程";
    $("#routeSkill").textContent = "安全转交";
    $("#routeSkillNote").textContent = "订单权限和完成标准不同。";
    $("#routeTool").textContent = "当前无权限";
    $("#routeToolNote").textContent = "不允许购物 Agent 直接查询订单。";
  } else if (route === "COMPARE") {
    $("#routeSkill").textContent = "商品比较 Skill";
    $("#routeSkillNote").textContent = "执行指定候选的证据化比较。";
    $("#routeTool").textContent = "compare_products";
    $("#routeToolNote").textContent = "读取两款商品的结构化数据。";
  } else {
    $("#routeSkill").textContent = "找商品 Skill";
    $("#routeSkillNote").textContent = "按预算和偏好搜索、过滤、排序。";
    $("#routeTool").textContent = "search_products";
    $("#routeToolNote").textContent = "查询商品库并读取证据。";
  }
  $("#traceList").innerHTML = "";
  result.trace.forEach(appendTraceStep);
  $("#runRoute").disabled = false;
  setStatus("能力选择完成", "success");
}

function renderEvaluation(workspace) {
  workspace.innerHTML = `
    <div class="usefulness-contract"><span>如果缺少核验</span><strong>可能是假链接；即使链接是真的，也可能超预算、违背禁忌或不符合使用场景。</strong></div>
    <div class="case-contract"><span>TECHNICAL CASE = 4 个固定部分</span><strong>输入 · 环境 / 故障 · 期望行为 · 验收断言</strong><p>每个 Case 都只拦一个可观察后果；PASS 不是 Agent 自评，而是断言真的成立。</p></div>
    <div class="lab-toolbar">
      <div style="flex:1;font-size:11px;color:#667085">如果没有固定 Case 和回归门禁，坏 Prompt 也可能被写回：6 个 Case · 3 个能力分组 · 1 个门禁</div>
      <button id="runEvaluation" class="run-button" type="button">运行 6 个 Case</button>
      <button id="runIteration" class="step-button" type="button">让 Case 驱动自迭代</button>
    </div>
    <div class="prompt-grid">
      <article class="prompt-card baseline"><span>BASELINE PROMPT</span><strong>${iterationPrompts.baseline.label}</strong><pre>${iterationPrompts.baseline.text}</pre></article>
      <article class="prompt-card revised"><span>PATCHED PROMPT</span><strong>${iterationPrompts.revised.label}</strong><pre>${iterationPrompts.revised.text}</pre></article>
    </div>
    <div class="eval-note" id="policyRunSummary">先运行 6 个 Case，或查看一次由失败 Case 驱动的 A2A 修订。</div>
    <table class="test-table iteration-table" style="margin-top:10px">
      <thead><tr><th>CASE / 输入</th><th>要拦住的后果 / 断言</th><th>结果</th></tr></thead>
      <tbody>${iterationEvalCases.map((item, index) => `<tr data-eval-id="${item.id}"><td><span class="eval-id">0${index + 1} · ${item.dimension}</span><strong>${item.title}</strong><small class="case-input">输入：${item.prompt}</small></td><td>${item.assertion}</td><td class="test-status" data-test="${item.id}">待运行</td></tr>`).join("")}</tbody>
    </table>
    <div class="a2a-handoff" id="a2aHandoff">A2A 交接包尚未生成：Evaluator 会把失败 Case、证据与回归门槛交给 Reviewer。</div>
    <div class="trace-panel a2a-trace-panel"><div class="trace-empty" id="a2aTraceEmpty">让 Case 驱动自迭代后，这里会显示 Builder、Evaluator、Reviewer 与 Harness Gate 如何交接。</div><ol class="trace-list" id="a2aTraceList"></ol></div>
    <div class="eval-summary">
      <div><span>UNDERSTAND</span><strong id="understandScore">—</strong></div>
      <div><span>ACT</span><strong id="actScore">—</strong></div>
      <div><span>VERIFY</span><strong id="verifyScore">—</strong></div>
      <div><span>COMPLETE</span><strong id="completeScore">—</strong></div>
    </div>
  `;
  $("#runEvaluation").addEventListener("click", runEvaluation);
  $("#runIteration").addEventListener("click", runA2ASelfIteration);
}

function formatMetric(metric) {
  return `${metric.passed} / ${metric.total}`;
}

function renderPolicyReport(report, label = "v2") {
  const results = new Map(report.cases.map((item) => [item.id, item]));
  iterationEvalCases.forEach((testCase) => {
    const result = results.get(testCase.id);
    const status = $(`[data-test="${testCase.id}"]`);
    status.textContent = result.pass ? "PASS" : "FAIL";
    status.className = `test-status ${result.pass ? "pass" : "fail"}`;
  });
  $("#understandScore").textContent = formatMetric(report.metrics.UNDERSTAND);
  $("#actScore").textContent = formatMetric(report.metrics.ACT);
  $("#verifyScore").textContent = formatMetric(report.metrics.VERIFY);
  $("#completeScore").textContent = formatMetric(report.metrics.COMPLETE);
  $("#policyRunSummary").textContent = `${label}：${report.passed}/${report.total} 个 Case 通过 · 安全断言 ${report.safetyPass ? "通过" : "失败"} · 同一批 Case 可用于下一轮回归。`;
}

async function runEvaluation() {
  $("#runEvaluation").disabled = true;
  $("#runIteration").disabled = true;
  setStatus("测试运行中", "running");
  const report = await evaluateAgentPolicy(iterationPrompts.revised.version);
  renderPolicyReport(report);
  $("#runEvaluation").disabled = false;
  $("#runIteration").disabled = false;
  setStatus(`${report.passed} / ${report.total} 通过`, report.passed === report.total ? "success" : "running");
}

async function runA2ASelfIteration() {
  $("#runEvaluation").disabled = true;
  $("#runIteration").disabled = true;
  $("#a2aTraceList").innerHTML = "";
  $("#a2aTraceEmpty").textContent = "A2A 轨迹运行中：先看失败 Case，再看 Prompt Patch 与同一批 Case 回归。";
  $("#a2aHandoff").textContent = "正在生成 A2A 交接包……";
  setStatus("A2A 自迭代中", "running");
  const iteration = await runSelfIteration({
    delay: 150,
    onStep: (step) => appendTraceStep(step, $("#a2aTraceList").children.length, $("#a2aTraceList"))
  });
  renderPolicyReport(iteration.revised, iteration.accepted ? "v2 accepted" : "v2 rejected");
  $("#a2aHandoff").textContent = `A2A 交接：${iteration.handoff.from} → ${iteration.handoff.to} · ${iteration.handoff.failures.length} 个失败证据 · 回归结果：${iteration.accepted ? "接受 v2" : "拒绝 v2"}`;
  $("#a2aTraceEmpty")?.remove();
  $("#runEvaluation").disabled = false;
  $("#runIteration").disabled = false;
  setStatus(iteration.accepted ? "迭代门禁通过" : "迭代门禁拒绝", iteration.accepted ? "success" : "running");
}

$("#prevLesson").addEventListener("click", () => switchLesson(currentLesson - 1));
$("#nextLesson").addEventListener("click", () => switchLesson(currentLesson + 1));

switchLesson(0);
