import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 600, // Adjust to avoid warnings (default is 500)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui")) return "mui-vendor"; // Separate MUI into its own chunk
            if (id.includes("react")) return "react-vendor"; // Separate React-related code
            if (id.includes("recharts")) return "recharts-vendor"; // Separate Recharts for graphing
            return "vendor"; // General vendor chunk
          }
        },
      },
    },
  },
})
