<template>
	<section id="our-sponsors" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<div class="mb-8">
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">01</span> OUR SPONSORS
				</p>
				<h2 class="text-3xl lg:text-5xl">The people making it happen.</h2>
				<p class="mt-2 lg:mt-4 text-sm lg:text-md">
					These organizations are building the future of quantum, and they're sending real
					people to meet you.
				</p>
			</div>

			<div class="flex flex-col gap-6">
				<SponsorTile v-for="sponsor in sponsors" :key="sponsor.name" v-bind="sponsor">
					<img
						v-if="sponsor.name === 'IBM'"
						:src="qiskitEventSticker"
						alt="IBM Qiskit Fall Fest 2026"
						class="max-h-40"
					/>
				</SponsorTile>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SponsorTile from '@/components/pageelements/sponsors/SponsorTile.vue';
import ibmLogo from '@/assets/branding/Sponsors/ibm.svg';
import nasdaqLogo from '@/assets/branding/Sponsors/nasdaq.svg';
import nucleusLogo from '@/assets/branding/Sponsors/nucleusinstitute.svg';
import quantumRingsLogo from '@/assets/branding/Sponsors/quantumrings.svg';
import qiskitEventSticker from '@/assets/material/IBM Qiskit Fall Fest 2026.svg';

/*
Blurbs are condensed from each organization's own quantum pages (September 2026). When a
sponsor sends approved copy, replace theirs outright rather than merging it with this.
*/
const SPONSORS = [
	{
		name: 'IBM',
		logo: ibmLogo,
		logoClass: 'h-8',
		tagline: 'QUANTUM HARDWARE & QISKIT',
		blurb: "IBM Quantum runs the world's largest fleet of 100+ qubit quantum computers and builds Qiskit, the most widely used open-source software stack for quantum computing. Its IBM Quantum Network brings together hundreds of universities, companies, and startups advancing the field. IQC is part of IBM's Qiskit Fall Fest 2026.",
		url: 'https://www.ibm.com/quantum',
	},
	{
		name: 'Nasdaq',
		logo: nasdaqLogo,
		logoClass: 'h-9',
		tagline: 'MARKETS & FINANCIAL TECHNOLOGY',
		blurb: 'Nasdaq powers global capital markets, and is exploring where quantum computing fits in finance. Through Nasdaq Verafin, it is running a proof of concept that applies quantum computing to financial crime detection, looking for patterns of fraud, scams, and money laundering hidden in complex transaction networks.',
		url: 'https://www.nasdaq.com',
	},
	{
		name: 'The Nucleus Institute',
		logo: nucleusLogo,
		logoClass: 'h-6',
		tagline: "UTAH'S INNOVATION HUB",
		blurb: "Nucleus convenes, educates, and funds innovation in Utah, bringing together industry, academia, and government. It houses the Utah Quantum Institute, the state's central hub for quantum innovation, and partners with the Governor's Office on the Utah Quantum Initiative to make Utah the launchpad for quantum tech.",
		url: 'https://www.nucleusutah.org/programs',
	},
	{
		name: 'Quantum Rings',
		logo: quantumRingsLogo,
		logoClass: 'h-10',
		tagline: 'QUANTUM SIMULATION',
		blurb: 'Quantum Rings makes large-scale quantum simulation possible on hardware you already own, running hundreds of qubits and millions of operations with high fidelity. Its SDK is free for non-commercial use, and it also offers access to real quantum processors and a free Quantum 101 course.',
		url: 'https://www.quantumrings.com',
	},
];

export default defineComponent({
	components: {
		SponsorTile,
	},
	mixins: [],
	props: {},
	data() {
		return {
			sponsors: SPONSORS,
			qiskitEventSticker,
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
