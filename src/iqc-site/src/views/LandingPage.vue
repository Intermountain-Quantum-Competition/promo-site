<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="mt-auto mb-26 w-2/3 self-center">
				<p class="tracking-widest mb-2 text-sm font-bold">
					<span class="text-gold mr-2">00</span> START
				</p>
				<h1 class="text-5xl">Quantum on the frontier.</h1>
				<p class="mt-4">
					It's been a while since Utah was the "wild west". <br />
					Now we're back. Welcome to the quantum frontier.
				</p>
			</div>
		</HeroSection>
		<CountdownTimer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import CountdownTimer from '@/components/pageelements/landing/CountdownTimer.vue';
import HeroSection from '@/components/shared/HeroSection.vue';

export default defineComponent({
	components: {
		PageHeader,
		CountdownTimer,
		HeroSection,
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
