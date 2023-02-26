// import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
			// set dynamically
      // entry: resolve(__dirname, 'src/index.ts'),
      // formats: ['es', 'cjs'],
      // fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
    },
  },
});
