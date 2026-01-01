import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  // Exclude lightningcss from dependency optimization — it ships native/pkg
  // artifacts that Vite can fail to resolve during pre-bundling.
  optimizeDeps: {
    exclude: ["lightningcss"],
  },
  // Proxy API calls to the backend during development to avoid CORS issues.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
