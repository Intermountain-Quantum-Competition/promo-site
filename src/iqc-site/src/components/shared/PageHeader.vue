<template>
	<header class="w-full flex flex-col items-center">
		<img :src="iqcInlineLogo" class="w-60 lg:w-80 mt-6 lg:mt-10" />
		<div class="flex flex-col lg:flex-row items-center mt-4 lg:mt-6">
			<img :src="byuLogo" class="h-4 lg:h-10" />
			<span class="hidden lg:block">●</span>
			<p class="font-header text-md lg:text-3xl ml-4">Intermountain Quantum Competition</p>
		</div>
		<div class="flex items-center mt-8 lg:mt-6">
			<RouterLink to="/">
				<div
					:class="[
						'font-mono font-bold text-xs lg:text-sm tracking-wider cursor-pointer hover:text-gold',
						{ 'text-gold': routeActive(['/', '/home']) },
					]"
				>
					EVENT
				</div>
			</RouterLink>
			<div class="vspacer"><span class="lg:hidden">•</span></div>
			<RouterLink to="/sponsors">
				<div
					:class="[
						'font-mono font-bold text-xs lg:text-sm tracking-wider cursor-pointer hover:text-gold',
						{ 'text-gold': routeActive(['/sponsors']) },
					]"
				>
					SPONSORS
				</div>
			</RouterLink>
			<div class="vspacer"><span class="lg:hidden">•</span></div>
			<RouterLink to="/students">
				<div
					:class="[
						'font-mono font-bold text-xs lg:text-sm tracking-wider cursor-pointer hover:text-gold',
						{ 'text-gold': routeActive(['/students']) },
					]"
				>
					STUDENTS
				</div>
			</RouterLink>
			<div class="vspacer"><span class="lg:hidden">•</span></div>
			<RouterLink to="/about">
				<div
					:class="[
						'font-mono font-bold text-xs lg:text-sm tracking-wider cursor-pointer hover:text-gold',
						{ 'text-gold': routeActive(['/about']) },
					]"
				>
					ABOUT
				</div>
			</RouterLink>
		</div>
	</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import iqcInlineLogo from '@/assets/branding/IQC/IQC Inline.svg';
import byuLogo from '@/assets/branding/BYU/BYU monogram_white.svg';

export default defineComponent({
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			iqcInlineLogo,
			byuLogo,
		};
	},
	computed: {},
	methods: {
		routeActive(routes: Array<string>) {
			return routes.includes(this.$route.path);
		},
	},
});
</script>

<style scoped>
/* @import 'tailwindcss'; */
@reference "@/theme.css";

.vspacer {
	@apply text-xs w-max lg:w-0.5 lg:h-2 lg:bg-offwhite mx-4 lg:mx-8;
}
</style>
