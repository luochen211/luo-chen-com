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
          ])
          if (indexes.has(req.url)) req.url += 'index.html'
          next()
        })
      },
    },
  ],
})
