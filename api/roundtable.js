import { generateRoundtable } from './_roundtableCore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await generateRoundtable({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      topic: req.body?.topic,
      experts: req.body?.experts,
    })

    return res.status(200).json(result)
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Unknown error' })
  }
}
