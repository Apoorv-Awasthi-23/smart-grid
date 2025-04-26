// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // <-- Keep: bundle CSS into JS (optional but helpful)
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optional: disables vendor chunk splitting
      },
    },
  },
});
