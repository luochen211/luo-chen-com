import { products } from "./data.mjs";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

function contains(text, words) {
  return words.some((word) => text.toLowerCase().includes(word.toLowerCase()));
}

export function parseRequest(text, previous = {}) {
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
    avoidInEar: allowInEar ? false : (avoidInEar || previous.avoidInEar || false),
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

  async run(text) {
    const started = performance.now();
    const trace = [];
    const emit = async (step) => {
      trace.push(step);
      await this.emit(step);
    };
    const state = parseRequest(text, this.memory);

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
        message: "这个演示目前只处理购买前决策。售后问题需要订单、商家规则等实时信息，我会把任务转交给售后流程。",
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
    if (this.failNextTool) {
      this.failNextTool = false;
      await emit(traceStep("tool", "工具超时", "商品服务在 800ms 内未响应", "error", 802));
      await emit(traceStep("recovery", "降级与重试", "缩小返回字段并进行第 1 次重试", "warning", 35));
    }
    const found = searchProducts(state);
    await emit(traceStep("tool", "工具返回", `命中 ${found.length} 件预算内商品`, "success", this.failNextTool ? 61 : 47));
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
