import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import { fileURLToPath } from 'url';

//const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './lib',
    lib: {
      entry: path.resolve('src/index.ts'),
      name: 'naive-mobile',
      fileName: (format) => `naive-mobile.${ format }.js`,
      formats: ['es', 'umd'/*, 'cjs', 'amd', 'iife', 'system'*/],
    },
    rollupOptions: {
      external: ['vue', 'naive-ui'],
      output: {
        sourcemap: false,
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      //'@': path.resolve(__dirname, './src'),
    },
  },
  define: {}
});
