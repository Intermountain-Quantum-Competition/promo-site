import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			// Lazy-loaded so it stays out of the initial bundle. Prefer this form for
			// any route that isn't the landing page.
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('../views/NotFoundView.vue'),
		},
	],
	scrollBehavior(_to, _from, savedPosition) {
		return savedPosition ?? { top: 0 };
	},
});
