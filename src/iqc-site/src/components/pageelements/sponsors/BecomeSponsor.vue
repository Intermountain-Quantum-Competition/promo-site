<template>
	<section id="become-a-sponsor" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<div class="mb-8">
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">03</span> BECOME A SPONSOR
				</p>
				<h2 class="text-3xl lg:text-5xl">Interested in sponsoring?</h2>
				<p class="mt-2 lg:mt-4 text-sm lg:text-md">
					Put your company in front of the Intermountain West's top quantum talent,
					November 6–7, 2026.
				</p>
			</div>

			<!-- What we really want -->
			<h3 class="text-2xl">What we really want.</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				<div class="card md:col-span-1 flex flex-col">
					<p class="font-mono text-xs tracking-wider text-gold">MENTORSHIP</p>
					<p class="text-xl mt-2 font-subheader">A representative (or two)</p>
					<p class="mt-2 text-sm leading-relaxed">
						Administer and judge a problem for students to solve. This makes the event
						feel both exciting and real.
					</p>
				</div>
				<div
					v-for="tier in tiers"
					:key="tier.name"
					class="card flex flex-col"
					:class="{ 'border-gold!': tier.featured }"
				>
					<p class="font-mono text-xs tracking-wider text-gold">
						{{ tier.name }} SPONSOR*
					</p>
					<p class="text-4xl mt-2 font-header">{{ tier.price }}</p>
					<p class="mt-2 text-sm leading-relaxed">{{ tier.desc }}</p>
				</div>
			</div>

			<!-- What would be cool -->
			<h3 class="text-2xl mt-12">What would be cool.</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				<div v-for="item in extras" :key="item.title" class="card">
					<p class="font-mono text-xs tracking-wider text-gold">{{ item.title }}</p>
					<p class="mt-2 text-sm leading-relaxed">{{ item.desc }}</p>
				</div>
			</div>

			<!-- What you get / where it goes -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
				<div>
					<h3 class="text-2xl">What you get.</h3>
					<ul class="mt-4 flex flex-col gap-3">
						<li v-for="item in benefits" :key="item.title" class="row">
							<p class="font-mono text-xs tracking-wider text-gold min-w-30">
								{{ item.title }}
							</p>
							<p class="text-sm leading-relaxed">{{ item.desc }}</p>
						</li>
					</ul>
				</div>
				<div>
					<h3 class="text-2xl">Where your contribution goes.</h3>
					<ul class="mt-4 flex flex-col gap-3">
						<li v-for="item in uses" :key="item.title" class="row">
							<p class="font-mono text-xs tracking-wider text-gold min-w-30">
								{{ item.title }}
							</p>
							<p class="text-sm leading-relaxed">{{ item.desc }}</p>
						</li>
					</ul>
				</div>
			</div>

			<!-- CTA -->
			<div
				class="mt-12 border-2 border-navy-4 bg-navy-2 rounded-lg p-6 lg:p-10 flex flex-col lg:flex-row gap-6 lg:items-center justify-between"
			>
				<div class="lg:max-w-1/2">
					<p class="text-xl font-subheader">Let's talk.</p>
					<p class="mt-2 text-sm leading-relaxed text-darkwhite">
						*If funding is the reason your company can't attend, we'd still like to work
						with you. We'll figure out a cost and support level that fits your
						organization.
					</p>
				</div>
				<div class="flex flex-col sm:flex-row gap-4">
					<a :href="`mailto:${email}?subject=IQC%20Sponsorship`">
						<ActionButton right-icon="arrow-right">Email us</ActionButton>
					</a>
					<a :href="flyerUrl" target="_blank" rel="noopener">
						<ActionButton :variant="BTN_VARIANT.Secondary">Download flyer</ActionButton>
					</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ActionButton, { BTN_VARIANT } from '@/components/common/ActionButton.vue';
import flyerUrl from '@/assets/material/iqc-sponsorship-info.pdf?url';

library.add(faArrowRight);

/* Content mirrors assets/material/iqc-sponsorship-info.pdf. Update both together. */
export default defineComponent({
	components: {
		ActionButton,
	},
	mixins: [],
	props: {},
	data() {
		return {
			BTN_VARIANT,
			flyerUrl,
			email: 'hello@intermountainquantum.org',
			tiers: [
				{
					name: 'PRIMARY',
					price: '$5,000',
					desc: 'Our headline level of support for the event.',
					featured: true,
				},
				{
					name: 'SECONDARY',
					price: '$2,500',
					desc: 'A meaningful way to back the competition and its students.',
					featured: false,
				},
			],
			extras: [
				{
					title: 'PLATFORM & HARDWARE CREDITS',
					desc: "Got 'em? We'd love to use 'em!",
				},
				{
					title: 'SPEAKERS',
					desc: 'Want to give a presentation? Let us know.',
				},
				{
					title: 'PRIZES',
					desc: "Have something cool you want to give the winner? We've seen everything from cash to gaming consoles.",
				},
			],
			benefits: [
				{
					title: 'EXPOSURE',
					desc: 'Company logo on t-shirts and merchandise, outgoing announcements, and this website.',
				},
				{
					title: 'RECRUITING',
					desc: 'Direct interactions with students. Resumes of interested students are handed to each company.',
				},
				{
					title: 'SPEAKING',
					desc: 'Highlight company efforts in front of top-talent students and guests.',
				},
				{
					title: 'LODGING',
					desc: 'Our partner hotels give us access to discounted rates. Take advantage!',
				},
			],
			uses: [
				{ title: 'MERCHANDISE', desc: "We'll provide the swag." },
				{
					title: 'FOOD',
					desc: 'Funds go directly to feeding everyone (and the crowd goes wild).',
				},
				{
					title: 'TRAVEL',
					desc: 'Money is hard for students, so we use financial gifts to help get them here.',
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
	@apply bg-navy-3 border border-navy-4 rounded-lg p-5;
}

.row {
	@apply flex flex-col sm:flex-row gap-1 sm:gap-4 bg-navy-3 border border-navy-4 rounded-lg p-4;
}
</style>
