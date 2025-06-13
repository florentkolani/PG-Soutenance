// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Projet%20de%20Soutenance/FRONT/front_end/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Projet%20de%20Soutenance/FRONT/front_end/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/Projet%20de%20Soutenance/FRONT/front_end/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/Projet%20de%20Soutenance/FRONT/front_end/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx()
    // vueDevTools(), // Plugin pour les devtools Vue.js
  ],
  define: {
    __VUE_PROD_DEVTOOLS__: false
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      // Alias pour accéder facilement au dossier src
    }
  },
  server: {
    proxy: {
      "/API": {
        target: "http://localhost:5000",
        // Proxy vers ton backend local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, "")
        // Réécriture des chemins
      }
    }
  },
  build: {
    sourcemap: true,
    // Active les sourcemaps pour faciliter le débogage en production
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "vuex"],
    // Optimisation des dépendances de base
    exclude: ["vue-devtools"]
    // Évite d'inclure des outils de dev en production si nécessaire
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZXQgZGUgU291dGVuYW5jZVxcXFxGUk9OVFxcXFxmcm9udF9lbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFByb2pldCBkZSBTb3V0ZW5hbmNlXFxcXEZST05UXFxcXGZyb250X2VuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvamV0JTIwZGUlMjBTb3V0ZW5hbmNlL0ZST05UL2Zyb250X2VuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4Jztcbi8vIGltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICAvLyB2dWVEZXZUb29scygpLCAvLyBQbHVnaW4gcG91ciBsZXMgZGV2dG9vbHMgVnVlLmpzXG4gIF0sXG4gIGRlZmluZToge1xuICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogZmFsc2VcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSAvLyBBbGlhcyBwb3VyIGFjY1x1MDBFOWRlciBmYWNpbGVtZW50IGF1IGRvc3NpZXIgc3JjXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9BUEknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsIC8vIFByb3h5IHZlcnMgdG9uIGJhY2tlbmQgbG9jYWxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvQVBJLywgJycpIC8vIFJcdTAwRTlcdTAwRTljcml0dXJlIGRlcyBjaGVtaW5zXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gQWN0aXZlIGxlcyBzb3VyY2VtYXBzIHBvdXIgZmFjaWxpdGVyIGxlIGRcdTAwRTlib2dhZ2UgZW4gcHJvZHVjdGlvblxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAvLyBEaXZpc2UgbGVzIGZpY2hpZXJzIGRlcyBub2RlX21vZHVsZXMgZW4gY2h1bmtzIHNcdTAwRTlwYXJcdTAwRTlzIHBvdXIgYW1cdTAwRTlsaW9yZXIgbGUgY2FjaGluZ1xuICAgICAgICAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3Z1ZXgnXSwgLy8gT3B0aW1pc2F0aW9uIGRlcyBkXHUwMEU5cGVuZGFuY2VzIGRlIGJhc2VcbiAgICBleGNsdWRlOiBbJ3Z1ZS1kZXZ0b29scyddIC8vIFx1MDBDOXZpdGUgZCdpbmNsdXJlIGRlcyBvdXRpbHMgZGUgZGV2IGVuIHByb2R1Y3Rpb24gc2kgblx1MDBFOWNlc3NhaXJlXG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxTQUFTLGVBQWUsV0FBVztBQUN0VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSDBLLElBQU0sMkNBQTJDO0FBTzlPLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQTtBQUFBLEVBRVQ7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQTtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQTtBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBQ2YsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBRS9CLG1CQUFPLEdBQUcsU0FBUyxFQUFFLE1BQU0sZUFBZSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsU0FBUztBQUFBLFVBQ3hFO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLE9BQU8sY0FBYyxNQUFNO0FBQUE7QUFBQSxJQUNyQyxTQUFTLENBQUMsY0FBYztBQUFBO0FBQUEsRUFDMUI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
