import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Using relative path allows seamless deployment to GitHub Pages and local test
  server: {
    port: 3000,
    open: true,
  },
});
