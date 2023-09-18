import { defineConfig } from 'vite'
const { corsPlugin } = require('@vitejs/plugin-cors');
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), corsPlugin({
    credentials: false,
  })],
  server: {
    host: true,
  },
})
