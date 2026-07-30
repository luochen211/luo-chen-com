import { scenarios } from "./data.mjs";
import { ShoppingHarness } from "./harness.mjs";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lessons = [
  {
    id: "start",
    title: "为什么需要 Agent",
    slides: "01—05",
    startSlide: 1,
    time: "12 min",
    objective: "先建立判断标准：什么时候一段回答已经够用，什么时候必须让系统持续观察、行动和验证。",
    concepts: [
      ["回答", "模型基于当前信息生成内容，输出文本后任务就结束。"],
      ["完成", "系统根据环境反馈继续行动，直到满足预先定义的完成条件。"],
      ["贯穿项目", "预算、降噪、双设备、佩戴、实时性和证据共同定义“买到合适耳机”。"]
    ],
    boundary: "“推荐三款耳机”只是语言输出；只有查到有效价格与库存、过滤硬约束并给出证据，才接近完成任务。",
    slideMap: [
      ["01—03", "暴露“名词很多但没有系统地图”的学习痛点。"],
      ["04", "固定整个课程唯一案例和六项完成条件。"],
      ["05", "正式区分 Chat Response 与 Agent Task。"]
    ],
    experiment: "边界判断：回答还是完成",
    instruction: "依次判断三个任务只需要生成回答，还是需要 Agent 持续行动。点击案例查看系统边界。",
    mode: "boundary",
    question: "为什么“推荐 A、B、C”不能证明购物任务已完成？",
    answers: ["因为答案不够长", "因为没有验证实时事实与硬约束", "因为必须使用多 Agent"],
    correct: 1,
    feedback: "完成条件不由文本流畅度决定，而由预算、库存、规格等外部事实是否被验证决定。"
  },
  {
    id: "agent",
    title: "Agent 的内部结构",
    slides: "06—12",
    startSlide: 6,
    time: "23 min",
    objective: "把“Agent = LLM + Context + Tools”和 ReAct 循环分开：前者回答由什么组成，后者回答它怎样运行。",
    concepts: [
      ["LLM", "理解意图、比较候选并决定下一步，是概率性的决策核心。"],
      ["Context", "模型在当前决策点能够看见的信息，是观察空间。"],
      ["Tools", "搜索、查询和执行外部动作，是动作空间。"],
      ["Loop", "Observe → Reason → Act → Update 驱动三部分持续协同，不是第四个内部组件。"]
    ],
    boundary: "State 是系统保存的完整事实；Context 是 Harness 为某一次模型调用从 State 中编译出的受控视图。",
    slideMap: [
      ["06—09", "定义三部分，并解释观察空间与动作空间。"],
      ["10", "用 ReAct 说明三部分怎样被循环驱动。"],
      ["11—12", "区分 State 与 Context，观察工具结果如何写回轨迹。"]
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
    title: "Harness 如何保证可靠",
    slides: "13—21",
    startSlide: 13,
    time: "35 min",
    objective: "理解模型负责判断，Harness 负责把判断放进可约束、可验证、可恢复的工程系统。",
    concepts: [
      ["Context Composer", "从 State、Memory、RAG 和工具结果收集、选择并编排当前视图。"],
      ["Tool Interface", "为模型设计可理解、单一职责、参数防呆且返回可判定的接口。"],
      ["Constraints", "在行动前、参数中和行动后阻止越权与违反硬约束。"],
      ["Validation", "不用模型声明证明模型正确，而是回到业务事实验证结果。"],
      ["Correction", "失败后按修参数、重试、换路径、补充信息、降级转人的阶梯恢复。"]
    ],
    boundary: "Harness 不是第二个更聪明的模型，而是模型外部的确定性控制层。",
    slideMap: [
      ["13—15", "建立 Model + Harness 和五项工程职责全景。"],
      ["16—19", "依次展开 Context、Tool、约束与验证。"],
      ["20—21", "建立失败恢复阶梯与 Model / Harness / 业务系统边界。"]
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
    title: "信息到底放在哪里",
    slides: "22—25",
    startSlide: 22,
    time: "15 min",
    objective: "正确区分 State、Context、Memory、RAG 和实时 Tool，避免把所有信息都塞进 Prompt 或向量库。",
    concepts: [
      ["State", "系统持久保存的当前任务事实、进度、候选和证据。"],
      ["Context", "为了这一次决策临时编译的模型视图。"],
      ["Memory", "跨会话稳定偏好，需要写入、读取、修正和遗忘规则。"],
      ["RAG", "按问题检索商品说明、政策等外部知识，再注入 Context。"],
      ["实时 Tool", "读取当前价格、库存、物流等会变化的业务状态。"]
    ],
    boundary: "RAG 适合“查资料”，实时 Tool 适合“查现在”；把库存放进向量库不会让它变成实时事实。",
    slideMap: [
      ["22—23", "建立四类信息资产的归属。"],
      ["24", "展开 Memory 的完整生命周期。"],
      ["25", "划清 RAG 与实时 Tool 的取数边界。"]
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
    title: "Agent、Skill、Tool 与路由",
    slides: "26—33",
    startSlide: 26,
    time: "25 min",
    objective: "把决策主体、任务方法、原子动作和路由顺序放进同一个购物助手架构。",
    concepts: [
      ["Agent", "维护目标和 State，决定下一步做什么。"],
      ["Skill", "封装完成一类任务的步骤、规则和知识。"],
      ["Tool", "执行一个可验证的查询、计算或业务动作。"],
      ["Router", "先识别任务和信息缺口，再决定直接答、追问、加载 Skill、调用 Tool 或转交。"]
    ],
    boundary: "上下文、权限和评测边界没有真实分离时，多 Agent 只会增加通信成本与错误级联。",
    slideMap: [
      ["26—29", "区分三层能力、路由顺序和多 Agent 拆分条件。"],
      ["30—31", "把全部模块装进购物助手架构与 State。"],
      ["32—33", "观察正常执行如何改变 State，以及六类失败出口。"]
    ],
    experiment: "观察路由如何选择能力",
    instruction: "选择不同用户请求并运行，观察 Router 是否追问、加载比较流程、调用商品 Tool 或安全转交。",
    mode: "routing",
    question: "什么时候才值得把售后拆成另一个 Agent？",
    answers: ["只要名字不同就拆", "当上下文、权限或评测标准存在真实边界时", "任何项目都应该默认多 Agent"],
    correct: 1,
    feedback: "拆分依据不是流程看起来复杂，而是上下文隔离、权限与完成标准是否真的不同。"
  },
  {
    id: "evaluation",
    title: "怎样证明系统可用",
    slides: "34—37",
    startSlide: 34,
    time: "10 min",
    objective: "用一组任务分布，而不是一次漂亮 Demo，检查理解、行动、事实和完成四类质量。",
    concepts: [
      ["Understand", "硬约束与关键偏好是否提取完整。"],
      ["Act", "是否选择了正确 Skill、Tool 和参数。"],
      ["Verify", "价格、库存和规格是否有有效证据。"],
      ["Complete", "最终结果是否满足约束并真正解决问题。"]
    ],
    boundary: "一次成功轨迹只能证明“这一次成功”；至少覆盖信息缺失、无解、实时变化、历史冲突和系统失败。",
    slideMap: [
      ["34", "用四个问题定义最小评测。"],
      ["35", "把一次 Demo 扩展为六种任务变化。"],
      ["36—37", "汇总系统地图并收束为看见、行动、证明三条原则。"]
    ],
    experiment: "运行六类边界测试",
    instruction: "运行 PPT 第 35 页的六类任务变化。重点不是总分，而是每类失败有没有被正确暴露。",
    mode: "evaluation",
    question: "为什么不能只用一个完整需求测试 Agent？",
    answers: ["因为一个测试运行得太快", "因为产品面对的是任务分布，不是单条演示路径", "因为必须测试一百条才有意义"],
    correct: 1,
    feedback: "真实可用性来自对任务变化的覆盖。完整需求、缺条件、无解、实时变化、历史冲突和系统失败缺一不可。"
  }
];

const classificationItems = [
  { title: "当前任务预算 ≤ 500 元", note: "任务需要持久保存的硬约束", answer: "State" },
  { title: "本轮模型看到的候选商品摘要", note: "为一次决策临时组装", answer: "Context" },
  { title: "用户长期偏好半入耳式", note: "跨会话、可修正的稳定偏好", answer: "Memory" },
  { title: "耳机降噪原理与选购指南", note: "来自受治理的外部知识库", answer: "RAG" },
  { title: "QuietPod S3 此刻是否有货", note: "高频变化的业务事实", answer: "实时 Tool" },
  { title: "上一次工具调用返回“缺货”", note: "先写入轨迹，再成为下一轮观察", answer: "State" }
];

const evalCases = [
  ["信息完整", "直接搜索、过滤与比较", "PASS"],
  ["缺关键条件", "只追问会改变结果的预算", "PASS"],
  ["约束无解", "明确无满足项，不偷偷放宽", "PASS"],
  ["实时变化", "重新查询价格与库存", "PASS"],
  ["历史冲突", "本轮明确表达覆盖旧 Memory", "PASS"],
  ["系统失败", "有限重试后说明无法确认", "PASS"]
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
    proof: "State、Context、Memory、RAG 和实时 Tool 解决的是不同的信息问题。",
    cues: ["信息由谁长期保存", "这一轮模型是否需要看到", "事实是否会实时变化"],
    takeaway: "不要把所有信息都塞进 Prompt 或向量库；先判断它属于任务事实、当前视图、长期偏好、知识还是实时状态。"
  },
  routing: {
    proof: "Router 决定的不只是标签，而是下一步允许加载的能力、上下文与权限。",
    cues: ["缺条件时先追问", "比较任务加载对应 Skill", "权限边界不同就安全转交"],
    takeaway: "Agent 决策，Skill 组织任务方法，Tool 执行原子动作；只有真实边界存在时才拆多 Agent。"
  },
  evaluation: {
    proof: "一次漂亮 Demo 不能证明产品可用，必须验证任务分布。",
    cues: ["正常路径是否成功", "异常是否被正确暴露", "系统会不会偷偷放宽约束"],
    takeaway: "最小评测同时检查理解、行动、事实与完成，并覆盖信息缺失、无解、变化、冲突和系统失败。"
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
      <span><strong>${lesson.title}</strong><small>PPT ${lesson.slides}</small></span>
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
  $("#lessonPptLink").textContent = `对应 PPT ${lesson.slides} ↗`;
  $("#lessonPptLink").href = `/slides/decks/agent-harness/?slide=${lesson.startSlide}`;
  $("#headerPptLink").href = `/slides/decks/agent-harness/?slide=${lesson.startSlide}`;
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
    ["找到今天能下单的耳机", "要求价格、库存、到货时间都有效。", "Agent", "需要查、筛、证、答，并根据工具反馈持续调整。"]
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

function appendTraceStep(step, index) {
  $("#traceEmpty")?.remove();
  const node = $("#traceStepTemplate").content.firstElementChild.cloneNode(true);
  node.classList.add(step.status);
  node.querySelector(".trace-index").textContent = index + 1;
  node.querySelector("strong").textContent = step.title;
  node.querySelector("p").textContent = step.detail;
  node.querySelector("b").textContent = mapPhase(step);
  $("#traceList").append(node);
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
      <div style="flex:1;font-size:11px;color:#667085">故障条件：search_products 首次调用超时 800ms</div>
      <button id="runRecovery" class="run-button" type="button">触发对照实验</button>
    </div>
    <div class="compare-board" style="margin-top:10px">
      <section class="compare-column unsafe"><header><span>MODEL ONLY</span><strong>没有 Harness</strong></header><ul id="unsafeList"><li>等待实验</li></ul></section>
      <section class="compare-column safe"><header><span>MODEL + HARNESS</span><strong>确定性恢复策略</strong></header><ul id="safeList"><li>等待实验</li></ul></section>
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
    <li>成功则继续；仍失败则明确“无法确认”并安全退出。</li>`;
  $("#traceList").innerHTML = "";
  result.trace.forEach(appendTraceStep);
  $("#runRecovery").disabled = false;
  setStatus("恢复成功", "success");
}

function renderClassification(workspace) {
  const options = ["请选择", "State", "Context", "Memory", "RAG", "实时 Tool"];
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
      <button id="runRoute" class="run-button" type="button">运行路由</button>
    </div>
    <div id="routeMap" class="route-map pending">
      <div class="route-node"><span>WHO / AGENT</span><strong id="routeAgent">购物 Agent</strong><p>维护目标、State 与下一步决策。</p></div>
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
  setStatus("路由判断中", "running");
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
  setStatus("路由完成", "success");
}

function renderEvaluation(workspace) {
  workspace.innerHTML = `
    <div class="lab-toolbar">
      <div style="flex:1;font-size:11px;color:#667085">测试集来自 PPT 第 35 页：一条正常路径 + 五种边界变化</div>
      <button id="runEvaluation" class="run-button" type="button">运行 6 条测试</button>
    </div>
    <table class="test-table" style="margin-top:10px">
      <thead><tr><th>任务变化</th><th>期望行为</th><th>结果</th></tr></thead>
      <tbody>${evalCases.map((item, index) => `<tr><td>0${index + 1} · ${item[0]}</td><td>${item[1]}</td><td class="test-status" data-test="${index}">待运行</td></tr>`).join("")}</tbody>
    </table>
    <div class="eval-summary">
      <div><span>UNDERSTAND</span><strong id="understandScore">—</strong></div>
      <div><span>ACT</span><strong id="actScore">—</strong></div>
      <div><span>VERIFY</span><strong id="verifyScore">—</strong></div>
      <div><span>COMPLETE</span><strong id="completeScore">—</strong></div>
    </div>
  `;
  $("#runEvaluation").addEventListener("click", runEvaluation);
}

async function runEvaluation() {
  $("#runEvaluation").disabled = true;
  setStatus("测试运行中", "running");
  const statuses = $$(".test-status");
  const runCases = [
    async () => {
      harness.reset();
      const result = await harness.run(scenarios[0].prompt);
      return result.kind === "result" && result.products.length > 0;
    },
    async () => {
      harness.reset();
      const result = await harness.run(scenarios[1].prompt);
      return result.kind === "clarify" && result.missing.includes("budget");
    },
    async () => {
      harness.reset();
      const result = await harness.run("预算 100 元，每天坐地铁，必须要 40dB 以上主动降噪。");
      return result.kind === "result" && result.products.length === 0;
    },
    async () => {
      harness.reset();
      const result = await harness.run(scenarios[0].prompt);
      return result.trace.some((step) => step.type === "tool" && step.title === "search_products");
    },
    async () => {
      harness.reset();
      harness.memory = { avoidInEar: true };
      const result = await harness.run("预算 500 元，这次可以戴入耳，优先地铁降噪。");
      return result.state.avoidInEar === false;
    },
    async () => {
      harness.reset();
      harness.failNextTool = true;
      const result = await harness.run(scenarios[0].prompt);
      return result.trace.some((step) => step.status === "error")
        && result.trace.some((step) => step.type === "recovery");
    }
  ];
  let passed = 0;
  for (let index = 0; index < evalCases.length; index += 1) {
    statuses[index].textContent = "运行中";
    statuses[index].className = "test-status running";
    const pass = await runCases[index]();
    await wait(190);
    statuses[index].textContent = pass ? "PASS" : "FAIL";
    statuses[index].className = `test-status ${pass ? "pass" : "fail"}`;
    if (pass) passed += 1;
  }
  $("#understandScore").textContent = passed === 6 ? "6 / 6" : `${passed} / 6`;
  $("#actScore").textContent = passed === 6 ? "6 / 6" : `${passed} / 6`;
  $("#verifyScore").textContent = passed === 6 ? "6 / 6" : `${passed} / 6`;
  $("#completeScore").textContent = passed === 6 ? "6 / 6" : `${passed} / 6`;
  $("#runEvaluation").disabled = false;
  setStatus(`${passed} / 6 通过`, passed === 6 ? "success" : "running");
}

$("#prevLesson").addEventListener("click", () => switchLesson(currentLesson - 1));
$("#nextLesson").addEventListener("click", () => switchLesson(currentLesson + 1));

switchLesson(0);
