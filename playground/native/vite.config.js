import { resolve } from 'path';
import { readdirSync } from 'fs';
import { defineConfig } from 'vite';

// used by 'npm run dev:playground'
// scripts/vite.dev-playground.js

const directory = resolve(__dirname, 'views');
const packages = readdirSync(directory);

const main = {
  main: resolve(__dirname, 'index.html'),
};

const input = packages.reduce((all, pkg) => {
  // console.log(pkg);
  return {
    ...all,
    [pkg]: resolve(directory, pkg, 'index.html'),
  };
}, main);

// console.log(input);

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
