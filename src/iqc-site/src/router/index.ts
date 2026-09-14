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
		{
			path: '/sponsors',
			name: 'sponsors',
			component: () => import('@/views/SponsorsPage.vue'),
		},
		{
			path: '/students',
			name: 'students',
			component: () => import('@/views/StudentsPage.vue'),
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('@/views/ComingSoonView.vue'),
		},
		{
			// Lazy-loaded so it stays out of the initial bundle. Prefer this form for
			// any route that isn't the landing page.
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('../views/NotFoundView.vue'),
		},
	],
	scrollBehavior(to, _from, savedPosition) {
		if (savedPosition) return savedPosition;
		// Lets pages link to their own sections, e.g. /sponsors#become-a-sponsor.
		if (to.hash) return { el: to.hash, behavior: 'smooth' };
		return { top: 0 };
	},
});
