<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="flex flex-col w-full items-center mt-30">
				<div class="mt-auto mb-14 w-11/12 lg:w-2/3 lg:max-w-300">
					<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
						<span class="text-gold mr-2">00</span> START
					</p>
					<h1 class="text-3xl lg:text-5xl">Backed by industry giants.</h1>
					<p class="mt-2 lg:mt-4 text-sm lg:text-md">
						The perfect opportunity to connect with industry leaders and big players.
						<br />
						Show 'em what you got.
					</p>
					<nav class="flex flex-wrap gap-x-6 gap-y-2 mt-6" aria-label="On this page">
						<RouterLink
							v-for="link in jumpLinks"
							:key="link.hash"
							:to="{ hash: link.hash }"
							class="font-mono font-bold text-xs lg:text-sm tracking-wider hover:text-gold"
						>
							<span class="text-gold">↓</span> {{ link.label }}
						</RouterLink>
					</nav>
				</div>
			</div>
		</HeroSection>

		<SponsorsDisplay />
		<SponsorsForStudents />
		<BecomeSponsor />
		<SponsorResources />

		<div class="flex justify-center mb-4 mt-8">
			<div class="w-11/12 lg:w-2/3 max-w-300">
				<p class="tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">05</span> END
				</p>
			</div>
		</div>

		<PageFooter />
	</div>
</template>

<script lang="ts">
import BecomeSponsor from '@/components/pageelements/sponsors/BecomeSponsor.vue';
import SponsorResources from '@/components/pageelements/sponsors/SponsorResources.vue';
import SponsorsDisplay from '@/components/pageelements/sponsors/SponsorsDisplay.vue';
import SponsorsForStudents from '@/components/pageelements/sponsors/SponsorsForStudents.vue';
import HeroSection from '@/components/shared/HeroSection.vue';
import PageFooter from '@/components/shared/PageFooter.vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		HeroSection,
		PageHeader,
		PageFooter,
		SponsorsDisplay,
		SponsorsForStudents,
		BecomeSponsor,
		SponsorResources,
	},
	mixins: [],
	props: {},
	data() {
		return {
			/* One entry per audience, so each can be linked to directly: /sponsors#... */
			jumpLinks: [
				{ hash: '#our-sponsors', label: 'OUR SPONSORS' },
				{ hash: '#for-students', label: 'FOR STUDENTS' },
				{ hash: '#become-a-sponsor', label: 'BECOME A SPONSOR' },
				{ hash: '#sponsor-resources', label: 'SPONSOR RESOURCES' },
			],
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
