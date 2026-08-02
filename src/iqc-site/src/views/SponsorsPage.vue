<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="flex flex-col w-full items-center mt-30">
				<div class="mt-auto mb-14 w-11/12 lg:w-2/3 lg:max-w-300">
					<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
						<span class="text-gold mr-2">00</span> START
					</p>
					<h1 class="text-3xl lg:text-5xl">Backed by industry giants.</h1>
					<p class="mt-2 lg:mt-4 text-sm lg:text-md">
						The perfect opportunity to connect with industry leaders and big players.
						<br />
						Show 'em what you got.
					</p>
				</div>
			</div>
		</HeroSection>

		<SponsorsDisplay />

		<div class="flex justify-center mb-4 mt-8">
			<div class="w-11/12 lg:w-2/3 max-w-300">
				<p class="tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">04</span> END
				</p>
			</div>
		</div>

		<PageFooter />
	</div>
</template>

<script lang="ts">
import SponsorsDisplay from '@/components/pageelements/sponsors/SponsorsDisplay.vue';
import HeroSection from '@/components/shared/HeroSection.vue';
import PageFooter from '@/components/shared/PageFooter.vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		HeroSection,
		PageHeader,
		PageFooter,
		SponsorsDisplay,
	},
	mixins: [],
	props: {},
	data() {
		return {};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
