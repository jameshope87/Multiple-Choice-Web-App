import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default   defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore'],
          markdown: [
            'katex',
            'react-markdown',
            'remark-gfm',
            'remark-math',
            'rehype-raw',
            'rehype-katex',
          ]
        }
      }
    }
  },
  plugins: [react()],
})
