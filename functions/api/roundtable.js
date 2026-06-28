import { generateRoundtable } from '../../api/_roundtableCore.js'

export async function onRequestPost(context) {
  try {
    const body = await context.request.json()
    const result = await generateRoundtable({
      apiKey: context.env.OPENAI_API_KEY,
      model: context.env.OPENAI_MODEL,
      topic: body?.topic,
      experts: body?.experts,
    })

    return Response.json(result)
  } catch (error) {
    return Response.json(
      { error: error.message || 'Unknown error' },
      { status: error.status || 500 },
    )
  }
}

export function onRequestOptions() {
  return new Response(null, { status: 204 })
}
