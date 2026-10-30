<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="flex flex-col w-full items-center mt-30">
				<div class="mt-auto mb-14 w-11/12 lg:w-2/3 lg:max-w-300">
					<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
						<span class="text-gold mr-2">00</span> START
					</p>
					<h1 class="text-3xl lg:text-5xl">About IQC</h1>
					<p class="mt-2 lg:mt-4 text-sm lg:text-md max-w-200 leading-relaxed">
						The Intermountain Quantum Competition (IQC) is a 48-hour hackathon designed
						to forge powerful connections among students, mentors, and leading industry
						organizations. Driven by our motto—<em>Imagine, Qreate, Connect</em
						>—participants will learn from regional quantum experts and work alongside
						on-site mentors to tackle real-world challenges provided by our corporate
						sponsors. This event provides the dedicated time, expert guidance, and
						collaborative environment needed to explore and build impactful quantum
						computing solutions, while giving students the chance to apply their
						learning outside the classroom.
					</p>
				</div>
			</div>
		</HeroSection>

		<TeamSection id="students" number="01" label="STUDENT TEAM" :groups="studentTeam" />
		<TeamSection
			id="administration"
			number="02"
			label="ADMINISTRATION"
			:groups="administration"
		/>

		<div class="flex justify-center mb-4 mt-8">
			<div class="w-11/12 lg:w-2/3 max-w-300">
				<p class="tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">03</span> END
				</p>
			</div>
		</div>

		<PageFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeroSection from '@/components/shared/HeroSection.vue';
import PageFooter from '@/components/shared/PageFooter.vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import TeamSection, { type TeamGroup } from '@/components/pageelements/about/TeamSection.vue';
import ajRasmusson from '@/assets/team/aj-rasmusson.webp';
import allieSensinger from '@/assets/team/allie-sensinger.webp';
import avaDurham from '@/assets/team/ava-durham.webp';
import benPinoli from '@/assets/team/ben-pinoli.webp';
import calebDougal from '@/assets/team/caleb-dougal.webp';
import caymanQuinn from '@/assets/team/cayman-quinn.webp';
import chandlerSaenz from '@/assets/team/chandler-saenz.webp';
import heatherCook from '@/assets/team/heather-cook.webp';
import jeanFrancoisVanHuele from '@/assets/team/jean-francois-van-huele.webp';
import joshAldridge from '@/assets/team/josh-aldridge.webp';
import kaiSandberg from '@/assets/team/kai-sandberg.webp';
import kariePowell from '@/assets/team/karie-powell.webp';
import melanieMiles from '@/assets/team/melanie-miles.webp';
import ryanCamacho from '@/assets/team/ryan-camacho.webp';
import sangjoonRyu from '@/assets/team/sangjoon-ryu.webp';
import willOtt from '@/assets/team/will-ott.webp';

/*
Headshots are 400px square WebP, cropped by hand from the originals the team sent.
Anyone without a `photo` gets an initials tile until theirs arrives.
*/
const STUDENT_TEAM: TeamGroup[] = [
	{
		name: 'Directors',
		people: [
			{ name: 'Will Ott', title: 'Co-Director', photo: willOtt },
			{ name: 'Kai Sandberg', title: 'Co-Director', photo: kaiSandberg },
		],
	},
	{
		name: 'Outreach',
		people: [
			{ name: 'Cayman Quinn', title: 'Outreach Lead', photo: caymanQuinn },
			{ name: 'Melanie Miles', title: 'Outreach', photo: melanieMiles },
			{ name: 'Ben Pinoli', title: 'Outreach', photo: benPinoli },
			{ name: 'Jonas Goodrich', title: 'Outreach' },
		],
	},
	{
		name: 'Infrastructure',
		people: [
			{ name: 'Caleb Dougal', title: 'Web Design and Infrastructure', photo: calebDougal },
			{ name: 'Sangjoon Ryu', title: 'Mid-Event Communications', photo: sangjoonRyu },
		],
	},
	{
		name: 'Branding',
		people: [{ name: 'Ava Durham', title: 'Branding and Design', photo: avaDurham }],
	},
];

const ADMINISTRATION: TeamGroup[] = [
	{
		name: 'Event Logistics',
		people: [
			{
				name: 'Karie Powell',
				title: 'Director, BYU Marketing and Communications',
				photo: kariePowell,
			},
			{ name: 'Chandler Saenz', title: 'Event Manager, BYU Events', photo: chandlerSaenz },
			{
				name: 'Allie Sensinger',
				title: 'Career Director, BYU Mathematics',
				photo: allieSensinger,
			},
			{ name: 'Heather Cook', title: 'Career Director, BYU Physics', photo: heatherCook },
		],
	},
	{
		name: 'Faculty',
		people: [
			{ name: 'Dr. Jean-François Van Huele', photo: jeanFrancoisVanHuele },
			{ name: 'Dr. AJ Rasmusson', photo: ajRasmusson },
			{ name: 'Dr. Ryan Camacho', photo: ryanCamacho },
		],
	},
	{
		name: 'Press and Photography',
		people: [
			{
				name: 'Josh Aldridge',
				title: 'Director of Communications, BYU Physics',
				photo: joshAldridge,
			},
		],
	},
];

export default defineComponent({
	components: {
		HeroSection,
		PageHeader,
		PageFooter,
		TeamSection,
	},
	mixins: [],
	props: {},
	data() {
		return {
			studentTeam: STUDENT_TEAM,
			administration: ADMINISTRATION,
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
