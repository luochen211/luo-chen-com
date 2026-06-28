import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateRoundtable } from './api/_roundtableCore.js'

async function readJsonBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'roundtable-api-dev',
      configureServer(server) {
        server.middlewares.use('/api/roundtable', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          try {
            const body = await readJsonBody(req)
            const result = await generateRoundtable({
              apiKey: process.env.OPENAI_API_KEY,
              model: process.env.OPENAI_MODEL,
              topic: body?.topic,
              experts: body?.experts,
            })

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result))
          } catch (error) {
            res.statusCode = error.status || 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: error.message || 'Unknown error' }))
          }
        })
      },
    },
  ],
})
