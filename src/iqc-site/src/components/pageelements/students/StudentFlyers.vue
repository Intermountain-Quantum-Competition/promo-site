<template>
	<section id="flyers" class="w-full flex justify-center mb-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<h2 class="font-body tracking-widest mb-6 text-xs lg:text-sm font-bold">
				<span class="text-gold mr-2">02</span> FLYERS
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div
					v-for="flyer in flyers"
					:key="flyer.filename"
					class="flex flex-col pt-4 border-t border-navy-4"
				>
					<p class="font-mono text-xs tracking-wider text-gold">{{ flyer.label }}</p>
					<p class="text-xl mt-2 font-subheader">{{ flyer.title }}</p>
					<p class="mt-2 mb-6 text-sm leading-relaxed">{{ flyer.desc }}</p>
					<a :href="flyer.url" :download="flyer.filename" class="mt-auto self-start">
						<ActionButton :variant="BTN_VARIANT.Secondary">
							Download {{ flyer.format }}
						</ActionButton>
					</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionButton, { BTN_VARIANT } from '@/components/common/ActionButton.vue';
import infoFlyerUrl from '@/assets/material/iqc-student-info-flyer.pdf?url';
import scheduleFlyerUrl from '@/assets/material/iqc-schedule-flyer.png';

export default defineComponent({
	components: {
		ActionButton,
	},
	mixins: [],
	props: {},
	data() {
		return {
			BTN_VARIANT,
			flyers: [
				{
					label: 'STUDENT INFO',
					title: 'What is IQC?',
					desc: 'What the event is, who it is for, and what you will get out of two days of quantum problems, mentors, and recruiters.',
					url: infoFlyerUrl,
					filename: 'iqc-student-info-flyer.pdf',
					format: 'PDF',
				},
				{
					label: 'SCHEDULE',
					title: 'Event schedule',
					desc: 'Times and rooms for November 6–7, from check-in through final presentations and awards.',
					url: scheduleFlyerUrl,
					filename: 'iqc-schedule-flyer.png',
					format: 'PNG',
				},
			],
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
