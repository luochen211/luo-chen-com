import { iterationEvalCases, iterationPrompts, products } from "./data.mjs";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

function contains(text, words) {
  return words.some((word) => text.toLowerCase().includes(word.toLowerCase()));
}

export function parseRequest(text, previous = {}, { preserveNegativePreference = true } = {}) {
  const budgetMatch = text.match(/(?:预算|以内|不超过|最多)[^\d]{0,5}(\d{2,4})|(\d{2,4})\s*元/);
  const budget = Number(budgetMatch?.[1] || budgetMatch?.[2]) || previous.budget || null;
  const named = products.filter((product) =>
    text.toLowerCase().includes(product.name.toLowerCase())
  ).map((product) => product.id);
  const scene = contains(text, ["地铁", "公交", "通勤"]) ? "通勤"
    : contains(text, ["办公室", "会议", "工作"]) ? "办公"
    : contains(text, ["运动", "跑步", "骑行"]) ? "运动"
    : previous.scene || null;
  const priorities = [];
  if (contains(text, ["降噪", "安静", "地铁"])) priorities.push("anc");
  if (contains(text, ["通话", "会议", "麦克风"])) priorities.push("mic");
  if (contains(text, ["舒服", "舒适", "戴久", "堵耳朵", "不喜欢堵"])) priorities.push("comfort");
  if (contains(text, ["续航", "电量", "一天"])) priorities.push("battery");
  if (contains(text, ["音质", "人声", "音乐"])) priorities.push("sound");
  const allowInEar = contains(text, ["可以入耳", "接受入耳", "入耳也可以", "这次可以戴入耳"]);
  const avoidInEar = contains(text, ["不喜欢堵", "不要入耳", "半入耳", "开放式"]);
  const intent = named.length >= 2 || contains(text, ["对比", "怎么选", "区别"])
    ? "COMPARE"
    : contains(text, ["售后", "退货", "坏了"])
      ? "AFTER_SALES"
      : "FIND_PRODUCT";

  return {
    budget,
    scene,
    priorities: [...new Set([...(previous.priorities || []), ...priorities])],
    avoidInEar: preserveNegativePreference
      ? (allowInEar ? false : (avoidInEar || previous.avoidInEar || false))
      : false,
    named,
    intent
  };
}

function scoreProduct(product, state) {
  if (state.budget && product.price > state.budget) return -999;
  if (state.avoidInEar && product.type === "入耳") return -250;
  const weights = {
    anc: state.priorities.includes("anc") ? 2.2 : 0.7,
    mic: state.priorities.includes("mic") ? 2 : 0.6,
    comfort: state.priorities.includes("comfort") ? 2.2 : 0.8,
    battery: state.priorities.includes("battery") ? 1.8 : 0.6
  };
  let score =
    product.anc / 5 * weights.anc +
    product.mic * weights.mic +
    product.comfort * weights.comfort +
    product.battery * weights.battery;
  if (state.scene === "通勤") score += product.anc / 4;
  if (state.scene === "办公") score += product.mic + product.comfort;
  if (state.scene === "运动" && product.tags.includes("运动")) score += 10;
  score += Math.max(0, 6 - product.price / 100);
  return Math.round(score * 10) / 10;
}

export function searchProducts(args) {
  return products
    .map((product) => ({ ...product, score: scoreProduct(product, args) }))
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function compareProducts(ids) {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
}

function buildRecommendation(items, state) {
  const [best, second] = items;
  if (!best) {
    return {
      title: "当前约束下没有合适商品",
      body: "可以提高预算，或放宽佩戴形式与降噪要求后重新搜索。",
      reasons: [],
      caveat: "系统没有为了给出答案而忽略硬约束。"
    };
  }
  const reasonMap = {
    anc: `降噪 ${best.anc}dB，适合${state.scene || "日常"}环境`,
    mic: `通话评分 ${best.mic}/10`,
    comfort: `舒适度 ${best.comfort}/10，单耳 ${best.weight}g`,
    battery: `单次续航 ${best.battery} 小时`,
    sound: `${best.sound}调音`
  };
  const reasonKeys = [...new Set([
    ...(state.priorities.length ? state.priorities : ["comfort", "battery"]),
    "comfort",
    "battery",
    "anc",
    "mic"
  ])];
  const reasons = reasonKeys
    .slice(0, 3)
    .map((key) => reasonMap[key]);
  return {
    title: `首选 ${best.brand} ${best.name}`,
    body: `¥${best.price}，在预算内对“${state.priorities.map(labelPriority).join("、") || "综合体验"}”的匹配最完整。${second ? `备选 ${second.name} 更适合你愿意用部分核心能力换取另一项优势时。` : ""}`,
    reasons,
    caveat: best.tradeoff
  };
}

function labelPriority(priority) {
  return { anc: "降噪", mic: "通话", comfort: "舒适", battery: "续航", sound: "音质" }[priority];
}

function traceStep(type, title, detail, status = "success", duration = 0) {
  return { id: uid(), type, title, detail, status, duration };
}

export class ShoppingHarness {
  constructor({ onStep = () => {}, delay = 240 } = {}) {
    this.onStep = onStep;
    this.delay = delay;
    this.memory = {};
    this.failNextTool = false;
  }

  reset() {
    this.memory = {};
    this.failNextTool = false;
  }

  async emit(step) {
    this.onStep(step);
    if (this.delay) await wait(this.delay);
    return step;
  }

  async run(text, { promptVersion = iterationPrompts.revised.version } = {}) {
    const started = performance.now();
    const trace = [];
    const emit = async (step) => {
      trace.push(step);
      await this.emit(step);
    };
    const state = parseRequest(text, this.memory, {
      // v1 intentionally models the prompt defect found by the evaluator:
      // negative preferences are not promoted to hard constraints.
      preserveNegativePreference: promptVersion !== iterationPrompts.baseline.version
    });

    await emit(traceStep(
      "router",
      "任务路由",
      `识别为 ${state.intent}；置信度 ${state.intent === "COMPARE" ? "0.94" : "0.91"}`,
      "success",
      18
    ));

    if (state.intent === "AFTER_SALES") {
      await emit(traceStep("guardrail", "能力边界", "当前 Demo 只覆盖购买前决策，售后任务转人工。", "warning", 6));
      return {
        kind: "handoff",
        message: "当前互动只处理购买前决策。售后问题需要订单、商家规则等实时信息，任务会转交给售后流程。",
        trace,
        state,
        totalDuration: Math.round(performance.now() - started)
      };
    }

    if (!state.budget && state.intent !== "COMPARE") {
      this.memory = { ...this.memory, ...state };
      await emit(traceStep("context", "参数检查", "缺少硬约束：预算", "waiting", 9));
      return {
        kind: "clarify",
        message: "为了避免推荐一堆不合适的商品，我还需要知道：你的预算上限大约是多少？",
        trace,
        state,
        missing: ["budget"],
        totalDuration: Math.round(performance.now() - started)
      };
    }

    if (state.priorities.length === 0) state.priorities = ["comfort", "battery"];
    this.memory = { ...this.memory, ...state };
    await emit(traceStep(
      "context",
      "上下文编译",
      `预算 ${state.budget ? `¥${state.budget}` : "未限制"} · ${state.scene || "通用场景"} · ${state.priorities.map(labelPriority).join("/")}`,
      "success",
      12
    ));

    if (state.intent === "COMPARE" && state.named.length >= 2) {
      await emit(traceStep("tool", "compare_products", `输入 ${state.named.length} 个商品 ID`, "running", 0));
      const compared = compareProducts(state.named);
      await emit(traceStep("tool", "工具返回", `返回 ${compared.length} 条结构化商品记录`, "success", 44));
      await emit(traceStep("rag", "证据读取", `读取 ${compared.length * 3} 条商品说明与实测摘要`, "success", 31));
      return {
        kind: "result",
        message: buildRecommendation(
          compared.map((item) => ({ ...item, score: scoreProduct(item, state) })).sort((a, b) => b.score - a.score),
          state
        ),
        products: compared.map((item) => ({ ...item, score: scoreProduct(item, state) })).sort((a, b) => b.score - a.score),
        trace,
        state,
        totalDuration: Math.round(performance.now() - started)
      };
    }

    await emit(traceStep("tool", "search_products", "按预算、场景、偏好生成查询参数", "running", 0));
    const toolWillFail = this.failNextTool;
    if (toolWillFail) {
      this.failNextTool = false;
      await emit(traceStep("tool", "工具超时", "商品服务在 800ms 内未响应", "error", 802));
      await emit(traceStep("recovery", "降级与重试", "缩小返回字段并进行第 1 次重试", "warning", 35));
    }
    const found = searchProducts(state);
    await emit(traceStep("tool", "工具返回", `命中 ${found.length} 件预算内商品`, "success", toolWillFail ? 61 : 47));
    await emit(traceStep("rag", "证据读取", `从商品知识库读取 ${found.slice(0, 3).reduce((sum, item) => sum + item.evidence.length, 0)} 条依据`, "success", 28));
    await emit(traceStep("ranker", "候选排序", `按硬约束过滤，再计算 ${state.priorities.map(labelPriority).join("/") || "综合"}匹配度`, "success", 21));
    const top = found.slice(0, 3);

    return {
      kind: "result",
      message: buildRecommendation(top, state),
      products: top,
      trace,
      state,
      totalDuration: Math.round(performance.now() - started)
    };
  }
}

const metricGroups = {
  UNDERSTAND: ["clarify-budget", "explicit-override"],
  ACT: ["safe-handoff", "bounded-recovery"],
  VERIFY: ["negative-constraint", "evidence-trace"]
};

function assessIterationCase(testCase, result) {
  switch (testCase.id) {
    case "negative-constraint":
      return result.state.avoidInEar === true
        && result.products.every((product) => product.type !== "入耳");
    case "clarify-budget":
      return result.kind === "clarify" && result.missing.includes("budget");
    case "evidence-trace":
      return result.kind === "result"
        && result.products.length > 0
        && result.trace.some((step) => step.type === "tool")
        && result.trace.some((step) => step.type === "rag");
    case "safe-handoff":
      return result.kind === "handoff"
        && !result.trace.some((step) => step.type === "tool");
    case "bounded-recovery":
      return result.kind === "result"
        && result.trace.some((step) => step.status === "error")
        && result.trace.some((step) => step.type === "recovery");
    case "explicit-override":
      return result.state.avoidInEar === false;
    default:
      return false;
  }
}

function calculateMetrics(cases) {
  const metrics = {};
  for (const [name, ids] of Object.entries(metricGroups)) {
    const selected = cases.filter((item) => ids.includes(item.id));
    metrics[name] = {
      passed: selected.filter((item) => item.pass).length,
      total: selected.length
    };
  }
  metrics.COMPLETE = {
    passed: cases.filter((item) => item.pass).length,
    total: cases.length
  };
  return metrics;
}

export async function evaluateAgentPolicy(promptVersion = iterationPrompts.revised.version) {
  const cases = [];
  for (const testCase of iterationEvalCases) {
    const harness = new ShoppingHarness({ delay: 0 });
    if (testCase.id === "bounded-recovery") harness.failNextTool = true;
    const result = await harness.run(testCase.prompt, { promptVersion });
    cases.push({
      ...testCase,
      pass: assessIterationCase(testCase, result),
      result
    });
  }
  const metrics = calculateMetrics(cases);
  const safetyCases = cases.filter((item) => ["negative-constraint", "safe-handoff"].includes(item.id));
  return {
    promptVersion,
    cases,
    metrics,
    passed: cases.filter((item) => item.pass).length,
    total: cases.length,
    safetyPass: safetyCases.every((item) => item.pass)
  };
}

function iterationStep(agent, title, detail, status = "success") {
  return {
    ...traceStep("a2a", title, detail, status),
    agent
  };
}

function isNonRegressive(baseline, revised) {
  const metricNames = [...Object.keys(metricGroups), "COMPLETE"];
  return revised.passed > baseline.passed
    && revised.safetyPass
    && metricNames.every((name) => revised.metrics[name].passed >= baseline.metrics[name].passed);
}

export async function runSelfIteration({ onStep = () => {}, delay = 180 } = {}) {
  const trace = [];
  const emit = async (step) => {
    trace.push(step);
    onStep(step);
    if (delay) await wait(delay);
  };

  await emit(iterationStep(
    "Builder Agent",
    "Builder · 生成基线 Prompt v1",
    "先交付可运行的购物策略，并把 Prompt 版本写入任务包。"
  ));
  await emit(iterationStep(
    "Evaluator Agent",
    "Evaluator · 运行固定评测集",
    `读取 ${iterationEvalCases.length} 条参数化任务，分别检查理解、行动、证据与完成。`
  ));
  const baseline = await evaluateAgentPolicy(iterationPrompts.baseline.version);
  const failures = baseline.cases.filter((item) => !item.pass);
  await emit(iterationStep(
    "Evaluator Agent",
    `Evaluator · v1 得分 ${baseline.passed}/${baseline.total}`,
    failures.length
      ? `失败样本：${failures.map((item) => item.title).join("、")}。返回结构化证据，不只返回一句“效果不好”。`
      : "全部通过，暂不触发修订。",
    failures.length ? "warning" : "success"
  ));
  const handoff = {
    protocol: "A2A",
    from: "Evaluator Agent",
    to: "Reviewer Agent",
    goal: "提升固定评测集得分且不降低安全门禁",
    failures: failures.map((item) => ({ id: item.id, evidence: item.assertion }))
  };
  await emit(iterationStep(
    "Reviewer Agent",
    "Reviewer · 归因失败模式",
    failures.length
      ? "发现用户的否定偏好没有进入 State；问题属于 Prompt 约束缺失，不是继续堆角色。"
      : "没有可复现失败，Reviewer 不提出无依据的改动。",
    failures.length ? "warning" : "success"
  ));
  await emit(iterationStep(
    "A2A Handoff",
    "结构化交接 · 失败证据 → 修订建议",
    failures.length
      ? "传递目标、失败 ID、可观察证据和回归门槛；不复制整段聊天轨迹。"
      : "传递“保持当前版本”的结论和评测证据。"
  ));
  await emit(iterationStep(
    "Builder Agent",
    "Builder · 应用 Prompt Patch → v2",
    "将硬约束前置到 State 与过滤阶段，并保留原有澄清、证据和有限重试规则。"
  ));
  const revised = await evaluateAgentPolicy(iterationPrompts.revised.version);
  const accepted = isNonRegressive(baseline, revised);
  await emit(iterationStep(
    "Evaluator Agent",
    `Evaluator · v2 回归 ${revised.passed}/${revised.total}`,
    `使用同一批测试重跑；VERIFY ${revised.metrics.VERIFY.passed}/${revised.metrics.VERIFY.total}，ACT ${revised.metrics.ACT.passed}/${revised.metrics.ACT.total}。`
  ));
  await emit(iterationStep(
    "Harness Gate",
    accepted ? "Gate · 接受 v2" : "Gate · 拒绝 v2",
    accepted
      ? "总分提升且所有分组指标不回退，修订 Prompt 才能进入下一轮基线。"
      : "分数没有严格提升或安全门禁回退，禁止把候选版本写回生产。",
    accepted ? "success" : "error"
  ));

  return {
    trace,
    baseline,
    revised,
    accepted,
    handoff,
    prompts: iterationPrompts
  };
}
