import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './routers/main.js'

const app = createApp(App);
app.use(router);
app.mount('#app');
