import { createRouter, createWebHashHistory } from 'vue-router';
import OKXview from '../components/OKXview.vue';
import Bitget from '../components/Bitget.vue';
import Meteora from '../components/Meteora.vue';
import Ambient from '../components/Ambient.vue';
import Karak from '../components/Karak.vue';
import FAQ from '../components/FAQ.vue';

const routes = [
  { path: '/', redirect: '/OKXview' },
  { path: '/OKXview', name: 'OKXView', component: OKXview },
  { path: '/Bitget', name: 'Bitget', component: Bitget },
  { path: '/Meteora', name: 'Meteora', component: Meteora },
  { path: '/Ambient', name: 'Ambient', component: Ambient },
  { path: '/Karak', name: 'Karak', component: Karak },
  { path: '/FAQ', name: 'FAQ', component: FAQ },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;