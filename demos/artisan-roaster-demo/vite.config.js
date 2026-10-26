import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        product: resolve(__dirname, 'product.html'),
        story: resolve(__dirname, 'story.html'),
        wholesale: resolve(__dirname, 'wholesale.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
