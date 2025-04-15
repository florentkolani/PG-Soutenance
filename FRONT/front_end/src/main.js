import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import './assets/main.css';
import "quill/dist/quill.snow.css";
import './index.css';
import './assets/styles/responsive.css';


const app = createApp(App)
  .use(router)
  .use(store)
  .mount('#app')