import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite configuration
export default defineConfig({
    // Plugins
    plugins: [
        vue(),
    ],
    // Module resolution
    resolve: {
        alias: {
            // Configure alias '@' to point to '/src' directory
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})