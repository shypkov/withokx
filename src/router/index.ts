import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import type { App } from 'vue';

const router = createRouter({
  // history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHashHistory(),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  strict: true,
  routes,
});

export default router;

// config router
export function setupRouter(app: App) {
  app.use(router);
}
