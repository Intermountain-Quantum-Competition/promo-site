<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="flex flex-col w-full items-center mt-30">
				<div class="mt-auto mb-14 w-11/12 lg:w-2/3 lg:max-w-300">
					<h1 class="text-center text-3xl lg:text-5xl">Coming soon.</h1>
					<p class="text-center mt-2 lg:mt-4 text-sm lg:text-md">
						We're working hard on putting this event together. <br />
						We'll have more to show you soon, so please check back.
					</p>
				</div>
			</div>
		</HeroSection>

		<PageFooter class="absolute bottom-0" />
	</div>
</template>

<script lang="ts">
import HeroSection from '@/components/shared/HeroSection.vue';
import PageFooter from '@/components/shared/PageFooter.vue';
import PageHeader from '@/components/shared/PageHeader.vue';

export default {
	components: {
		HeroSection,
		PageHeader,
		PageFooter,
	},
	props: {},
	data() {
		return {};
	},
	computed: {},
	methods: {},
};
</script>

<style scoped></style>
