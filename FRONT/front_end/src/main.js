

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import './assets/main.css';


createApp(App)
  .use(router)
  .use(store)
  .mount('#app')