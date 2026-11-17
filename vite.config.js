import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React e o catálogo mudam em ritmos diferentes: arquivos separados
        // deixam o navegador reaproveitar o cache entre publicações.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
          if (id.includes('/src/data/')) return 'acervo'
        },
      },
    },
  },
})
