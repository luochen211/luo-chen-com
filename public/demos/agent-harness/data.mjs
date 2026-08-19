export const products = [
  {
    id: "airflow-lite",
    brand: "Aero",
    name: "AirFlow Lite",
    price: 329,
    type: "半入耳",
    anc: 18,
    battery: 7,
    totalBattery: 28,
    weight: 4.1,
    latency: 92,
    mic: 7.8,
    comfort: 9.2,
    sound: "清亮",
    colors: ["冰川白", "雾蓝"],
    tags: ["通勤", "轻量", "长戴舒适"],
    evidence: [
      "单耳 4.1g，半入耳结构对耳道压力较低。",
      "地铁实测可削弱持续低频，但无法完全覆盖报站声。",
      "双麦克风通话算法在室内稳定，临街环境偶有风噪。"
    ],
    tradeoff: "降噪能力偏弱，不适合极嘈杂通勤。"
  },
  {
    id: "quiet-pod-s3",
    brand: "North",
    name: "QuietPod S3",
    price: 469,
    type: "入耳",
    anc: 42,
    battery: 6.5,
    totalBattery: 26,
    weight: 5.2,
    latency: 78,
    mic: 8.6,
    comfort: 7.6,
    sound: "均衡",
    colors: ["石墨黑", "暖灰"],
    tags: ["地铁", "强降噪", "通话"],
    evidence: [
      "自适应降噪峰值 42dB，对地铁低频轰鸣抑制明显。",
      "三麦克风配合抗风噪结构，骑行时仍建议降低通话预期。",
      "默认耳塞支撑牢固，连续佩戴两小时后存在轻微胀感。"
    ],
    tradeoff: "长时间佩戴舒适度一般，接近预算上限。"
  },
  {
    id: "sonic-mini-pro",
    brand: "Sonic",
    name: "Mini Pro",
    price: 399,
    type: "入耳",
    anc: 35,
    battery: 8,
    totalBattery: 34,
    weight: 4.6,
    latency: 65,
    mic: 8.1,
    comfort: 8.3,
    sound: "低频增强",
    colors: ["深海蓝", "珍珠白"],
    tags: ["续航", "通勤", "低延迟"],
    evidence: [
      "单次 8 小时续航，开启降噪后约 6.5 小时。",
      "35dB 降噪覆盖公交和办公室持续噪声。",
      "游戏模式延迟约 65ms，切换时会牺牲少量续航。"
    ],
    tradeoff: "低频较重，偏好自然人声的用户需要调整 EQ。"
  },
  {
    id: "clearcall-one",
    brand: "Morrow",
    name: "ClearCall One",
    price: 499,
    type: "入耳",
    anc: 38,
    battery: 7,
    totalBattery: 30,
    weight: 5,
    latency: 84,
    mic: 9.3,
    comfort: 8,
    sound: "人声突出",
    colors: ["曜石黑"],
    tags: ["会议", "通话", "多设备"],
    evidence: [
      "骨传导拾音与三麦系统可分离大部分键盘声和室内谈话声。",
      "支持双设备连接，电脑会议与手机来电切换约 2 秒。",
      "人声频段略微前置，播客与会议清晰，器乐层次普通。"
    ],
    tradeoff: "售价压线，音乐综合表现不是同价位最强。"
  },
  {
    id: "cloudbuds-2",
    brand: "Mizu",
    name: "CloudBuds 2",
    price: 259,
    type: "半入耳",
    anc: 0,
    battery: 8.5,
    totalBattery: 36,
    weight: 3.8,
    latency: 105,
    mic: 7.4,
    comfort: 9.4,
    sound: "柔和",
    colors: ["云白", "浅粉"],
    tags: ["轻量", "办公室", "性价比"],
    evidence: [
      "单耳 3.8g，开放感明显，适合需要感知环境的办公室。",
      "不具备主动降噪，仅通过算法降低通话背景噪声。",
      "充电盒提供约 36 小时总续航。"
    ],
    tradeoff: "没有主动降噪，地铁场景需要提高音量。"
  },
  {
    id: "railbeat-x2",
    brand: "Forge",
    name: "RailBeat X2",
    price: 429,
    type: "入耳",
    anc: 45,
    battery: 5.5,
    totalBattery: 22,
    weight: 5.8,
    latency: 72,
    mic: 7.5,
    comfort: 7.1,
    sound: "动感",
    colors: ["工业灰", "电光蓝"],
    tags: ["最强降噪", "地铁", "运动"],
    evidence: [
      "45dB 深度降噪是样本商品中最高，低频隔绝感强。",
      "IPX5 防水，耳翼结构在运动中稳定。",
      "强降噪模式单次续航约 4.5 小时。"
    ],
    tradeoff: "重量较高、续航较短，不适合全天佩戴。"
  },
  {
    id: "studio-dot",
    brand: "Timbre",
    name: "Studio Dot",
    price: 489,
    type: "入耳",
    anc: 32,
    battery: 7.5,
    totalBattery: 29,
    weight: 4.9,
    latency: 88,
    mic: 7.9,
    comfort: 8.1,
    sound: "自然",
    colors: ["砂岩色", "墨黑"],
    tags: ["音质", "自然人声", "通勤"],
    evidence: [
      "调音以中性为主，人声位置自然，低频量感克制。",
      "32dB 降噪足以覆盖办公室空调声，对地铁低频表现中等。",
      "支持高码率编码，但部分手机需手动开启。"
    ],
    tradeoff: "降噪与通话能力均衡，但没有单项绝对领先。"
  },
  {
    id: "daylong-nano",
    brand: "Orbit",
    name: "Daylong Nano",
    price: 359,
    type: "入耳",
    anc: 28,
    battery: 10,
    totalBattery: 42,
    weight: 4.7,
    latency: 96,
    mic: 7.6,
    comfort: 8.5,
    sound: "温暖",
    colors: ["午夜黑", "橄榄绿"],
    tags: ["超长续航", "旅行", "通勤"],
    evidence: [
      "关闭降噪单次约 10 小时，充电盒总续航约 42 小时。",
      "28dB 降噪更适合公交和办公室，地铁深层低频仍可感知。",
      "腔体较小，对小耳廓用户更友好。"
    ],
    tradeoff: "降噪深度普通，通话抗风噪表现一般。"
  },
  {
    id: "openloop-air",
    brand: "Arc",
    name: "OpenLoop Air",
    price: 379,
    type: "开放式",
    anc: 0,
    battery: 9,
    totalBattery: 32,
    weight: 6.2,
    latency: 110,
    mic: 8,
    comfort: 9,
    sound: "开阔",
    colors: ["钛灰", "米白"],
    tags: ["开放式", "安全感知", "长戴"],
    evidence: [
      "耳挂式开放结构不会堵塞耳道，适合全天候弱音乐使用。",
      "可以持续感知报站与车辆声，不提供主动降噪。",
      "漏音控制在中等音量下较好，安静会议室仍建议降低音量。"
    ],
    tradeoff: "不适合追求沉浸或强降噪的地铁用户。"
  },
  {
    id: "focus-bean",
    brand: "Mono",
    name: "Focus Bean",
    price: 299,
    type: "入耳",
    anc: 30,
    battery: 6,
    totalBattery: 24,
    weight: 4.3,
    latency: 82,
    mic: 7.7,
    comfort: 8.7,
    sound: "均衡",
    colors: ["奶油白", "炭黑"],
    tags: ["小巧", "性价比", "通勤"],
    evidence: [
      "小型腔体与四套耳塞，适配范围较广。",
      "30dB 降噪可明显降低公交持续噪声。",
      "价格较低，但不支持双设备连接。"
    ],
    tradeoff: "总续航与连接能力偏基础。"
  }
];

export const scenarios = [
  {
    id: "complete",
    title: "完整需求",
    prompt: "预算 500 元以内，每天坐地铁 40 分钟，想要降噪强、通话清楚的耳机。",
    note: "直接进入搜索与比较"
  },
  {
    id: "missing",
    title: "缺少预算",
    prompt: "我每天坐地铁，想买一副降噪强、戴久一点也舒服的耳机。",
    note: "系统会先追问预算"
  },
  {
    id: "comfort",
    title: "舒适优先",
    prompt: "预算 400 元，办公室一天戴 6 小时，不喜欢堵耳朵，续航要够。",
    note: "查看约束如何改变排序"
  },
  {
    id: "compare",
    title: "指定对比",
    prompt: "QuietPod S3 和 Sonic Mini Pro 怎么选？我更在意地铁降噪和续航。",
    note: "直接路由到对比工具"
  }
];

export const iterationPrompts = {
  baseline: {
    version: "v1",
    label: "基线 Prompt · v1",
    text: `你是购物决策 Agent，目标是帮助用户减少买错耳机的概率。
根据用户当前消息提取预算、场景和偏好，在预算内搜索商品，
给出一个首选和一个备选。如果信息不完整，优先继续搜索，尽量不要打断用户。`
  },
  revised: {
    version: "v2",
    label: "修订 Prompt · v2",
    text: `你是购物决策 Agent，目标是帮助用户减少买错耳机的概率。
先编译任务约束，再决定是否行动。
预算和用户明确表达的排除条件是硬约束，必须写入 State 并在排序前过滤；
缺少会改变结果的预算时先澄清；每个推荐都要能回指商品数据证据。
工具失败只能按 Harness 的有限重试策略处理，不得用猜测填补实时事实。`
  }
};

export const iterationEvalCases = [
  {
    id: "negative-constraint",
    dimension: "VERIFY",
    title: "否定偏好不丢失",
    prompt: "预算 500 元，通勤坐地铁，不喜欢堵耳朵，但希望尽量安静。",
    assertion: "avoidInEar 保持为 true，候选不能包含入耳式，避免用户买到明确不要的佩戴形式"
  },
  {
    id: "clarify-budget",
    dimension: "UNDERSTAND",
    title: "缺少预算先澄清",
    prompt: "我每天坐地铁，想买一副降噪强、戴久一点也舒服的耳机。",
    assertion: "返回 clarify，并指出缺少 budget"
  },
  {
    id: "evidence-trace",
    dimension: "VERIFY",
    title: "推荐带证据轨迹",
    prompt: "预算 500 元以内，每天坐地铁 40 分钟，想要降噪强、通话清楚的耳机。",
    assertion: "返回 result，并经过工具与证据读取步骤，而不是凭记忆推荐"
  },
  {
    id: "safe-handoff",
    dimension: "ACT",
    title: "越界任务安全转交",
    prompt: "耳机坏了，我要查订单并申请售后退货。",
    assertion: "返回 handoff，不调用购买前商品工具"
  },
  {
    id: "bounded-recovery",
    dimension: "ACT",
    title: "工具故障可恢复",
    prompt: "预算 500 元以内，每天坐地铁 40 分钟，想要降噪强、通话清楚的耳机。",
    assertion: "出现工具错误后，按有限策略进入 recovery 并完成"
  },
  {
    id: "explicit-override",
    dimension: "UNDERSTAND",
    title: "明确新信息覆盖旧记忆",
    prompt: "预算 500 元，这次可以戴入耳，优先地铁降噪。",
    assertion: "新消息明确允许入耳，State 将 avoidInEar 改为 false"
  }
];
