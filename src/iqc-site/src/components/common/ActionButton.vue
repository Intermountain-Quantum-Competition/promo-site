<template>
	<button :class="variantClass" @mouseenter="hovered" @mouseleave="unhovered">
		<div class="flex items-center relative">
			<div
				:class="[
					'transition-all',
					isHovered && rightIcon ? '-translate-x-4' : 'translate-x-0',
				]"
			>
				<slot></slot>
			</div>
			<FontAwesomeIcon
				v-if="rightIcon"
				:icon="rightIcon"
				:class="[
					'absolute transition-all right-0',
					isHovered ? 'opacity-100 translate-x-4' : 'opacity-0 -translate-x-0',
				]"
			/>
		</div>
	</button>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

const BTN_VARIANT = {
	Primary: 'PRIMARY',
	Secondary: 'SECONDARY',
} as const;

export default defineComponent({
	components: {
		FontAwesomeIcon,
	},
	mixins: [],
	props: {
		variant: {
			type: String as PropType<(typeof BTN_VARIANT)[keyof typeof BTN_VARIANT]>,
			default: BTN_VARIANT.Primary,
			validator: (value: string) => (Object.values(BTN_VARIANT) as string[]).includes(value),
		},
		rightIcon: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			BTN_VARIANT,
			isHovered: false,
		};
	},
	computed: {
		variantClass() {
			switch (this.variant) {
				case BTN_VARIANT.Primary:
					return 'variant-primary';
				case BTN_VARIANT.Secondary:
					return 'variant-secondary';
				default:
					return '';
			}
		},
	},
	methods: {
		hovered() {
			this.isHovered = true;
		},
		unhovered() {
			this.isHovered = false;
		},
	},
});

export { BTN_VARIANT };
</script>

<style scoped>
/* @import 'tailwindcss'; */
@reference "@/theme.css";

.variant-primary {
	@apply bg-salmon rounded-lg px-12 py-3 cursor-pointer transition-all duration-200 text-gray-950 font-bold;
	box-shadow: 0px 0px 9px 0px var(--color-salmon);
}

.variant-primary:hover {
	box-shadow: 0px 0px 12px 1px var(--color-salmon);
}

.variant-secondary {
	@apply border rounded-lg px-8 py-3 border-gold text-gold bg-gold/10 cursor-pointer hover:bg-gold/15 transition-colors duration-100;
}
</style>
