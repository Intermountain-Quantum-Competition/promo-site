<template>
	<div>
		<HeroSection>
			<PageHeader />
			<div class="flex flex-col w-full items-center mt-30">
				<div class="mt-auto mb-14 w-11/12 lg:w-2/3 lg:max-w-300">
					<p class="tracking-widest lg:mb-2 text-xs lg:text-sm font-bold">
						<span class="text-gold mr-2">00</span> START
					</p>
					<h1 class="text-3xl lg:text-5xl">Be part of something great.</h1>
					<p class="mt-2 lg:mt-4 text-sm lg:text-md">
						Register to get ready to join the Intermountain West's biggest quantum
						computing event ever. <br />
						You just can't miss this.
					</p>
				</div>
			</div>
		</HeroSection>

		<RegisterForm />

		<div class="flex justify-center mb-4">
			<div class="w-11/12 lg:w-2/3 max-w-300">
				<p class="tracking-widest w-full mb-2 text-xs lg:text-sm font-bold">
					<span class="text-gold mr-2">02</span> END
				</p>
			</div>
		</div>

		<PageFooter />
	</div>
</template>

<script lang="ts">
import RegisterForm from '@/components/pageelements/students/RegisterForm.vue';
import HeroSection from '@/components/shared/HeroSection.vue';
import PageFooter from '@/components/shared/PageFooter.vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		HeroSection,
		PageHeader,
		PageFooter,
		RegisterForm,
	},
	mixins: [],
	props: {},
	data() {
		return {};
	},
	computed: {},
	methods: {},
});
</script>

<style scoped></style>
