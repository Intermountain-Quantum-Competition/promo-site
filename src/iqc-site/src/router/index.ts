import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: LandingPage,
		},
		// {
		// 	path: '/sponsors',
		// 	name: 'sponsors',
		// 	component: () => import('@/views/SponsorsPage.vue')
		// },
		{
			path: '/students',
			name: 'students',
			component: () => import('@/views/StudentsPage.vue'),
		},
		// {
		// 	path: '/about',
		// 	name: 'about',
		// 	component: () => import('@/views/AboutPage.vue')
		// },
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
