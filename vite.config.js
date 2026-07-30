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
