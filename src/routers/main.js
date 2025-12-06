import { createRouter, createWebHistory } from 'vue-router';
import Basic from "../views/Basic.vue";
import Texas from '../views/Texas.vue';

const routes = [
  { path: '/', component: Basic },
  { path: '/texas', component: Texas }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
