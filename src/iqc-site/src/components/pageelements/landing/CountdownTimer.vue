<template>
	<div class="bg-navy-2 border-t-2 border-b-2 border-navy-4 py-12 lg:py-20 flex justify-center">
		<div class="flex flex-col items-center w-11/12 lg:w-2/3 max-w-300">
			<p class="tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
				<span class="text-gold mr-2">01</span> COUNTDOWN
			</p>
			<div
				class="bg-navy-1 w-full rounded-2xl border-2 border-navy-4 flex items-center justify-around py-4 lg:py-20 px-10 lg:px-30"
			>
				<div class="flex flex-col items-center">
					<p class="text-3xl lg:text-8xl">{{ timeValues.days }}</p>
					<p class="text-xs lg:text-md mt-2 text-darkwhite">DAY</p>
				</div>
				<div class="text-xl lg:text-6xl mb-6">:</div>
				<div class="flex flex-col items-center">
					<p class="text-3xl lg:text-8xl">{{ timeValues.hours }}</p>
					<p class="text-xs lg:text-md mt-2 text-darkwhite">HR</p>
				</div>
				<div class="text-xl lg:text-6xl mb-6">:</div>
				<div class="flex flex-col items-center">
					<p class="text-3xl lg:text-8xl">{{ timeValues.minutes }}</p>
					<p class="text-xs lg:text-md mt-2 text-darkwhite">MIN</p>
				</div>
				<div class="text-xl lg:text-6xl mb-6">:</div>
				<div class="flex flex-col items-center">
					<p class="text-3xl lg:text-8xl">{{ timeValues.seconds }}</p>
					<p class="text-xs lg:text-md mt-2 text-darkwhite">SEC</p>
				</div>
			</div>

			<div
				class="flex flex-col lg:flex-row items-center lg:justify-center gap-4 lg:gap-12 w-full mt-8"
			>
				<!-- <RouterLink to="/about"> -->
				<ActionButton :variant="BTN_VARIANT.Secondary">SEE THE SCHEDULE</ActionButton>
				<!-- </RouterLink> -->
				<RouterLink to="/students">
					<ActionButton right-icon="arrow-right-long">REGISTER</ActionButton>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import ActionButton, { BTN_VARIANT } from '@/components/common/ActionButton.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ActionButton,
	},
	mixins: [],
	props: {},
	data() {
		return {
			eventTime: new Date('2026-12-04T00:00:00-06:00'),
			intervalRef: -1,
			BTN_VARIANT,
			timeValues: {
				days: '00',
				hours: '00',
				minutes: '00',
				seconds: '00',
			},
		};
	},
	computed: {},
	mounted() {
		this.intervalRef = setInterval(() => {
			this.updateTimeValues();
		}, 200);
	},
	unmounted() {
		clearInterval(this.intervalRef);
	},
	methods: {
		updateTimeValues() {
			const values = this.getTimeUntil(this.eventTime);
			this.timeValues = {
				days: values.days.toString().padStart(2, '0'),
				hours: values.hours.toString().padStart(2, '0'),
				minutes: values.minutes.toString().padStart(2, '0'),
				seconds: values.seconds.toString().padStart(2, '0'),
			};
		},
		getTimeUntil(date: Date) {
			const now = new Date();
			const timeUntil = new Date(date.valueOf() - now.valueOf());

			return this.getValueAsComponents(timeUntil);
		},
		getValueAsComponents(date: Date) {
			const value = date.valueOf();

			const seconds = Math.floor(value / 1000) % 60;
			const minutes = Math.floor(value / (1000 * 60)) % 60;
			const hours = Math.floor(value / (1000 * 60 * 60)) % 24;
			const days = Math.floor(value / (1000 * 60 * 60 * 24));

			return {
				days,
				hours,
				minutes,
				seconds,
			};
		},
	},
});
</script>

<style scoped></style>
