import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'slides-directory-indexes',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const indexes = new Set([
            '/slides/',
            '/slides/decks/ai-product-talk/',
            '/slides/decks/mini-program-ui/',
            '/slides/decks/agent-harness/',
            '/slides/decks/agent-harness/lessons/',
            '/slides/decks/agent-harness/lessons/lesson-01/',
            '/slides/decks/agent-harness/lessons/lesson-02/',
            '/slides/decks/agent-harness/lessons/lesson-03/',
            '/slides/decks/agent-harness/lessons/lesson-04/',
            '/slides/decks/agent-harness/lessons/lesson-05/',
            '/slides/decks/personal-site-coolness/',
            '/slides/decks/ai-delivery/',
            '/demos/agent-harness/',
          ])
          const [pathname, query] = req.url.split('?')
          if (indexes.has(pathname)) {
            req.url = `${pathname}index.html${query ? `?${query}` : ''}`
          }
          next()
        })
      },
    },
  ],
})
