import { createRouter, createWebHistory } from 'vue-router';
import OKXview from '../components/OKXview.vue';
import Bitget from '../components/Bitget.vue';
import Meteora from '../components/Meteora.vue';

const routes = [
  { path: '/', redirect: '/OKXview' },
  { path: '/OKXview', name: 'OKXView', component: OKXview },
  { path: '/Bitget', name: 'Bitget', component: Bitget },
  { path: '/Meteora', name: 'Meteora', component: Meteora }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;