<template>
	<section id="our-sponsors" class="w-full flex justify-center py-10 scroll-mt-6">
		<div class="w-11/12 lg:w-2/3 max-w-300">
			<h2 class="font-body tracking-widest mb-6 text-xs lg:text-sm font-bold">
				<span class="text-gold mr-2">01</span> OUR SPONSORS
			</h2>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
				<SponsorTile v-for="sponsor in sponsors" :key="sponsor.name" v-bind="sponsor">
					<img
						v-if="sponsor.name === 'IBM'"
						:src="qiskitEventSticker"
						alt="IBM Qiskit Fall Fest 2026"
						class="max-h-28"
					/>
				</SponsorTile>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SponsorTile from '@/components/pageelements/sponsors/SponsorTile.vue';
import ibmLogo from '@/assets/branding/Sponsors/ibm.svg';
import nasdaqLogo from '@/assets/branding/Sponsors/nasdaq.svg';
import nucleusLogo from '@/assets/branding/Sponsors/nucleusinstitute.svg';
import quantumRingsLogo from '@/assets/branding/Sponsors/quantumrings.svg';
import qiskitEventSticker from '@/assets/material/IBM Qiskit Fall Fest 2026.svg';
import justbuildLogo from '@/assets/branding/Sponsors/justbuild.svg';
import aqoraLogo from '@/assets/branding/Sponsors/aqora.svg';
import ionqLogo from '@/assets/branding/Sponsors/ionq.webp';
import qbraidLogo from '@/assets/branding/Sponsors/qbraid.webp';
import vasionLogo from '@/assets/branding/Sponsors/vasion.svg';
import sandiaLogo from '@/assets/branding/Sponsors/sandia.svg';
import byuPhysicsLogo from '@/assets/branding/Sponsors/byuphysics.webp';
import goldmanSachsLogo from '@/assets/branding/Sponsors/goldmansachs.svg';

/*
Blurbs are condensed from each organization's own quantum pages (September 2026; IonQ
onward, October 2026). Goldman Sachs's is written from its published research, not its own
copy — swap it out first when approved text arrives. When a sponsor sends approved copy, replace theirs outright rather
than merging it with this.
*/
const SPONSORS = [
	{
		name: 'IBM',
		logo: ibmLogo,
		logoClass: 'h-8',
		tagline: 'QUANTUM HARDWARE & QISKIT',
		blurb: "IBM Quantum runs the world's largest fleet of 100+ qubit quantum computers and builds Qiskit, the most widely used open-source software stack for quantum computing. Its IBM Quantum Network brings together hundreds of universities, companies, and startups advancing the field. IQC is part of IBM's Qiskit Fall Fest 2026.",
		url: 'https://www.ibm.com/quantum',
	},
	{
		name: 'Nasdaq',
		logo: nasdaqLogo,
		logoClass: 'h-9',
		tagline: 'MARKETS & FINANCIAL TECHNOLOGY',
		blurb: 'Nasdaq powers global capital markets, and is exploring where quantum computing fits in finance. Through Nasdaq Verafin, it is running a proof of concept that applies quantum computing to financial crime detection, looking for patterns of fraud, scams, and money laundering hidden in complex transaction networks.',
		url: 'https://www.nasdaq.com',
	},
	{
		name: 'The Nucleus Institute',
		logo: nucleusLogo,
		logoClass: 'h-6',
		tagline: "UTAH'S INNOVATION HUB",
		blurb: "Nucleus convenes, educates, and funds innovation in Utah, bringing together industry, academia, and government. It houses the Utah Quantum Institute, the state's central hub for quantum innovation, and partners with the Governor's Office on the Utah Quantum Initiative to make Utah the launchpad for quantum tech.",
		url: 'https://www.nucleusutah.org/programs',
	},
	{
		name: 'Quantum Rings',
		logo: quantumRingsLogo,
		logoClass: 'h-10',
		tagline: 'QUANTUM SIMULATION',
		blurb: 'Quantum Rings builds the execution layer for quantum computing. Through their large-scale quantum simulator, run simulations with hundreds of qubits and millions of operations on hardware you already own. With their Open Quantum platform, execute workloads in minutes on real quantum computers across several vendors and modalities.',
		url: 'https://www.quantumrings.com',
	},
	{
		name: 'JustBuild',
		logo: justbuildLogo,
		logoClass: 'h-8',
		tagline: "UTAH'S AI-NATIVE BUILDER COMMUNITY",
		blurb: "JustBuild is Utah's AI-native builder community. We bring together founders, engineers, designers, PMs, and curious builders to learn fast, build real things, and grow the local startup ecosystem. Through hackathons, coworking sessions, and hands-on events, JustBuild helps people meet collaborators, sharpen their skills, and ship real projects. The community is led by Max Forsey and Jacob Wright.",
		url: 'https://justbuild.ing/',
	},
	{
		name: 'Aqora',
		logo: aqoraLogo,
		logoClass: 'h-8',
		tagline: 'QUANTUM COMPETITIONS & COMMUNITY',
		blurb: 'Aqora is a platform where companies and quantum experts connect to solve real use cases together. It hosts online quantum competitions and hackathons, backed by a job board and a global community, so you can put your skills to work on real-world problems and get noticed by top quantum teams.',
		url: 'https://aqora.io/',
	},
	{
		name: 'IonQ',
		logo: ionqLogo,
		logoClass: 'h-9',
		tagline: 'TRAPPED-ION QUANTUM COMPUTING',
		blurb: 'IonQ builds quantum computers out of trapped ions, an approach that grew from more than 30 years of academic research by its founders, Chris Monroe and Jungsang Kim. Its systems, including IonQ Forte and Tempo, are available over the cloud, and its work now extends into quantum networking, security, and sensing.',
		url: 'https://ionq.com',
	},
	{
		name: 'qBraid',
		logo: qbraidLogo,
		logoClass: 'h-9',
		tagline: 'THE QUANTUM CLOUD',
		blurb: 'qBraid is a hardware-agnostic quantum computing platform used by more than 27,000 developers. It puts machines from IonQ, QuEra, IBM, Rigetti, and others behind one cloud interface, alongside a browser-based IDE for writing quantum programs and qBook, an interactive quantum curriculum.',
		url: 'https://qbraid.com',
	},
	{
		name: 'Vasion',
		logo: vasionLogo,
		logoClass: 'h-5',
		tagline: 'ENTERPRISE PRINT & AUTOMATION',
		blurb: 'Vasion, headquartered in St. George, Utah, helps companies simplify their print infrastructure, automate business processes, and integrate their technology securely. Formerly PrinterLogic, it rebranded in 2021 around a broader mission: making digital transformation attainable for everyone.',
		url: 'https://vasion.com',
	},
	{
		name: 'Sandia National Laboratories',
		logo: sandiaLogo,
		logoClass: 'h-10',
		tagline: 'QUANTUM INFORMATION SCIENCE',
		blurb: "Sandia is a multimission national laboratory for the U.S. Department of Energy's National Nuclear Security Administration. Its Quantum Information Program spans computing, sensing, and communications: fabricating trapped-ion and semiconductor qubits, running the QSCOUT open trapped-ion testbed, and building cold-atom sensors and on-chip quantum key distribution hardware.",
		url: 'https://www.sandia.gov/quantum/',
	},
	{
		name: 'BYU Physics & Astronomy',
		logo: byuPhysicsLogo,
		logoClass: 'h-5',
		tagline: 'QUANTUM RESEARCH & EDUCATION',
		blurb: "BYU's Department of Physics and Astronomy has faculty working on quantum dynamics, quantum information, and quantum optics, and a quantum research group that meets weekly and is open to visitors. Every undergraduate physics major completes a research thesis or capstone, so students work in labs alongside faculty early on.",
		url: 'https://physics.byu.edu',
	},
	{
		name: 'Goldman Sachs',
		logo: goldmanSachsLogo,
		logoClass: 'h-10',
		tagline: 'QUANTUM ALGORITHMS FOR FINANCE',
		blurb: 'Goldman Sachs is a global investment bank whose research team has been studying quantum computing for financial applications since 2018. Working with partners such as IBM, QC Ware, and AWS, it has published research on quantum algorithms for pricing derivatives and analyzing risk, including estimates of the hardware needed for quantum advantage in finance.',
		url: 'https://www.goldmansachs.com',
	},
];

export default defineComponent({
	components: {
		SponsorTile,
	},
	mixins: [],
	props: {},
	data() {
		return {
			sponsors: SPONSORS,
			qiskitEventSticker,
		};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
