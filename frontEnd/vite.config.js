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
        target: "https://9a4f-2409-40f4-ad-a316-ccfb-fcda-46f0-8c23.ngrok-free.app",
        changeOrigin: true,
        secure: false, 
      },
    },
  },
})
