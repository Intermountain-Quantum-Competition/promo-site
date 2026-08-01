<template>
	<div
		v-if="sponsors.length > 0"
		class="sponsor-scroller mx-auto w-full max-w-300"
		:style="rootStyle"
	>
		<!--
		Background and rules hang on the viewport rather than on a wrapper, because a mask
		covers an element's whole rendering — so the fill and the two lines fade out on the
		exact curve the logos do, and the strip has no hard edge anywhere.
		-->
		<div
			ref="viewport"
			class="sponsor-scroller__viewport border-offwhite/10 bg-navy-2/65 border-y"
		>
			<div class="sponsor-scroller__track" :style="trackStyle">
				<!--
					Copy 0 is the real list; the rest are visual filler that exists only so the
					strip never runs out of content mid-loop, so they are hidden from the
					accessibility tree. `groups` is measured, not fixed — see measure().
					-->
				<ul
					v-for="copy in groups"
					:key="copy"
					class="sponsor-scroller__group"
					:aria-label="copy === 1 ? label : undefined"
					:aria-hidden="copy === 1 ? undefined : 'true'"
				>
					<li v-for="sponsor in sponsors" :key="sponsor.name" class="shrink-0">
						<img
							:src="sponsor.logo"
							:alt="copy === 1 ? sponsor.name : ''"
							class="sponsor-scroller__logo"
							decoding="async"
							@load="onLogoLoad"
						/>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType, type StyleValue } from 'vue';

/*
A slow, seamless marquee of sponsor logos for the bottom of the hero. Non-interactive
by design: no links, no hover, no pointer events — it is a credits strip, not a nav.

The loop is one CSS transform animation on a track holding N identical copies of the
list, shifted by exactly one copy's width per cycle. Because copy 2 starts where copy 1
ended, the wrap is invisible and nothing has to be repositioned in JS. That keeps the
whole thing on the compositor: no per-frame script, no layout, no repaint.

Two numbers have to be measured rather than assumed, which is the only reason there is
any JS here at all:

  1. How many copies. One copy narrower than the viewport leaves dead space at the
     right edge that never fills — the classic "marquee works on my laptop, breaks on
     an ultrawide" bug. `groups` is derived from the viewport / copy ratio instead.
  2. How long a cycle takes. A fixed duration means the strip speeds up every time a
     sponsor is added, since the same seconds cover more distance. `speed` is px/sec
     and the duration falls out of the measured width, so the pace is stable whether
     there are three logos or thirty.
*/

/** One entry in the strip. `logo` is a resolved URL — import the asset, don't path it. */
export interface Sponsor {
	name: string;
	logo: string;
}

/*
Past this the DOM cost stops being worth it. Only reachable with logos far narrower
than the viewport, where a seam would be well off to one side anyway.
*/
const MAX_GROUPS = 20;

export default defineComponent({
	components: {},
	mixins: [],
	props: {
		/** Rendered in order, then repeated. Order is the only ranking there is. */
		sponsors: {
			type: Array as PropType<Sponsor[]>,
			default(): Sponsor[] {
				return [];
			},
		},
		/**
		 * Scroll rate in CSS pixels per second. Constant regardless of how many logos are
		 * in the list — it sets the duration rather than being set by it.
		 */
		speed: {
			type: Number,
			default: 24,
		},
		/** Space between logos, and across the seam between copies. Any CSS length. */
		gap: {
			type: String,
			default: '6rem',
		},
		/** Logos are sized by height so mixed aspect ratios still sit on one line. */
		logoHeight: {
			type: String,
			default: '2rem',
		},
		/** Width of the fade at each end of the strip. Any CSS length or percentage. */
		fade: {
			type: String,
			default: '4rem',
		},
		/** Accessible name for the list. Only the first copy carries it. */
		label: {
			type: String,
			default: 'Sponsors',
		},
		/** Hold still when the user asks for reduced motion. */
		respectReducedMotion: {
			type: Boolean,
			default: true,
		},
		/** Stop the animation while scrolled out of view. */
		pauseWhenHidden: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			/** Measured width of one copy of the list, in px. 0 means "not measured yet". */
			copyWidth: 0,
			groups: 2,
			inView: true,
			reducedMotion: false,
			resizeObserver: null as ResizeObserver | null,
			intersectionObserver: null as IntersectionObserver | null,
			motionQuery: null as MediaQueryList | null,
		};
	},
	computed: {
		rootStyle(): StyleValue {
			return {
				'--sponsor-gap': this.gap,
				'--sponsor-logo-height': this.logoHeight,
				'--sponsor-fade': this.fade,
			};
		},
		trackStyle(): StyleValue {
			return {
				/*
				A transform percentage resolves against the element's own width, and the
				track is exactly `groups` copies wide, so this is one copy to the pixel
				however many copies there turn out to be.
				*/
				'--sponsor-shift': `${-100 / this.groups}%`,
				animationDuration: `${this.cycleSeconds}s`,
				animationPlayState: this.animating ? 'running' : 'paused',
			};
		},
		/** Seconds for one copy to pass. The fallback only ever applies while paused. */
		cycleSeconds(): number {
			if (this.copyWidth <= 0 || this.speed <= 0) return 1;
			return this.copyWidth / this.speed;
		},
		animating(): boolean {
			if (this.copyWidth <= 0) return false;
			if (this.reducedMotion && this.respectReducedMotion) return false;
			if (this.pauseWhenHidden && !this.inView) return false;
			return true;
		},
	},
	watch: {
		/* A changed list is a changed copy width, so both measured numbers are stale. */
		sponsors: 'scheduleMeasure',
		gap: 'scheduleMeasure',
		logoHeight: 'scheduleMeasure',
	},
	mounted() {
		this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.reducedMotion = this.motionQuery.matches;
		this.motionQuery.addEventListener('change', this.onMotionPreferenceChange);

		const viewport = this.$refs.viewport as HTMLElement | undefined;
		if (viewport) {
			this.resizeObserver = new ResizeObserver(this.measure);
			this.resizeObserver.observe(viewport);

			if (this.pauseWhenHidden) {
				this.intersectionObserver = new IntersectionObserver(this.onIntersect);
				this.intersectionObserver.observe(viewport);
			}
		}

		this.measure();
	},
	beforeUnmount() {
		if (this.resizeObserver) this.resizeObserver.disconnect();
		if (this.intersectionObserver) this.intersectionObserver.disconnect();
		if (this.motionQuery) {
			this.motionQuery.removeEventListener('change', this.onMotionPreferenceChange);
		}
	},
	methods: {
		/*
		Sizes the track to the viewport. Bails without touching either number when the box
		is unmeasurable — before layout, while display:none, or under jsdom, which reports
		every box as 0x0. Leaving copyWidth at 0 in that case is what keeps the animation
		paused rather than running at a nonsense speed.
		*/
		measure() {
			const viewport = this.$refs.viewport as HTMLElement | undefined;
			if (!viewport) return;
			/*
			Queried rather than collected with a v-for template ref: Vue does not guarantee
			that a ref array matches source order, and this specifically needs the first
			copy in document order.
			*/
			const group = viewport.querySelector<HTMLElement>('.sponsor-scroller__group');
			if (!group) return;

			const viewportWidth = viewport.getBoundingClientRect().width;
			const groupWidth = group.getBoundingClientRect().width;
			if (viewportWidth < 1 || groupWidth < 1) return;

			this.copyWidth = groupWidth;
			/*
			The track has to cover the viewport *plus* the copy it is about to shift away,
			or the tail end of the cycle shows empty space: groups >= viewport/copy + 1.
			*/
			const needed = Math.ceil(viewportWidth / groupWidth) + 1;
			this.groups = Math.min(MAX_GROUPS, Math.max(2, needed));
		},

		/* Re-measure after Vue has flushed the DOM change that made it necessary. */
		scheduleMeasure() {
			this.$nextTick(this.measure);
		},

		/*
		An <img> with no intrinsic size contributes nothing to its parent's width, so the
		first measurement runs against a zero-width copy and would lock in a wrong count
		and a wrong duration. Each logo re-measures as it lands; they are cheap reads and
		there are only ever a handful.
		*/
		onLogoLoad() {
			this.measure();
		},

		onIntersect(entries: IntersectionObserverEntry[]) {
			this.inView = entries[entries.length - 1].isIntersecting;
			/* Coming back into view is also the first moment a hidden strip is measurable. */
			if (this.inView && this.copyWidth <= 0) this.measure();
		},

		onMotionPreferenceChange(event: MediaQueryListEvent) {
			this.reducedMotion = event.matches;
		},
	},
});
</script>

<style scoped>
.sponsor-scroller {
	/* Credits, not controls: nothing here is clickable or selectable. */
	pointer-events: none;
	user-select: none;
}

.sponsor-scroller__viewport {
	overflow: hidden;
	/*
	Takes the strip to zero at both ends so logos arrive and leave instead of popping in
	at a hard edge. A mask covers the element's whole rendering, so the top and bottom
	rules fade out with it — which is the point of hanging them here rather than on the
	band. Sized in absolute units rather than a percentage so the fade stays the same
	width as the hero narrows.
	*/
	-webkit-mask-image: linear-gradient(
		to right,
		transparent 0,
		#000 var(--sponsor-fade),
		#000 calc(100% - var(--sponsor-fade)),
		transparent 100%
	);
	mask-image: linear-gradient(
		to right,
		transparent 0,
		#000 var(--sponsor-fade),
		#000 calc(100% - var(--sponsor-fade)),
		transparent 100%
	);
}

.sponsor-scroller__track {
	display: flex;
	/* Content width, so the copies never compress and the shift stays exact. */
	width: max-content;
	animation-name: sponsor-scroll;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	/* Duration and play state are bound from the component — see trackStyle. */
	will-change: transform;
}

.sponsor-scroller__group {
	display: flex;
	flex: none;
	align-items: center;
	gap: var(--sponsor-gap);
	/*
	The trailing gap is what makes the seam invisible: without it the last logo of one
	copy would butt straight up against the first logo of the next, and the join would
	be the one visibly tighter spacing in the strip.
	*/
	padding-inline-end: var(--sponsor-gap);
	margin: 0;
	padding-block: 1.25rem;
	list-style: none;
}

.sponsor-scroller__logo {
	display: block;
	height: var(--sponsor-logo-height);
	width: auto;
	/* Tailwind's preflight caps images at max-width:100%, which inside a max-content
	   track resolves against the wrong box and squashes wide logos. */
	max-width: none;
	object-fit: contain;
	/*
	Logos are supplied as light monochrome marks — they sit on the dark hero, and a
	strip of assorted brand colours pulls focus from the headline above it. This is the
	last few percent of that, not a substitute for the right asset.
	*/
	opacity: 0.75;
}

@keyframes sponsor-scroll {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(var(--sponsor-shift));
	}
}
</style>
