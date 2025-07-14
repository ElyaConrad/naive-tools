// vite.config.ts
import { defineConfig } from "file:///Users/mauriceconrad/Documents/Bluepic/Modules/naive-tools/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/mauriceconrad/Documents/Bluepic/Modules/naive-tools/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import dts from "file:///Users/mauriceconrad/Documents/Bluepic/Modules/naive-tools/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    outDir: "./lib",
    lib: {
      entry: path.resolve("src/index.ts"),
      name: "naive-tools",
      fileName: (format) => `naive-tools.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["vue", "naive-ui"],
      output: {
        sourcemap: false,
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  plugins: [vue(), dts()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWF1cmljZWNvbnJhZC9Eb2N1bWVudHMvQmx1ZXBpYy9Nb2R1bGVzL25haXZlLXRvb2xzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWF1cmljZWNvbnJhZC9Eb2N1bWVudHMvQmx1ZXBpYy9Nb2R1bGVzL25haXZlLXRvb2xzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYXVyaWNlY29ucmFkL0RvY3VtZW50cy9CbHVlcGljL01vZHVsZXMvbmFpdmUtdG9vbHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvL3BsdWdpbnM6IFt2dWUoKV0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnLi9saWInLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZSgnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnbmFpdmUtdG9vbHMnLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBuYWl2ZS10b29scy4keyBmb3JtYXQgfS5qc2AsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ3VtZCcvKiwgJ2NqcycsICdhbWQnLCAnaWlmZScsICdzeXN0ZW0nKi9dLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsndnVlJywgJ25haXZlLXVpJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAgICAgLy8gUHJvdmlkZSBnbG9iYWwgdmFyaWFibGVzIHRvIHVzZSBpbiB0aGUgVU1EIGJ1aWxkXG4gICAgICAgIC8vIEFkZCBleHRlcm5hbCBkZXBzIGhlcmVcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHZ1ZTogJ1Z1ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFt2dWUoKSwgZHRzKCldXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVyxTQUFTLG9CQUFvQjtBQUM3WCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUUxQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDSCxPQUFPLEtBQUssUUFBUSxjQUFjO0FBQUEsTUFDbEMsTUFBTTtBQUFBLE1BQ04sVUFBVSxDQUFDLFdBQVcsZUFBZ0I7QUFBQSxNQUN0QyxTQUFTLENBQUMsTUFBTSxLQUF5QztBQUFBLElBQzNEO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTyxVQUFVO0FBQUEsTUFDNUIsUUFBUTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBR1gsU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
