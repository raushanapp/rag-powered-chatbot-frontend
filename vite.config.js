// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  base: "/rag-powered-chatbot-frontend/",
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT, 10) || 3000,
    host: process.env.VITE_SERVER_HOST || 'localhost',
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL),
    __API_ENDPOINTS__: JSON.stringify({
      chat: process.env.VITE_API_CHAT_ENDPOINT,
      session: process.env.VITE_API_SESSION_ENDPOINT,
      history: process.env.VITE_API_HISTORY_ENDPOINT,
    }),
  },
  build: {
    sourcemap: process.env.VITE_SOURCEMAP === 'true',
    outDir: process.env.VITE_OUTPUT_DIR || 'dist',
  },
});

