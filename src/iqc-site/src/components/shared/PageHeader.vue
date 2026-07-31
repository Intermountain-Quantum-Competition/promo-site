<template>
	<header class="w-full flex flex-col items-center">
		<img :src="iqcInlineLogo" class="w-80 mt-10" />
		<div class="flex items-center mt-6">
			<img :src="byuLogo" class="h-10" />
			●
			<p class="font-header text-3xl ml-4">Intermountain Quantum Competition</p>
		</div>
		<div class="flex items-center mt-6">
			<RouterLink to="/">
				<div
					:class="[
						'font-mono font-bold text-sm tracking-wider cursor-pointer',
						{ 'text-gold': routeActive(['/', '/home']) },
					]"
				>
					EVENT
				</div>
			</RouterLink>
			<div class="vspacer"></div>
			<RouterLink to="/sponsors">
				<div
					:class="[
						'font-mono font-bold text-sm tracking-wider cursor-pointer',
						{ 'text-gold': routeActive(['/sponsors']) },
					]"
				>
					SPONSORS
				</div>
			</RouterLink>
			<div class="vspacer"></div>
			<RouterLink to="/students">
				<div
					:class="[
						'font-mono font-bold text-sm tracking-wider cursor-pointer',
						{ 'text-gold': routeActive(['/students']) },
					]"
				>
					STUDENTS
				</div>
			</RouterLink>
			<div class="vspacer"></div>
			<RouterLink to="/about">
				<div
					:class="[
						'font-mono font-bold text-sm tracking-wider cursor-pointer',
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
@reference "@/theme.css";

.vspacer {
	width: 2px;
	@apply h-2 bg-offwhite mx-8;
}
</style>
