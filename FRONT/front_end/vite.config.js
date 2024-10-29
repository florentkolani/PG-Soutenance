import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(), // Plugin pour les devtools Vue.js
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Alias pour accéder facilement au dossier src
    }
  },
  server: {
    proxy: {
      '/API': {
        target: 'http://localhost:5000', // Proxy vers ton backend local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, '') // Réécriture des chemins
      }
    }
  },
  build: {
    sourcemap: true, // Active les sourcemaps pour faciliter le débogage en production
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Divise les fichiers des node_modules en chunks séparés pour améliorer le caching
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vuex'], // Optimisation des dépendances de base
    exclude: ['vue-devtools'] // Évite d'inclure des outils de dev en production si nécessaire
  }
});
