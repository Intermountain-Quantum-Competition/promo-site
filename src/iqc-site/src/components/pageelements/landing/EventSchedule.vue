<template>
	<div class="py-20 flex justify-center">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<h2 class="font-body tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
				<span class="text-gold mr-2">02</span> SCHEDULE
			</h2>
			<p class="text-sm text-darkwhite">All times MST (GMT −07:00).</p>

			<a :href="scheduleFlyerUrl" download="iqc-schedule-flyer.pdf" class="inline-block mt-4">
				<ActionButton :variant="BTN_VARIANT.Secondary">Download schedule</ActionButton>
			</a>

			<template v-for="(day, dayIdx) in schedule" :key="dayIdx">
				<div>
					<h3 class="text-2xl mt-6">
						{{ getFormattedDate({ ...startDate, day: startDate.day + dayIdx }) }}
					</h3>

					<template v-for="(event, evtIdx) in day" :key="`${dayIdx}-${evtIdx}`">
						<div
							class="flex items-center bg-navy-3 rounded-lg mt-3 overflow-hidden border border-navy-4"
						>
							<p
								class="bg-navy-2 px-4 py-4 font-mono mr-4 min-w-26 text-center rounded-lg"
							>
								{{ event.time }}
							</p>
							<p class="font-body">{{ event.desc }}</p>
						</div>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionButton, { BTN_VARIANT } from '@/components/common/ActionButton.vue';
import scheduleFlyerUrl from '@/assets/material/iqc-schedule-flyer.pdf?url';

export default defineComponent({
	components: { ActionButton },
	mixins: [],
	props: {},
	data() {
		return {
			BTN_VARIANT,
			scheduleFlyerUrl,
			startDate: { year: 2026, month: 11, day: 6 },
			schedule: [
				[
					// Day 1
					{ time: '09:00', desc: 'Check-in' },
					{ time: '10:00', desc: 'Opening remarks' },
					{ time: '10:15', desc: 'Company presentations' },
					{ time: '11:30', desc: 'Panel discussion' },
					{ time: '12:30', desc: 'Networking lunch & team formation' },
					{ time: '13:40', desc: 'Challenge track teasers & selection' },
					{ time: '15:15', desc: 'Team challenge announcements' },
					{ time: '23:30', desc: 'Move to Talmage Building (for overnight hacking)' },
				],
				[
					// Day 2
					{ time: '09:00', desc: 'Breakfast' },
					{ time: '12:30', desc: 'Lunch' },
					{ time: '15:00', desc: 'Projects due' },
					{ time: '15:00', desc: 'Team presentations & judging' },
					{ time: '17:00', desc: 'Closing awards ceremony' },
				],
				// [
				// 	// Day 3
				// 	{ time: '12:00', desc: 'Placeholder' },
				// ],
			],
		};
	},
	computed: {},
	methods: {
		getFormattedDate(dateParts: { year: number; month: number; day: number }) {
			const dateStr = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
			// undefined allows formatting in local locale
			return new Date(dateStr).toLocaleDateString(undefined, {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
			});
		},
	},
});
</script>

<style scoped></style>
