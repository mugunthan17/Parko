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
        target: "https://87e1-2409-40f4-30-5164-3804-3c5-eef5-e860.ngrok-free.app",
        changeOrigin: true,
        secure: false, 
      },
    },
  },
})
