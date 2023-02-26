import { resolve } from 'path';
import { build, createServer } from 'vite';

// eslint-disable-next-line import/no-relative-packages
// import { bindShortcuts } from '../../../../Libraries-Repos/vite/packages/vite/dist/node/index.js';

// https://vitejs.dev/guide/api-javascript.html
// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/cli.ts#L159
// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/shortcuts.ts

const mode = 'development';
const logLevel = 'info';

const watchPackage = async (root) => {
  await build({
    root,
    build: {
      lib: {
        entry: resolve(root, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
      },
      watch: {},
    },
  });
};

const startServer = async () => {
  const server = await createServer({
    mode,
    logLevel,
    configFile: './scripts/vite.dev-playground.js',
  });

  await server.listen();

  // console.log(JSON.stringify(server.config, null, 2));

  server.printUrls();
};

export const serve = async (paths) => {
  await watchPackage(paths[0]);

  startServer();
};
