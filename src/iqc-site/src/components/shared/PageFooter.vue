<template>
	<footer class="bg-navy-0 w-full py-4 lg:py-10">
		<div class="flex justify-between items-center px-2 lg:px-6">
			<div class="flex items-center text-darkwhite">
				<img :src="iqcInlineLogo" class="h-6 lg:h-8 mr-2" />
				<span class="text-xs hidden lg:block">●</span>
				<p class="font-header mx-4 hidden lg:block">INTERMOUNTAIN QUANTUM COMPETITION</p>
				<span class="text-xs hidden lg:block">●</span>
				<p class="font-header mx-4 hidden lg:block">© 2026 BYU</p>
			</div>

			<p class="font-header mx-4 text-xs lg:hidden">© 2026 BYU</p>

			<a href="https://byu.edu" target="_blank">
				<div>
					<img :src="byuLogo" class="h-6 lg:h-8" />
				</div>
			</a>
		</div>
	</footer>
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
	methods: {},
});
</script>

<style scoped></style>
