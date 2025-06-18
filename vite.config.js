import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno basadas en el modo (desarrollo/producción)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      // Hacer que las variables de entorno estén disponibles explícitamente
      'import.meta.env.VITE_ADMIN_EMAIL': JSON.stringify(env.VITE_ADMIN_EMAIL)
    },
    envPrefix: 'VITE_', // Solo exponer variables que comiencen con VITE_
  }
})

