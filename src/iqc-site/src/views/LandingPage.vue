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
				<p class="tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
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
import nucleusinst from '@/assets/branding/Sponsors/nucleusinstitute.svg';
import nasdaq from '@/assets/branding/Sponsors/nasdaq.svg';
import ibm from '@/assets/branding/Sponsors/ibm.svg';

/*
`scale` is an optical trim, tuned by eye against the rendered strip — the scroller caps
every mark to the same box, but it cannot see whitespace baked into the artwork. The
Nucleus .webp is mostly padding inside its own 2500x1311 frame, hence the largest
correction; re-exporting it cropped would let that drop back toward 1.
*/
const SPONSORS: Sponsor[] = [
	{ name: 'The Nucleus Institute', logo: nucleusinst, scale: 0.8 },
	{ name: 'Nasdaq', logo: nasdaq },
	{ name: 'IBM', logo: ibm, scale: 0.9 },
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
