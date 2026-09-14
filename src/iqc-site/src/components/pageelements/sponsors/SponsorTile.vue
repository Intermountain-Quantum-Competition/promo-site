<template>
	<article
		class="w-full border-2 border-navy-4 bg-navy-2 rounded-lg p-5 lg:p-8 flex flex-col lg:flex-row gap-6"
	>
		<div class="flex-1 flex flex-col">
			<div class="h-10 flex items-center">
				<img :src="logo" :alt="name" :class="logoClass" />
			</div>
			<p class="mt-2 font-mono text-xs tracking-wider text-darkwhite">{{ tagline }}</p>
			<p class="mt-4 text-sm leading-relaxed">{{ blurb }}</p>
			<a
				:href="url"
				target="_blank"
				rel="noopener"
				class="mt-auto pt-5 font-mono font-bold text-xs lg:text-sm tracking-wider text-gold hover:underline w-max"
			>
				LEARN MORE ↗
			</a>
		</div>
		<div v-if="$slots.default" class="flex justify-center items-center lg:w-48 shrink-0">
			<slot></slot>
		</div>
	</article>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	components: {},
	mixins: [],
	props: {
		name: {
			type: String,
			required: true,
		},
		/** Resolved asset URL — import the file, don't path it. */
		logo: {
			type: String,
			required: true,
		},
		/** Height trim per logo, since artwork padding varies. */
		logoClass: {
			type: String,
			default: 'h-8',
		},
		tagline: {
			type: String,
			default: '',
		},
		blurb: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	data() {
		return {};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
