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
        target: "https://78cc-2409-40f4-40ce-54b7-a01e-1e30-c25-f34b.ngrok-free.app",
        changeOrigin: true,
      },
    },
  },
})
