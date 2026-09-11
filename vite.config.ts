import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "three/addons": path.resolve(__dirname, "./node_modules/three/examples/jsm"),
      three: path.resolve(__dirname, "./node_modules/three/build/three.module.js"),
      "@designcodeio/threeui/style.css": path.resolve(__dirname, "./src/shaders/threeui.css"),
      "@designcodeio/threeui": path.resolve(__dirname, "./src/threeui-entry.ts"),
    },
  },
})
