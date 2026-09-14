<template>
	<section id="sponsor-resources" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<div class="mb-8">
				<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">04</span> SPONSOR RESOURCES
				</p>
				<h2 class="text-3xl lg:text-5xl">Already on board?</h2>
				<p class="mt-2 lg:mt-4 text-sm lg:text-md">
					Thank you. Here's what to have ready, and where you're needed on event days.
				</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div>
					<h3 class="text-2xl">Before the event.</h3>
					<ul class="mt-4 flex flex-col gap-3">
						<li
							v-for="(item, idx) in checklist"
							:key="item.title"
							class="flex gap-4 bg-navy-3 border border-navy-4 rounded-lg p-4"
						>
							<span class="font-mono text-gold">{{
								String(idx + 1).padStart(2, '0')
							}}</span>
							<div>
								<p class="font-subheader text-lg">{{ item.title }}</p>
								<p class="text-sm leading-relaxed mt-1">{{ item.desc }}</p>
							</div>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="text-2xl">Where you're needed.</h3>
					<p class="mt-1 text-sm text-darkwhite">All times MST.</p>
					<template v-for="day in sponsorDays" :key="day.label">
						<p class="font-mono text-xs tracking-wider text-gold mt-4">
							{{ day.label }}
						</p>
						<div
							v-for="evt in day.events"
							:key="`${day.label}-${evt.time}-${evt.desc}`"
							class="flex items-center bg-navy-3 rounded-lg mt-2 overflow-hidden border border-navy-4"
						>
							<p
								class="bg-navy-2 px-4 py-3 font-mono mr-4 min-w-22 text-center rounded-lg"
							>
								{{ evt.time }}
							</p>
							<p class="text-sm">{{ evt.desc }}</p>
						</div>
					</template>
				</div>
			</div>

			<div
				class="mt-12 border-2 border-navy-4 bg-navy-2 rounded-lg p-6 lg:p-10 flex flex-col lg:flex-row gap-6 lg:items-center justify-between"
			>
				<div>
					<p class="text-xl font-subheader">Questions? Materials to send?</p>
					<p class="mt-2 text-sm text-darkwhite">
						Reach the organizing team at
						<a :href="`mailto:${email}`" class="text-gold hover:underline">{{
							email
						}}</a
						>.
					</p>
				</div>
				<a :href="`mailto:${email}?subject=IQC%20Sponsor%20Materials`">
					<ActionButton :variant="BTN_VARIANT.Secondary">Contact organizers</ActionButton>
				</a>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ActionButton, { BTN_VARIANT } from '@/components/common/ActionButton.vue';

/*
Times are copied from landing/EventSchedule.vue, filtered to the slots sponsors staff.
If the schedule changes there, change it here too.
*/
export default defineComponent({
	components: {
		ActionButton,
	},
	mixins: [],
	props: {},
	data() {
		return {
			BTN_VARIANT,
			email: 'hello@intermountainquantum.org',
			checklist: [
				{
					title: 'Your competition problem',
					desc: 'Send us the problem your representatives will administer and judge, along with any platform or hardware credits students will need to solve it.',
				},
				{
					title: 'Logo files',
					desc: 'Vector logos (SVG or PDF) for t-shirts, merchandise, announcements, and this site.',
				},
				{
					title: 'Presentation & speakers',
					desc: 'Let us know who is presenting, and anything you need for the company presentation block.',
				},
				{
					title: 'Travel & lodging',
					desc: 'Tell us who is attending so we can share discounted rates with our partner hotels.',
				},
				{
					title: 'Prizes',
					desc: "If you're contributing a prize for the winners, let us know what it is so we can announce it.",
				},
			],
			sponsorDays: [
				{
					label: 'FRIDAY, NOVEMBER 6',
					events: [
						{ time: '09:30', desc: 'Welcome & keynote presentation' },
						{ time: '10:30', desc: 'Company presentations (rounds 1 & 2)' },
						{ time: '12:30', desc: 'Networking lunch with students' },
						{ time: '13:40', desc: 'Q&A presentations & drafting' },
						{ time: '15:15', desc: 'Competition begins' },
					],
				},
				{
					label: 'SATURDAY, NOVEMBER 7',
					events: [
						{ time: '15:00', desc: 'Final team presentations & judging' },
						{ time: '17:00', desc: 'Closing remarks & awards' },
					],
				},
			],
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
