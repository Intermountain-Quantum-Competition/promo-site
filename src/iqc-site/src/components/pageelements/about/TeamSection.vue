<template>
	<section :id="id" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<p class="tracking-widest mb-8 text-xs lg:text-sm font-bold">
				<span class="text-gold mr-2">{{ number }}</span> {{ label }}
			</p>

			<div class="flex flex-col gap-8">
				<div v-for="group in groups" :key="group.name">
					<h3 class="text-xl lg:text-2xl mb-4">{{ group.name }}</h3>
					<ul class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-6">
						<li v-for="person in group.people" :key="person.name">
							<img
								v-if="person.photo"
								:src="person.photo"
								:alt="person.name"
								class="w-full aspect-square object-cover rounded-lg"
								loading="lazy"
								decoding="async"
							/>
							<!-- Stand-in until a photo arrives; the name below it says who it is. -->
							<div
								v-else
								class="w-full aspect-square rounded-lg bg-navy-3 border border-navy-4 flex items-center justify-center font-header text-4xl text-gold"
								aria-hidden="true"
							>
								{{ initials(person.name) }}
							</div>
							<p class="mt-3 font-subheader">{{ person.name }}</p>
							<p v-if="person.title" class="mt-1 text-sm text-darkwhite">
								{{ person.title }}
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export interface TeamMember {
	name: string;
	title?: string;
	/** Resolved asset URL. Omit it and the tile shows the person's initials instead. */
	photo?: string;
}

export interface TeamGroup {
	name: string;
	people: TeamMember[];
}

export default defineComponent({
	components: {},
	mixins: [],
	props: {
		id: {
			type: String,
			required: true,
		},
		/** The gold section index, e.g. "01". */
		number: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		/** One row per group, rendered in order. */
		groups: {
			type: Array as PropType<TeamGroup[]>,
			required: true,
		},
	},
	data() {
		return {};
	},
	computed: {},
	methods: {
		initials(name: string): string {
			return name
				.replace(/^Dr\.\s+/, '')
				.split(/\s+/)
				.map((part) => part[0])
				.join('')
				.slice(0, 2)
				.toUpperCase();
		},
	},
});
</script>

<style scoped></style>
