import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const API_TARGET = process.env.VITE_API_URL ?? 'http://localhost:3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/auth': { target: API_TARGET, changeOrigin: true },
      '/products': { target: API_TARGET, changeOrigin: true },
      '/orders': { target: API_TARGET, changeOrigin: true },
      '/dashboard': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
      '/categories': { target: API_TARGET, changeOrigin: true },
    },
  },
})
