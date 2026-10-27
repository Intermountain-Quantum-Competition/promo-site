<template>
	<section id="for-students" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<h2 class="font-body tracking-widest mb-6 text-xs lg:text-sm font-bold">
				<span class="text-gold mr-2">02</span> FOR STUDENTS
			</h2>

			<ul>
				<li v-for="item in expectations" :key="item.title" class="row">
					<p class="font-mono text-xs tracking-wider text-gold uppercase md:min-w-56">
						{{ item.title }}
					</p>
					<p class="text-sm leading-relaxed">{{ item.desc }}</p>
				</li>
			</ul>

			<h3 class="text-2xl mt-12">Free tools from our sponsors</h3>
			<ul class="mt-4">
				<li v-for="res in resources" :key="res.title" class="row">
					<p class="font-mono text-xs tracking-wider text-darkwhite md:min-w-56">
						{{ res.from }}
					</p>
					<p class="text-sm leading-relaxed">
						<a
							:href="res.url"
							target="_blank"
							rel="noopener"
							class="font-subheader text-base text-gold hover:underline"
							>{{ res.title }} ↗</a
						>
						<br />
						{{ res.desc }}
					</p>
				</li>
			</ul>

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

.row {
	@apply flex flex-col md:flex-row gap-1 md:gap-6 py-4 border-b border-navy-4 first:border-t;
}
</style>
