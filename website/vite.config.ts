import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` keeps asset paths relative, and the app uses hash routing,
// so the build works on GitHub Pages under /Native_Swift_Apps/ (or any path)
// without a 404.html redirect.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Long-lived vendor chunks that rarely change between deploys.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          motion: ['motion'],
        },
      },
    },
  },
})
