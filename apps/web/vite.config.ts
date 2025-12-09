import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/

// make it 0.0.0.0
export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['bitriel.com', 'www.bitriel.com'],
  },
  plugins: [react()],
});
