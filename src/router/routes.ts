import { RouteRecordRaw } from 'vue-router';

const pages = import.meta.glob(`../pages/*.vue`);

function createRoutes(prefix = '') {
  return Object.keys(pages)
    .map((path) => {
      const matches = path.match(/\.\/pages\/(.*)\.vue$/);
      let name = '';
      if (matches && matches[1]) {
        name = matches[1].toLowerCase();
      }
      return {
        path: ['home', 'index'].includes(name) ? prefix : prefix + name,
        component: pages[path], // () => import('./pages/*.vue')
      };
    })
    .filter((route) => !route.path.startsWith('/_'));
}

export default [
  {
    path: '',
    component: () => import('@/layouts/default.vue'),
    children: createRoutes(),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/404.vue'),
    children: [],
  },
] as RouteRecordRaw[];
