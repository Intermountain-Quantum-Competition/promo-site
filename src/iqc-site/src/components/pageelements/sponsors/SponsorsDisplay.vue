<template>
	<div class="w-full flex justify-center">
		<div class="w-11/12 lg:w-2/3 max-w-300 flex flex-col gap-6">
			<!-- <SponsorTile /> -->

			<div>
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">01</span> SPONSOR 1
				</p>
				<div class="sponsor-tile flex justify-between">
					<div>
						<img :src="ibmLogo" class="h-8" />
						<p class="mt-4">Thanks to IBM for sponsoring this event!</p>
					</div>
					<div class="flex flex-col items-center">
						<img :src="qiskitEventSticker" class="h-full" />
					</div>
				</div>
			</div>

			<div>
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">02</span> SPONSOR 2
				</p>
				<div class="sponsor-tile">
					<img :src="nasdaqLogo" class="h-9" />
					<p class="mt-4">Thanks to Nasdaq for sponsoring this event!</p>
				</div>
			</div>

			<div>
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">03</span> SPONSOR 3
				</p>
				<div class="sponsor-tile">
					<img :src="nucleusLogo" class="h-6" />
					<p class="mt-4">Thanks to the Nucleus Institute for sponsoring this event!</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ibmLogo from '@/assets/branding/Sponsors/ibm.svg';
import nasdaqLogo from '@/assets/branding/Sponsors/nasdaq.svg';
import nucleusLogo from '@/assets/branding/Sponsors/nucleusinstitute.svg';
import qiskitEventSticker from '@/assets/material/IBM Qiskit Fall Fest 2026.svg';

export default defineComponent({
	components: {},
	mixins: [],
	props: {},
	data() {
		return {
			ibmLogo,
			nasdaqLogo,
			nucleusLogo,
			qiskitEventSticker,
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped>
@reference "@/theme.css";

.sponsor-tile {
	@apply w-full border-2 border-navy-4 bg-navy-2 rounded-lg h-40 p-4;
}
</style>
