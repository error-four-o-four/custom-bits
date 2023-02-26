import process from 'node:process';

import { resolve } from 'path';
import { readdirSync } from 'fs';
import { defineConfig } from 'vite';

const basePath = resolve(process.cwd(), 'playground', 'native');
const viewsPath = resolve(basePath, 'views');
const packages = readdirSync(viewsPath);

const main = {
  main: resolve(basePath, 'index.html'),
};

const input = packages.reduce((all, pkg) => {
  return {
    ...all,
    [pkg]: resolve(viewsPath, pkg, 'index.html'),
  };
}, main);

export default defineConfig({
  root: basePath,
  appType: 'mpa',
  build: {
    rollupOptions: {
      input,
    },
  },
});
