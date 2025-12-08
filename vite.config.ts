import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/siraajv0.1-main/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
