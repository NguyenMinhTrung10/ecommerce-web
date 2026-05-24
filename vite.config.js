import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ecommerce-web/', // Phù hợp với đường dẫn mặc định của GitHub Pages
})
