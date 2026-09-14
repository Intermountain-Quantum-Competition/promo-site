<template>
	<section id="for-students" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<div class="mb-8">
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">02</span> FOR STUDENTS
				</p>
				<h2 class="text-3xl lg:text-5xl">Real problems. Real people.</h2>
				<p class="mt-2 lg:mt-4 text-sm lg:text-md">
					Sponsors aren't just logos on a shirt. Here's what they bring to your weekend.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div v-for="item in expectations" :key="item.title" class="card">
					<h3 class="text-xl">{{ item.title }}</h3>
					<p class="mt-2 text-sm leading-relaxed">{{ item.desc }}</p>
				</div>
			</div>

			<h3 class="text-2xl mt-12">Get a head start.</h3>
			<p class="mt-2 text-sm">
				Our sponsors offer free tools and courses. Poke around before the competition.
			</p>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				<a
					v-for="res in resources"
					:key="res.title"
					:href="res.url"
					target="_blank"
					rel="noopener"
					class="card hover:border-gold transition-colors"
				>
					<p class="font-mono text-xs tracking-wider text-darkwhite">{{ res.from }}</p>
					<h4 class="text-lg mt-1">{{ res.title }} ↗</h4>
					<p class="mt-2 text-sm leading-relaxed">{{ res.desc }}</p>
				</a>
			</div>

			<div class="mt-8">
				<RouterLink to="/students">
					<ActionButton right-icon="arrow-right">Register now</ActionButton>
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ActionButton from '@/components/common/ActionButton.vue';

library.add(faArrowRight);

export default defineComponent({
	components: {
		ActionButton,
	},
	mixins: [],
	props: {},
	data() {
		return {
			expectations: [
				{
					title: 'Industry-written problems',
					desc: 'Sponsor representatives bring the challenges you will compete on, and they judge the results.',
				},
				{
					title: 'Company presentations',
					desc: 'Hear what sponsors are actually building in quantum, then grill them in a dedicated Q&A session before the competition kicks off.',
				},
				{
					title: 'Networking & recruiting',
					desc: 'Talk with sponsors over lunch and throughout the event. Resumes of interested students are handed directly to each sponsoring company.',
				},
				{
					title: 'Prizes, food & swag',
					desc: 'Sponsor support covers your meals, event merch, travel help, and prizes for the winning teams.',
				},
			],
			resources: [
				{
					from: 'IBM',
					title: 'IBM Quantum Platform',
					desc: 'Run circuits on real IBM quantum computers with free monthly execution time, plus docs and courses.',
					url: 'https://quantum.cloud.ibm.com',
				},
				{
					from: 'IBM',
					title: 'Qiskit',
					desc: 'The open-source SDK most quantum developers start with. Worth installing before you arrive.',
					url: 'https://www.ibm.com/quantum/qiskit',
				},
				{
					from: 'QUANTUM RINGS',
					title: 'Quantum Rings SDK',
					desc: 'Simulate large circuits on your own laptop, free for non-commercial use, with a free Quantum 101 course.',
					url: 'https://www.quantumrings.com',
				},
			],
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped>
@reference "@/theme.css";

.card {
	@apply block bg-navy-3 border border-navy-4 rounded-lg p-5;
}
</style>
