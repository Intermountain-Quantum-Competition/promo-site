<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="flex flex-col w-full items-center mt-30">
				<div class="mt-auto mb-14 w-11/12 lg:w-2/3 lg:max-w-300">
					<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
						<span class="text-gold mr-2">00</span> START
					</p>
					<h1 class="text-3xl lg:text-5xl">Quantum on the frontier.</h1>
					<p class="mt-2 lg:mt-4 text-sm lg:text-md">
						It's been a while since Utah was the "wild west". <br />
						Now we're back. Welcome to the quantum frontier.
					</p>
				</div>
				<SponsorScroller :sponsors="sponsors" />
			</div>
		</HeroSection>

		<CountdownTimer />
		<EventSchedule />

		<div class="flex justify-center mb-4">
			<div class="w-11/12 lg:w-2/3 max-w-300">
				<p class="tracking-widest w-full mb-2 text-sm font-bold">
					<span class="text-gold mr-2">03</span> END
				</p>
			</div>
		</div>

		<PageFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import CountdownTimer from '@/components/pageelements/landing/CountdownTimer.vue';
import HeroSection from '@/components/shared/HeroSection.vue';
import EventSchedule from '@/components/pageelements/landing/EventSchedule.vue';
import PageFooter from '@/components/shared/PageFooter.vue';
import SponsorScroller, {
	type Sponsor,
} from '@/components/pageelements/landing/SponsorScroller.vue';
import iqcLogo from '@/assets/branding/IQC/IQC Inline.svg';
import byuLogo from '@/assets/branding/BYU/BYU monogram_white.svg';

/*
TODO: placeholders. Real sponsor marks go in src/assets/branding/sponsors/, and want to
be light monochrome SVGs — the strip sits on the dark hero.
*/
const SPONSORS: Sponsor[] = [
	{ name: 'Intermountain Quantum Competition', logo: iqcLogo },
	{ name: 'Brigham Young University', logo: byuLogo },
];

export default defineComponent({
	components: {
		PageHeader,
		CountdownTimer,
		HeroSection,
		EventSchedule,
		PageFooter,
		SponsorScroller,
	},
	mixins: [],
	props: {},
	data() {
		return {
			sponsors: SPONSORS,
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
