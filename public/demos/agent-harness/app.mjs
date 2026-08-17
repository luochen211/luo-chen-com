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
    title: "为什么需要 Agent",
    slides: "02—05",
    startSlide: 2,
    time: "25 min",
    objective: "回答“为什么要有 Agent”：当任务面对变化环境、多个约束、连续动作和完成条件时，单次回答不够；Agent 让系统可以持续推进，但不保证结果正确。",
    concepts: [
      ["单次回答", "模型基于当前信息生成内容，输出文本后任务就结束。"],
      ["真实任务", "任务面对变化环境、多个约束、连续动作和明确的完成条件。"],
      ["Agent", "系统根据环境反馈继续观察、行动和调整，尝试满足完成条件。"],
      ["有用标准", "不是推荐更多商品，而是降低买错概率：预算不超、明确禁忌不违背、理由能回指数据。"],
      ["可靠边界", "能行动不等于达到预期；必须用外部约束、正确的信息和可重复评测继续检验。"]
    ],
    boundary: "如果只是解释 ANC，一段回答就够；如果要在预算、佩戴、降噪、双设备和当前商品事实都满足时选到耳机，任务就需要查、筛、确认和回退。Agent 负责推进这个过程，但不能靠自我声明证明结果正确。实时库存不在这个本地 Demo 的证明范围内。",
    slideMap: [
      ["02", "把耳机案例的实际结果说清：用户要少买错一次。"],
      ["03", "列出普通回答失效的条件，得出 Agent 的必要性。"],
      ["04", "固定完成条件：不超预算、不违背禁忌、有证据。"],
      ["05", "说明 Agent 能推进任务，但不保证自动正确。"]
    ],
    experiment: "边界判断：回答还是完成",
    instruction: "依次判断三个任务只需要生成回答，还是需要 Agent 持续行动。点击案例查看系统边界。",
    mode: "boundary",
    question: "为什么“推荐 A、B、C”不能证明用户已经做出可靠购买决策？",
    answers: ["因为答案不够长", "因为没有验证实时事实与硬约束", "因为必须使用多 Agent"],
    correct: 1,
    feedback: "价值不由文本流畅度决定，而由预算、佩戴形式、规格和证据是否满足验收条件决定；Agent 能推进过程，但还需要外部机制确认结果。"
  },
  {
    id: "agent",
    course: "第 01 课",
    deck: "lesson-01",
    title: "Agent 的内部结构",
    slides: "06—09",
    startSlide: 6,
    time: "25 min",
    objective: "把“Agent = LLM + Context + Tools”和 ReAct 循环分开：前者回答由什么组成，后者回答它怎样运行；两者解释行动能力，不等于结果可靠。",
    concepts: [
      ["LLM", "理解意图、比较候选并决定下一步，是概率性的决策核心。"],
      ["Context", "模型在当前决策点能够看见的信息，是观察空间。"],
      ["Tools", "搜索、查询和执行外部动作，是动作空间。"],
      ["ReAct", "模型思考并行动，工具结果成为新观察；框架将结果追加到轨迹。"]
    ],
    boundary: "Context 由系统提示词、工具定义、用户消息、模型回复和工具执行结果组成；前两项是静态前缀，后三项形成动态轨迹。这三个组件描述能力来源，不是可靠性承诺。",
    slideMap: [
      ["06", "用 Agent = LLM + Context + Tools 定义内部组成。"],
      ["07—08", "解释观察空间、动作空间和 Context 的五类来源。"],
      ["09", "用 ReAct 说明三部分怎样被循环驱动。"]
    ],
    experiment: "逐步观察一次 Agent 运行",
    instruction: "运行完整购物需求，然后每次只展开一个步骤。观察上一轮 Tool Result 如何成为下一轮 Context。",
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
    title: "Harness 如何保证可靠",
    slides: "02—09",
    startSlide: 2,
    time: "30 min",
    objective: "理解模型负责判断，Harness 负责把“可能买错”的风险变成可约束、可验证、可恢复的决策流程。",
    concepts: [
      ["Context", "为模型提供系统指令、工具定义与不断增长的动态轨迹。"],
      ["Tool Interface", "为模型设计可理解、单一职责、参数防呆且返回可判定的接口。"],
      ["Constrain", "在行动前、参数中和行动后阻止越权与违反硬约束。"],
      ["Verify", "不用模型声明证明模型正确，而是回到业务事实验证结果。"],
      ["Correct", "失败后静默重试、接续生成、回退稳定态、熔断或交还人类。"]
    ],
    boundary: "Harness 不是第二个更聪明的模型，而是模型外部的确定性控制层；它的价值是减少错误决策和人工返工。",
    slideMap: [
      ["02—03", "建立 Model + Harness，并展开 Harness 的五项工程职责。"],
      ["04—08", "依次展开 Context、Tool、Constrain、Verify 与 Correct。"],
      ["09", "用退款控制流观察五部分怎样按顺序接力。"]
    ],
    experiment: "工具超时对照实验",
    instruction: "触发同一次商品搜索。比较“只有模型”与“加入 Harness”在工具超时时分别会发生什么。",
    mode: "recovery",
    question: "工具超时后的重试次数和安全退出应该由谁控制？",
    answers: ["让模型临场自由决定", "由 Harness 的确定性策略控制", "让用户自己刷新页面"],
    correct: 1,
    feedback: "模型可以判断是否值得继续，但最大重试次数、超时和降级出口必须由 Harness 控制。"
  },
  {
    id: "information",
    course: "第 03 课",
    deck: "lesson-03",
    title: "信息到底放在哪里",
    slides: "02—08",
    startSlide: 2,
    time: "25 min",
    objective: "正确区分轨迹、用户长期记忆、业务状态与共享知识，避免因为信息放错位置而给出过时或不符合约束的推荐。",
    concepts: [
      ["Trajectory", "用户消息、模型回复和工具执行结果按时间追加，只增不改。"],
      ["User Memory", "跨会话提炼的稳定信息，会被改写、合并和淘汰。"],
      ["Business State", "开发者定义的任务逻辑阶段，如需要澄清、处理中或已完成。"],
      ["RAG", "从共享知识库检索相关片段，再注入当前 Context。"],
      ["实时 Tool", "连接外部业务系统，读取或改变当前环境状态。"]
    ],
    boundary: "RAG 适合“查资料”，实时 Tool 适合“查现在”；把库存放进向量库不会让它变成实时事实。",
    slideMap: [
      ["02—04", "区分 State、Context，并建立四类信息资产总览。"],
      ["05—07", "区分 Trajectory、User Memory 与共享知识的时间尺度和所有权。"],
      ["08", "区分 RAG 的共享知识与实时 Tool 的当前事实。"]
    ],
    experiment: "信息归属分类",
    instruction: "给每条信息选择唯一的主要归属，然后检查结果。错误项会解释为什么不能放在那里。",
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
    title: "能力发现：什么时候不需要多 Agent",
    slides: "02—08",
    startSlide: 2,
    time: "20 min",
    objective: "只在能减少错误或引入新证据时使用 Skill 和多 Agent；否则一个清晰的单 Agent 流程更有用。",
    concepts: [
      ["Agent", "维护目标和 State，决定下一步做什么。"],
      ["Skill", "封装完成一类任务的步骤、规则和知识。"],
      ["Tool", "执行一个可验证的查询、计算或业务动作。"],
      ["Discovery", "先保留能力索引，再按任务需要展开 Skill 文档与工具定义。"]
    ],
    boundary: "多 Agent 是否值得，关键看协作是否引入单 Agent 生成时原本拿不到的新信息。",
    slideMap: [
      ["02—03", "区分三层能力，并解释能力为什么要渐进式披露。"],
      ["04—05", "用部署 Skill 观察能力怎样按需展开并由通用 Tool 执行。"],
      ["06—08", "判断何时拆 Agent、Reviewer 如何获得新证据，以及怎样交接任务包。"]
    ],
    experiment: "观察能力怎样按需加载",
    instruction: "选择不同用户请求并运行，观察系统如何按需加载 Skill、调用 Tool，并把结果写回轨迹。",
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
    title: "怎样证明系统可用",
    slides: "02—06",
    startSlide: 2,
    time: "20 min",
    objective: "把评测变成 Agent 之间可以消费的证据：先跑固定评测集，再让 Builder、Evaluator 与 Reviewer 通过 A2A 交接完成一次受门禁的 Prompt 自迭代。",
    concepts: [
      ["Evaluation", "用固定、可重复的任务分布检查系统，而不是凭一次漂亮 Demo 下结论。"],
      ["A2A Handoff", "Evaluator 不转发整段聊天，而是把失败 ID、证据和验收门槛交给 Reviewer。"],
      ["Prompt Patch", "Reviewer 归因后，Builder 只修改能解释失败的规则，并保留原有约束。"],
      ["Regression Gate", "修订版本必须在同一评测集上提升，且安全与其他分组指标不能回退。"]
    ],
    boundary: "自迭代不是 Agent 自己说“我变好了”，而是失败证据经过 A2A 交接后形成 Prompt 修订，再由固定评测集和 Harness 门禁决定是否接受。",
    slideMap: [
      ["02—03", "区分执行轨迹、最终状态和可诊断的评测对象。"],
      ["04", "用重复运行和分组指标区分能力提升与稳定性回退。"],
      ["05—06", "让评测证据通过 A2A 交接驱动 Prompt Patch，再经过回归门禁。"]
    ],
    experiment: "评测驱动的 A2A 自迭代",
    instruction: "先跑同一批固定任务，观察 v1 的失败证据如何交给 Reviewer，再由 Builder 修订 Prompt 并回归；只有门禁通过，v2 才会被接受。",
    mode: "evaluation",
    question: "什么条件下，A2A 自迭代才算真的改善了系统？",
    answers: ["Reviewer 说 Prompt 更完整了", "固定评测集得分提升，且安全与其他指标没有回退", "参与的 Agent 数量变多"],
    correct: 1,
    feedback: "迭代的证据来自同一评测集上的可重复提升；Prompt 文案变长、角色变多或 Agent 自评都不能替代回归门禁。"
  }
];

const classificationItems = [
  { title: "当前任务处于“等待用户确认”阶段", note: "开发者定义的任务逻辑阶段", answer: "Business State" },
  { title: "本轮模型看到的候选商品摘要", note: "为一次决策临时组装", answer: "Context" },
  { title: "用户长期偏好半入耳式", note: "跨会话提炼的稳定信息", answer: "User Memory" },
  { title: "耳机降噪原理与选购指南", note: "来自受治理的外部知识库", answer: "RAG" },
  { title: "QuietPod S3 此刻是否有货", note: "高频变化的业务事实", answer: "实时 Tool" },
  { title: "上一次工具调用返回“缺货”", note: "按时间追加并成为下一轮观察", answer: "Trajectory" }
];

const demoGuides = {
  boundary: {
    proof: "一次流畅回答，不等于任务已经完成。",
    cues: ["任务有没有外部事实", "结果有没有完成条件", "系统是否需要继续行动"],
    takeaway: "Agent 的价值不在多说几轮，而在根据环境反馈持续行动，直到完成条件被满足。"
  },
  trace: {
    proof: "LLM、Context、Tools 是组成；Loop 是驱动它们协同的运行机制。",
    cues: ["Context 先提供观察", "Tool 执行外部动作", "Tool Result 写回下一轮"],
    takeaway: "Agent = LLM + Context + Tools；ReAct Loop 解释这三部分怎样持续运行。"
  },
  recovery: {
    proof: "可靠性来自模型外部的确定性 Harness，而不是模型承诺自己会小心。",
    cues: ["超时由代码判定", "重试次数受到限制", "失败存在安全出口"],
    takeaway: "模型负责判断下一步；Harness 负责上下文、工具、约束、验证与纠正。"
  },
  classification: {
    proof: "轨迹、用户长期记忆、业务状态与 RAG 知识管道解决的是不同的信息问题。",
    cues: ["是否属于本次运行历史", "是否值得跨会话提炼", "是否来自共享知识库"],
    takeaway: "轨迹只增不改，长期记忆会被整理，业务状态表达任务阶段，RAG 把外部知识注入当前上下文。"
  },
  routing: {
    proof: "能力应按需发现；多 Agent 的价值来自协作过程中新增的外部信息。",
    cues: ["先加载索引再展开细节", "Skill 描述流程", "Reviewer 是否获得新的验证结果"],
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
  $("#lessonNumber").textContent = `演示 ${currentLesson + 1} / ${lessons.length}`;
  $("#lessonTitle").textContent = lesson.title;
  $("#lessonObjective").textContent = lesson.objective;
  const pptBase = location.pathname.includes("/demos/agent-harness")
    ? `/slides/decks/agent-harness/lessons/${lesson.deck}/`
    : `../ppt/lessons/${lesson.deck}/`;
  const pptHref = `${pptBase}?slide=${lesson.startSlide}`;
  $("#lessonPptLink").textContent = `${lesson.course} · PPT ${lesson.slides} ↗`;
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
  const cases = [
    ["解释 ANC 是什么", "只需要基于稳定知识进行说明。", "回答", "没有外部动作，也没有随环境变化的完成条件。"],
    ["推荐 500 元内耳机", "要求满足预算，但没有要求核验实时库存。", "视条件而定", "如果只是给选购思路，可以回答；如果承诺“可以买”，就必须查询实时事实。"],
    ["找到符合条件且有证据的耳机", "要求预算、佩戴形式和关键规格都满足。", "Agent", "需要查、筛、证、答，并根据工具反馈持续调整。"]
  ];
  workspace.innerHTML = `
    <div class="case-grid">${cases.map((item, index) => `
      <button class="case-button" type="button" data-case="${index}">
        <span>案例 0${index + 1}</span><strong>${item[0]}</strong><p>${item[1]}</p>
      </button>`).join("")}
    </div>
    <div id="caseResult" class="case-result">点击一个案例，先判断它需要“回答”还是“完成”。</div>
  `;
  $$(".case-button").forEach((button) => button.addEventListener("click", () => {
    $$(".case-button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    const item = cases[Number(button.dataset.case)];
    $("#caseResult").innerHTML = `<strong>判断：${item[2]}</strong><br>${item[3]}`;
    setStatus("已观察", "success");
  }));
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
    $("#traceResult").textContent = "观察结论：工具返回不是日志附件，它被写回 State，并成为下一轮 Context 的来源。";
    setStatus("观察完成", "success");
  } else {
    $("#revealStep").textContent = `显示下一步（${revealedTrace}/${currentTrace.length}）`;
  }
}

function renderRecovery(workspace) {
  workspace.innerHTML = `
    <div class="lab-toolbar">
      <div style="flex:1;font-size:11px;color:#667085">故障条件：商品查询首次调用超时 800ms；目标：不要用猜测替代证据</div>
      <button id="runRecovery" class="run-button" type="button">触发对照实验</button>
    </div>
    <div class="compare-board" style="margin-top:10px">
      <section class="compare-column unsafe"><header><span>MODEL ONLY</span><strong>没有 Harness</strong></header><ul id="unsafeList"><li>等待实验</li></ul></section>
      <section class="compare-column safe"><header><span>MODEL + HARNESS</span><strong>避免用户得到假结论</strong></header><ul id="safeList"><li>等待实验</li></ul></section>
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
    <li>工具超时后没有最大重试次数。</li>
    <li>模型可能重复调用，也可能凭已有知识继续生成。</li>
    <li>用户无法区分“已验证”和“模型猜测”。</li>`;
  $("#safeList").innerHTML = `
    <li>800ms 超时由代码判定，不依赖模型自述。</li>
    <li>缩小返回字段并执行第 1 次有限重试。</li>
    <li>成功则继续；仍失败则明确“无法确认”，不让用户据此买错。</li>`;
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
    title: "售后越界",
    prompt: "耳机坏了，我要查订单并申请售后退货。"
  }];
  workspace.innerHTML = `
    <div class="lab-toolbar">
      <select id="routePrompt">${routingScenarios.map((item) => `<option value="${item.prompt}">${item.title}：${item.prompt}</option>`).join("")}</select>
      <button id="runRoute" class="run-button" type="button">运行能力选择</button>
    </div>
    <div id="routeMap" class="route-map pending">
      <div class="route-node"><span>WHO / AGENT</span><strong id="routeAgent">购物 Agent</strong><p>维护“减少买错”的目标、State 与下一步决策。</p></div>
      <div class="route-arrow">→</div>
      <div class="route-node"><span>HOW / SKILL</span><strong id="routeSkill">等待判断</strong><p id="routeSkillNote">根据任务与信息缺口选择流程。</p></div>
      <div class="route-arrow">→</div>
      <div class="route-node"><span>ACT / TOOL</span><strong id="routeTool">等待判断</strong><p id="routeToolNote">只在需要真实数据或动作时调用。</p></div>
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
    <div class="usefulness-contract"><span>USEFULNESS CONTRACT</span><strong>降低买错概率：预算不超 · 明确禁忌不违背 · 推荐理由可回指数据</strong></div>
    <div class="lab-toolbar">
      <div style="flex:1;font-size:11px;color:#667085">固定评测集：6 条任务 · 3 个能力分组 · 1 个回归门禁</div>
      <button id="runEvaluation" class="run-button" type="button">运行 v2 评测</button>
      <button id="runIteration" class="step-button" type="button">运行 A2A 自迭代</button>
    </div>
    <div class="prompt-grid">
      <article class="prompt-card baseline"><span>BASELINE PROMPT</span><strong>${iterationPrompts.baseline.label}</strong><pre>${iterationPrompts.baseline.text}</pre></article>
      <article class="prompt-card revised"><span>PATCHED PROMPT</span><strong>${iterationPrompts.revised.label}</strong><pre>${iterationPrompts.revised.text}</pre></article>
    </div>
    <div class="eval-note" id="policyRunSummary">先运行 v2 评测，或观察一次完整的 A2A 交接与回归。</div>
    <table class="test-table iteration-table" style="margin-top:10px">
      <thead><tr><th>评测任务</th><th>可验证断言</th><th>结果</th></tr></thead>
      <tbody>${iterationEvalCases.map((item, index) => `<tr data-eval-id="${item.id}"><td><span class="eval-id">0${index + 1} · ${item.dimension}</span><strong>${item.title}</strong></td><td>${item.assertion}</td><td class="test-status" data-test="${item.id}">待运行</td></tr>`).join("")}</tbody>
    </table>
    <div class="a2a-handoff" id="a2aHandoff">A2A 交接包尚未生成：Evaluator 会把失败 ID、证据与回归门槛交给 Reviewer。</div>
    <div class="trace-panel a2a-trace-panel"><div class="trace-empty" id="a2aTraceEmpty">运行自迭代后，这里会显示 Builder、Evaluator、Reviewer 与 Harness Gate 的交接轨迹。</div><ol class="trace-list" id="a2aTraceList"></ol></div>
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
  $("#policyRunSummary").textContent = `${label}：${report.passed}/${report.total} 通过 · 安全门禁 ${report.safetyPass ? "通过" : "失败"} · 同一评测集可用于下一轮回归。`;
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
  $("#a2aTraceEmpty").textContent = "A2A 轨迹运行中：先看 v1 的失败，再看 Prompt Patch 与 v2 回归。";
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
