const responseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['topic', 'turns', 'judge'],
  properties: {
    topic: { type: 'string' },
    turns: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['expert', 'angle', 'argument'],
        properties: {
          expert: { type: 'string' },
          angle: { type: 'string' },
          argument: { type: 'string' },
        },
      },
    },
    judge: {
      type: 'object',
      additionalProperties: false,
      required: ['verdict', 'insights', 'conflicts', 'blindSpots', 'actions'],
      properties: {
        verdict: { type: 'string' },
        insights: { type: 'array', items: { type: 'string' } },
        conflicts: { type: 'array', items: { type: 'string' } },
        blindSpots: { type: 'array', items: { type: 'string' } },
        actions: { type: 'array', items: { type: 'string' } },
      },
    },
  },
}

function normalizeExperts(experts) {
  if (!Array.isArray(experts)) return []

  return experts
    .slice(0, 6)
    .map((expert) => ({
      name: String(expert?.name || '').trim(),
      title: String(expert?.title || '').trim(),
      stance: String(expert?.stance || '').trim(),
    }))
    .filter((expert) => expert.name && expert.title && expert.stance)
}

function extractText(response) {
  if (typeof response.output_text === 'string') return response.output_text

  return (
    response.output
      ?.flatMap((item) => item.content || [])
      .filter((part) => part.type === 'output_text')
      .map((part) => part.text)
      .join('\n') || ''
  )
}

function buildInput(topic, experts) {
  const expertBrief = experts
    .map((expert, index) => `${index + 1}. ${expert.name}｜${expert.title}：${expert.stance}`)
    .join('\n')

  return `议题：
${topic}

参与专家：
${expertBrief}

请模拟一个高密度专家圆桌。每位专家必须从自己的方法论出发发言，并且至少回应一个其他专家可能忽略或误判的点。最后由主持人/判官 Agent 总结。

输出要求：
- 使用中文。
- 不要把这些角色写成神谕或真实本人发言；表达为“方法论视角的模拟分析”。
- 观点要具体，避免空泛鸡汤。
- 如果议题信息不足，直接把关键不确定性列入盲区。
- 返回 JSON，字段必须匹配 schema。`
}

export async function generateRoundtable({ apiKey, model, topic, experts }) {
  if (!apiKey) {
    const error = new Error('服务端还没有配置 OPENAI_API_KEY。')
    error.status = 500
    throw error
  }

  const cleanTopic = String(topic || '').trim().slice(0, 2400)
  const cleanExperts = normalizeExperts(experts)

  if (!cleanTopic) {
    const error = new Error('请先输入议题。')
    error.status = 400
    throw error
  }

  if (cleanExperts.length === 0) {
    const error = new Error('请至少选择一位专家。')
    error.status = 400
    throw error
  }

  const apiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-5.5',
      instructions:
        '你是一个严谨的多 Agent 圆桌主持系统。目标是帮助用户获得更高质量的判断，而不是制造戏剧化争吵。',
      input: [
        {
          role: 'user',
          content: [{ type: 'input_text', text: buildInput(cleanTopic, cleanExperts) }],
        },
      ],
      reasoning: { effort: 'low' },
      max_output_tokens: 2600,
      text: {
        format: {
          type: 'json_schema',
          name: 'expert_roundtable',
          strict: true,
          schema: responseSchema,
        },
      },
    }),
  })

  const payload = await apiResponse.json()

  if (!apiResponse.ok) {
    const error = new Error(payload.error?.message || 'OpenAI API 调用失败。')
    error.status = apiResponse.status
    throw error
  }

  const outputText = extractText(payload)
  try {
    return JSON.parse(outputText)
  } catch {
    const error = new Error('模型返回内容不是可解析的 JSON。')
    error.status = 502
    throw error
  }
}
