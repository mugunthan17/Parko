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
        //target: "http://18.142.128.26",
        target: "https://7b45-2409-40f4-3-c33d-c113-5c36-751-fc5a.ngrok-free.app/",
        changeOrigin: true,
      },
    },
  },
})
