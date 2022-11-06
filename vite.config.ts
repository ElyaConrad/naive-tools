import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
//import { fileURLToPath } from 'url';

//const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './lib',
    lib: {
      entry: path.resolve('src/index.ts'),
      name: 'naive-tools',
      fileName: (format) => `naive-tools.${ format }.js`,
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
    vue(),
    dts()
  ],
  resolve: {
    alias: {
      //'@': path.resolve(__dirname, './src'),
    },
  },
  define: {}
});
