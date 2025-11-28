import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {

        host: true,
        // allowedHosts: ['ewa-translatable-bindingly.ngrok-free.dev'],

        // proxy: {
        // // Proxy para cualquier ruta que contenga localhost:5000
        //     '^.*localhost:5000.*': {
        //         target: 'http://localhost:5000',
        //         changeOrigin: true,
        //         rewrite: (path) => {
        //         // Extrae solo la parte de la ruta después de localhost:5000
        //         const match = path.match(/localhost:5000(\/.*)/);
        //         return match ? match[1] : path;
        //         },
        //         configure: (proxy) => {
        //             proxy.on('proxyReq', (proxyReq, req, res) => {
        //                 console.log('Proxyando:', req.url);
        //             });
        //         }
        //     }
        // }
  
  }
})
