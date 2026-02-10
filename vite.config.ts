import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    electron({
      main: {
        entry: 'src/main/main.ts',
      },
      preload: {
        input: 'src/preload/preload.ts',
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
