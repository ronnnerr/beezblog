import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/blog/'

  return {
    base,
    plugins: [react()],
    test: {
      environment: 'happy-dom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})

