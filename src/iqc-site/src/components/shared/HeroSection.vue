<template>
	<section class="relative flex flex-col" :style="sectionStyle">
		<WaveField class="absolute inset-x-0 bottom-0" :style="backdropStyle" :config="config" />
		<!--
		`relative` is what lifts the slot above the backdrop: both it and WaveField are
		z-index auto, so paint order follows document order and the later one wins.
		`flex-1` makes this fill the section's min-height even when the content is
		shorter, so callers can push a block to the bottom with `mt-auto`.
		-->
		<div class="relative flex flex-1 flex-col">
			<slot></slot>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent, type PropType, type StyleValue } from 'vue';
import WaveField, { type WaveFieldOptions } from '@/components/shared/WaveField.vue';

/*
The animated hero backdrop plus whatever sits on top of it.

The height is the component's own, not the content's. A hero is usually taller than the
markup inside it, and sizing the section to its content shrink-wraps the animation to
the page header — which is what this component exists to stop. `minHeight` sets the
floor; content longer than that grows the section and the backdrop grows with it.
*/
export default defineComponent({
	components: {
		WaveField,
	},
	mixins: [],
	props: {
		/** Any CSS length. The backdrop fills at least this much, whatever the slot holds. */
		minHeight: {
			type: String,
			default: '40rem',
		},
		/**
		 * Clear space above the animation, so it starts below the page header instead of
		 * running up under it. The field's own top edge fade softens the boundary further,
		 * so this is where the animation is fully clear, not where it becomes visible.
		 */
		backdropTop: {
			type: String,
			default: '2rem',
		},
		/** Forwarded to WaveField — see WaveFieldConfig for the full set of knobs. */
		config: {
			type: Object as PropType<WaveFieldOptions>,
			default(): WaveFieldOptions {
				return {};
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		sectionStyle(): StyleValue {
			return { minHeight: this.minHeight };
		},
		/* Merged onto WaveField's root alongside its own :style binding, which Vue handles. */
		backdropStyle(): StyleValue {
			return { top: this.backdropTop };
		},
	},
	methods: {},
});
</script>

<style scoped></style>
