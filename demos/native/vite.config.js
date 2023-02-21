import { resolve } from 'path';
import { readdirSync } from 'fs';
import { defineConfig } from 'vite';

const views = readdirSync(resolve(__dirname, 'views'));

const main = {
  main: resolve(__dirname, 'index.html'),
};

const input = views.reduce((all, cur) => {
  const key = cur.split('.')[0];
  return {
    ...all,
    [key]: resolve(__dirname, 'views', cur, 'index.html'),
  };
}, main);

export default defineConfig({
  optimizeDeps: {
    force: true,
  },
  build: {
    rollupOptions: {
      input,
    },
  },
});
