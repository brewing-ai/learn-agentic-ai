import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/learn-agentic-ai/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
      },
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: () => '/v1/chat/completions',
      },
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const key = url.searchParams.get('key') || ''
          return `/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`
        },
      },
    },
  },
})
