// Upstream repositories with merged pull requests from luochen211.
// Star and PR counts are a snapshot; refresh them together with `asOf`.
export const openSourceAsOf = '2026-10-28'

const contributions = [
  { repo: 'obra/superpowers', stars: 306644, merged: 1, zh: 'Agent 技能框架', en: 'Agent skills framework' },
  { repo: 'langgenius/dify', stars: 159761, merged: 7, zh: 'Agent 工作流平台', en: 'Agentic workflow platform' },
  { repo: 'career-ops-hq/career-ops', stars: 77976, merged: 112, zh: 'AI 求职 Agent', en: 'AI job-search agent' },
  { repo: 'ai-job-search-dev/ai-job-search', stars: 66883, merged: 2, zh: '本地 AI 求职框架', en: 'Local AI job-application framework' },
  { repo: 'reactive-resume/reactive-resume', stars: 44962, merged: 1, zh: '开源简历编辑器', en: 'Open-source resume builder' },
  { repo: 'srbhr/Resume-Matcher', stars: 28899, merged: 1, zh: 'AI 简历工具', en: 'AI resume harness' },
  { repo: 'steipete/CodexBar', stars: 22858, merged: 3, zh: 'Codex / Claude Code 用量栏', en: 'Codex and Claude Code usage bar' },
  { repo: 'Arize-ai/phoenix', stars: 12038, merged: 3, zh: 'AI 可观测与评测', en: 'AI observability and evaluation' },
  { repo: 'mcp-use/mcp-use', stars: 10818, merged: 2, zh: 'MCP 全栈框架', en: 'Full-stack MCP framework' },
  { repo: 'xmanrui/dsh-im', stars: 2709, merged: 7, zh: 'IM 机器人接入', en: 'IM bot bridge' },
  { repo: 'oceanbase/powercontext', stars: 1386, merged: 1, zh: 'Agent 上下文与记忆', en: 'Agent context and memory' },
  { repo: 'stepfun-ai/Step-Code', stars: 1024, merged: 5, zh: '编码 Agent', en: 'Coding agent' },
  { repo: 'hikariming/ghfind', stars: 267, merged: 4, zh: '开发者价值评估', en: 'Developer scoring' },
  { repo: 'liuxiaopai-ai/ralph-desktop', stars: 184, merged: 3, zh: 'AI 编程循环控制台', en: 'AI coding loop controller' },
  { repo: 'DefuzeX-AI/KUMA-DefuzeX', stars: 55, merged: 6, zh: 'Agent 行为测试 SDK', en: 'Agent behavior testing SDK' },
  { repo: 'DefuzeX-AI/AgentBehaviorBench', stars: 19, merged: 11, zh: 'Agent 测试能力评测基准', en: 'Benchmark for agents that test agents' },
  { repo: 'career-ops-hq/career-ops-docs', stars: 0, merged: 3, zh: 'career-ops 文档站', en: 'career-ops documentation' },
  { repo: 'mercallureAI/local-multimodal-infra', stars: 4, merged: 1, zh: '本地多模态推理服务', en: 'Local multimodal inference' },
]

export function formatStars(stars, locale = 'zh') {
  if (locale === 'zh' && stars >= 10000) return `${(stars / 10000).toFixed(1).replace(/\.0$/, '')} 万`
  if (stars >= 1000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(stars)
}

export function getOpenSourceContributions(locale = 'zh') {
  return contributions.map((item) => ({
    repo: item.repo,
    stars: item.stars,
    merged: item.merged,
    label: item[locale === 'en' ? 'en' : 'zh'],
    href: `https://github.com/${item.repo}/pulls?q=is%3Apr+author%3Aluochen211+is%3Amerged`,
  }))
}

export function getOpenSourceTotals() {
  return {
    repos: contributions.length,
    merged: contributions.reduce((sum, item) => sum + item.merged, 0),
  }
}
