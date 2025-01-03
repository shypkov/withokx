import { createRouter, createWebHashHistory } from 'vue-router';
import OKXview from '../components/OKXview.vue';
import Bitget from '../components/Bitget.vue';
import Meteora from '../components/Meteora.vue';
import Ambient from '../components/Ambient.vue';
import Karak from '../components/Karak.vue';

const routes = [
  { path: '/', redirect: '/OKXview' },
  { path: '/OKXview', name: 'OKXView', component: OKXview },
  { path: '/Bitget', name: 'Bitget', component: Bitget },
  { path: '/Meteora', name: 'Meteora', component: Meteora },
  { path: '/Ambient', name: 'Ambient', component: Ambient },
  { path: '/Karak', name: 'Karak', component: Karak }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;