import { createRouter, createWebHistory } from 'vue-router';
import Basic from "../views/Basic.vue";
import Texas from '../views/Texas.vue';

const routes = [
  { path: "/", redirect: "/basic"},
  { path: '/basic', component: Basic, name: 'Basic'},
  { path: '/texas', component: Texas, name: 'Texas HoldEm' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
