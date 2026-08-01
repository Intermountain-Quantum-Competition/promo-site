<template>
	<div class="flex justify-center">
		<div class="w-11/12 lg:w-2/3 max-w-300 flex flex-col">
			<img :src="iqcInlineLogo" class="w-60 lg:w-80 mt-6 lg:mt-10 self-center mb-14" />
			<h1 class="text-2xl">404</h1>
			<h2 class="text-3xl mb-4">Page not found.</h2>
			<p>Sorry about that, the page you're looking for doesn't exist.</p>
			<a href="/" class="text-salmon mt-8">Go home</a>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import iqcInlineLogo from '@/assets/branding/IQC/IQC Inline.svg';

export default defineComponent({
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			iqcInlineLogo,
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
