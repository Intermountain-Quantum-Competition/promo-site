<template>
	<div class="py-20 flex justify-center">
		<div class="w-2/3 max-w-300">
			<div class="mb-8">
				<p class="tracking-widest w-full mb-2 text-sm font-bold">
					<span class="text-gold mr-2">02</span> SCHEDULE
				</p>
				<h1 class="text-5xl">Lots to do.</h1>
				<p class="mt-4">All dates and times are in MST (GMT -07:00).</p>
			</div>

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
								class="bg-navy-2 px-4 py-4 font-mono mr-4 w-26 text-center rounded-lg"
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

export default defineComponent({
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			startDate: { year: 2026, month: 12, day: 4 },
			schedule: [
				[
					// Day 1
					{ time: '00:00', desc: 'Event Start' },
					{ time: '08:00', desc: 'Breakfast' },
					{ time: '20:00', desc: 'Sleepy Time' },
				],
				[
					// Day 2
					{ time: '12:00', desc: 'Placeholder' },
				],
				[
					// Day 3
					{ time: '12:00', desc: 'Placeholder' },
				],
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
