import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/open-gate": {
        //target: 'http://192.168.1.40',
        //target: "http://192.168.33.124",
        target: "http://18.142.128.26",
        changeOrigin: true,
      },
    },
  },
})
