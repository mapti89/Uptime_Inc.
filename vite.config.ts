import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // Écoute explicite en IPv4 : « localhost » se résout en ::1 seul sous Node 17+,
  // ce qui casse les tunnels SSH vers 127.0.0.1.
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  test: {
    include: ['tests/**/*.test.ts'],
  },
} as never);
