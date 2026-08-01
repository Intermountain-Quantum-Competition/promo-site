<template>
	<div ref="root" class="wave-field" :style="rootStyle" aria-hidden="true">
		<span ref="probe" class="wave-field__probe">{{ probeText }}</span>
		<div
			v-for="(band, i) in resolved.bands"
			:key="i"
			class="wave-field__layer"
			:style="bandStyle(band)"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw, type PropType, type StyleValue } from 'vue';

/*
An ASCII wave field: a grid of monospace glyphs whose density tracks the amplitude of
a superposed wave, coloured in bands from cool to warm. Interference of several radial
sources is the point — that's the double-slit picture, and it's what makes the pattern
read as something other than a screensaver.

Two things keep it cheap enough to sit behind every page:

  1. Nothing is per-cell in the DOM. Each colour band is one <div> holding one string
     with embedded newlines, so a frame is `bands.length` textContent writes — three by
     default — not `cols * rows` element updates. Colour comes from a static CSS
     gradient the text is clipped to, so it never repaints from JS at all.

  2. Nothing calls Math.sin in the frame loop. Source distance to each cell is fixed
     while the grid is, so `r * k` is precomputed into an integer index and time only
     subtracts an offset from it: `SIN[(phase[i] - tOff) & LUT_MASK]`. Rebuilding those
     grids is the expensive part, and it only happens on resize or a config change.

Everything visual is in DEFAULT_CONFIG below and overridable through the `config` prop;
the component is meant to be tuned by editing that object or passing a partial one.
*/

/* --- fixed tables ------------------------------------------------------------ */

/* Power of two so the phase wrap is a bitmask. 2048 steps is finer than the ~256
   intensity levels the ramp is quantised to, so the table is not the limiting factor. */
const LUT_SIZE = 2048;
const LUT_MASK = LUT_SIZE - 1;
const RAD_TO_LUT = LUT_SIZE / (Math.PI * 2);

const SIN = new Float32Array(LUT_SIZE);
for (let i = 0; i < LUT_SIZE; i++) {
	SIN[i] = Math.sin((i / LUT_SIZE) * Math.PI * 2);
}

/* Intensity is quantised to this many levels so the ramp index and band index for a
   cell are both table lookups rather than a pow() and a search. */
const LEVELS = 256;

/* Long enough that per-character rounding error in the measured advance stays well
   under a pixel across a full row. */
const PROBE_LEN = 120;

/* --- config ------------------------------------------------------------------ */

/** A radial wave source. Position is normalised to the field box: 0,0 is top-left. */
export interface WaveSource {
	x: number;
	y: number;
	/** Spatial frequency in radians per field width — higher packs the rings tighter. */
	k: number;
	/** Temporal frequency. Negative runs the rings inward. */
	omega: number;
	amp: number;
	/** Amplitude falls off as 1 / (1 + r * decay). 0 means the source never fades. */
	decay: number;
	phase: number;
	/** Rate of the slow amplitude breathing; scaled by the global `breathe` amount. */
	breatheRate: number;
}

/** A plane wave crossing the whole field. Gives the pattern a direction to travel in. */
export interface PlaneWave {
	k: number;
	omega: number;
	/** Radians, clockwise from the +x axis. */
	angle: number;
	/** Radians per second the angle drifts, so the pattern never quite repeats. */
	angleDrift: number;
	amp: number;
}

/** One colour band. Cells land in the highest band whose `from` they reach. */
export interface WaveBand {
	/** Normalised intensity, 0–1. The first band should be 0. */
	from: number;
	/** Any CSS <image>; the band's glyphs are clipped to it. */
	gradient: string;
	opacity: number;
}

export interface WaveFieldConfig {
	/** Glyphs from sparsest to densest. A leading space lets quiet cells go blank. */
	ramp: string;
	fontSize: number;
	lineHeight: number;
	letterSpacing: string;
	/** Frame cap. ASCII reads well slow, and this is the main cost dial. */
	fps: number;
	/** Multiplier on elapsed time — scales every omega at once. */
	speed: number;
	/** Scales amplitude before it is centred on 0.5. Above ~2 the field starts clipping. */
	contrast: number;
	/** Ramp curve. Above 1 biases toward the sparse end, thinning the field out. */
	gamma: number;
	/** Fraction of the width over which intensity fades out at each side. */
	edgeFadeX: number;
	/*
	The same vertically, but the two ends are set independently: a hero fades up into the
	page header over a much longer run than it fades down into whatever follows it.
	*/
	edgeFadeTop: number;
	edgeFadeBottom: number;
	/** CSS lengths for the matching opacity fade. Compounds with the intensity fade above. */
	maskFadeX: string;
	maskFadeTop: string;
	maskFadeBottom: string;
	/*
	Overall opacity — the dial for how far the field recedes. Dimming here rather than
	with an overlay element gets the same result against the page background, with no
	extra node and nothing to keep in sync with the backdrop colour.
	*/
	opacity: number;
	/** How far source amplitudes drift, 0–1. */
	breathe: number;
	sources: WaveSource[];
	plane: PlaneWave | null;
	bands: WaveBand[];
	/** Render a single static frame when the user asks for reduced motion. */
	respectReducedMotion: boolean;
	/** Stop the loop while scrolled out of view or on a hidden tab. */
	pauseWhenHidden: boolean;
}

/** What the `config` prop accepts: any subset, down to individual source fields. */
export type WaveFieldOptions = Partial<Omit<WaveFieldConfig, 'sources' | 'plane' | 'bands'>> & {
	sources?: Partial<WaveSource>[];
	plane?: Partial<PlaneWave> | null;
	bands?: Partial<WaveBand>[];
};

const DEFAULT_SOURCE: WaveSource = {
	x: 0.5,
	y: 0.5,
	k: 70,
	omega: 1.6,
	amp: 1,
	decay: 1.2,
	phase: 0,
	breatheRate: 0.2,
};

const DEFAULT_PLANE: PlaneWave = {
	k: 26,
	omega: 0.8,
	angle: 0.32,
	angleDrift: 0.03,
	amp: 0.55,
};

const DEFAULT_BAND: WaveBand = {
	from: 0,
	gradient: 'linear-gradient(105deg, var(--color-royal), var(--color-royal))',
	opacity: 1,
};

const DEFAULT_CONFIG: WaveFieldConfig = {
	ramp: ' .,:-=+*xX#%@',
	fontSize: 13,
	lineHeight: 0.95,
	letterSpacing: '0',
	fps: 20,
	speed: 1,
	contrast: 2.1,
	gamma: 1.15,
	edgeFadeX: 0.16,
	edgeFadeTop: 0.5,
	edgeFadeBottom: 0.22,
	maskFadeX: '10%',
	maskFadeTop: '40%',
	maskFadeBottom: '16%',
	opacity: 0.4,
	breathe: 0.25,
	sources: [
		{ x: 0.14, y: 0.28, k: 82, omega: 2, amp: 1, decay: 1.1, phase: 0, breatheRate: 0.17 },
		{
			x: 0.6,
			y: 0.86,
			k: 64,
			omega: -1.4,
			amp: 0.9,
			decay: 0.9,
			phase: 1.9,
			breatheRate: 0.23,
		},
		{
			x: 0.97,
			y: 0.12,
			k: 96,
			omega: 1.7,
			amp: 0.7,
			decay: 1.4,
			phase: 3.4,
			breatheRate: 0.31,
		},
	],
	plane: DEFAULT_PLANE,
	bands: [
		{
			from: 0,
			gradient:
				'linear-gradient(105deg, var(--color-navy-4), var(--color-navy-5) 60%, var(--color-royal))',
			opacity: 0.9,
		},
		{
			from: 0.57,
			gradient:
				'linear-gradient(105deg, var(--color-royal), color-mix(in oklab, var(--color-royal) 55%, var(--color-offwhite)) 55%, var(--color-royal))',
			opacity: 1,
		},
		{
			from: 0.79,
			gradient:
				'linear-gradient(105deg, var(--color-gold), var(--color-salmon) 45%, var(--color-gold) 80%, var(--color-offwhite))',
			opacity: 1,
		},
	],
	respectReducedMotion: true,
	pauseWhenHidden: true,
};

/* --- helpers ----------------------------------------------------------------- */

function smoothstep(t: number): number {
	if (t <= 0) return 0;
	if (t >= 1) return 1;
	return t * t * (3 - 2 * t);
}

/**
 * Falloff toward both ends of a normalised axis. `start` and `end` are the fractions of
 * the axis each end takes, so they can differ; 0 leaves that end unfaded.
 */
function edgeWeight(u: number, start: number, end: number): number {
	const head = start > 0 ? smoothstep(u / start) : 1;
	const tail = end > 0 ? smoothstep((1 - u) / end) : 1;
	return head * tail;
}

/*
apply() beats a per-code loop by a wide margin, but the argument list is a real stack
frame, so it has to be chunked. 8192 is comfortably under every engine's limit.
*/
function codesToString(buf: Uint16Array, len: number): string {
	const CHUNK = 8192;
	if (len <= CHUNK) {
		return String.fromCharCode.apply(null, buf.subarray(0, len) as unknown as number[]);
	}
	let out = '';
	for (let i = 0; i < len; i += CHUNK) {
		const end = i + CHUNK < len ? i + CHUNK : len;
		out += String.fromCharCode.apply(null, buf.subarray(i, end) as unknown as number[]);
	}
	return out;
}

/**
 * Per-frame render state. Deliberately kept out of Vue's reactivity — these are typed
 * arrays rewritten every frame, and proxying them would be pure overhead.
 */
interface RenderState {
	cols: number;
	rows: number;
	/** Field height in units of field width, so wave geometry ignores cell aspect. */
	aspect: number;
	/** Per source: LUT index of `r * k` at each cell, and the decayed amplitude there. */
	srcPhase: Int32Array[];
	srcWeight: Float32Array[];
	/** Edge intensity falloff, separable but flattened for a single indexed read. */
	edge: Float32Array;
	/** Plane-wave axis terms, rebuilt each frame because the angle drifts. */
	planeX: Int32Array;
	planeY: Int32Array;
	/** One glyph buffer per band, newlines already in place at the row ends. */
	buffers: Uint16Array[];
	layers: HTMLElement[];
	/** Char code per quantised intensity level, and which band owns that level. */
	levelChar: Uint16Array;
	levelBand: Uint8Array;
	rafId: number;
	lastFrameAt: number;
	elapsed: number;
	prevNow: number;
	visible: boolean;
	inView: boolean;
}

export default defineComponent({
	components: {},
	mixins: [],
	props: {
		/** Partial override of DEFAULT_CONFIG. See WaveFieldConfig for every knob. */
		config: {
			type: Object as PropType<WaveFieldOptions>,
			default(): WaveFieldOptions {
				return {};
			},
		},
	},
	data() {
		const state: RenderState = {
			cols: 0,
			rows: 0,
			aspect: 1,
			srcPhase: [],
			srcWeight: [],
			edge: new Float32Array(0),
			planeX: new Int32Array(0),
			planeY: new Int32Array(0),
			buffers: [],
			layers: [],
			levelChar: new Uint16Array(LEVELS),
			levelBand: new Uint8Array(LEVELS),
			rafId: 0,
			lastFrameAt: 0,
			elapsed: 0,
			prevNow: 0,
			visible: true,
			inView: true,
		};
		return {
			state: markRaw(state),
			reducedMotion: false,
			resizeObserver: null as ResizeObserver | null,
			intersectionObserver: null as IntersectionObserver | null,
			motionQuery: null as MediaQueryList | null,
		};
	},
	computed: {
		resolved(): WaveFieldConfig {
			const given = this.config || {};
			const sources = given.sources || DEFAULT_CONFIG.sources;
			const bands = given.bands || DEFAULT_CONFIG.bands;
			const plane =
				given.plane === null
					? null
					: { ...DEFAULT_PLANE, ...(given.plane || DEFAULT_CONFIG.plane || {}) };
			return {
				...DEFAULT_CONFIG,
				...given,
				sources: sources.map(function (source): WaveSource {
					return { ...DEFAULT_SOURCE, ...source };
				}),
				plane,
				bands: bands.map(function (band): WaveBand {
					return { ...DEFAULT_BAND, ...band };
				}),
			};
		},
		probeText(): string {
			return '0'.repeat(PROBE_LEN);
		},
		rootStyle(): StyleValue {
			const cfg = this.resolved;
			return {
				fontSize: `${cfg.fontSize}px`,
				lineHeight: String(cfg.lineHeight),
				letterSpacing: cfg.letterSpacing,
				opacity: String(cfg.opacity),
				'--wave-fade-x': cfg.maskFadeX,
				'--wave-fade-top': cfg.maskFadeTop,
				'--wave-fade-bottom': cfg.maskFadeBottom,
			};
		},
		/** ms between frames; 0 means uncapped. */
		frameInterval(): number {
			const fps = this.resolved.fps;
			return fps > 0 ? 1000 / fps : 0;
		},
	},
	watch: {
		/*
		Recomputes whenever the prop object changes identity. A full rebuild is the right
		response to any of it — band count, ramp and source geometry all feed the caches.
		*/
		resolved: 'reconfigure',
	},
	mounted() {
		this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.reducedMotion = this.motionQuery.matches;
		this.motionQuery.addEventListener('change', this.onMotionPreferenceChange);

		this.resizeObserver = new ResizeObserver(this.onResize);
		this.resizeObserver.observe(this.$refs.root as HTMLElement);

		if (this.resolved.pauseWhenHidden) {
			this.intersectionObserver = new IntersectionObserver(this.onIntersect);
			this.intersectionObserver.observe(this.$refs.root as HTMLElement);
			document.addEventListener('visibilitychange', this.onVisibilityChange);
		}

		this.reconfigure();

		/*
		The probe measures the fallback font until the real one lands, which would lock in
		the wrong column count. Re-measure once the webfont is in.
		*/
		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(this.onResize);
		}
	},
	beforeUnmount() {
		this.stop();
		if (this.resizeObserver) this.resizeObserver.disconnect();
		if (this.intersectionObserver) this.intersectionObserver.disconnect();
		if (this.motionQuery) {
			this.motionQuery.removeEventListener('change', this.onMotionPreferenceChange);
		}
		document.removeEventListener('visibilitychange', this.onVisibilityChange);
	},
	methods: {
		/** Rebuild every cache, then restart. Safe to call at any time. */
		reconfigure() {
			this.stop();
			this.buildLevelTables();
			/* The band <div>s are v-for'd off the config, so wait for them to exist. */
			this.$nextTick(this.rebuild);
		},

		rebuild() {
			this.cacheLayers();
			this.buildGrid();
			this.renderFrame();
			this.start();
		},

		cacheLayers() {
			const root = this.$refs.root as HTMLElement | undefined;
			if (!root) return;
			/*
			Queried from the DOM rather than collected with a template ref, because Vue does
			not guarantee that a v-for ref array matches source order — and here the array
			index *is* the band index.
			*/
			this.state.layers = Array.from(
				root.querySelectorAll<HTMLElement>('.wave-field__layer'),
			);
		},

		/*
		Collapses the ramp curve and the band thresholds into two 256-entry tables, so the
		inner loop does no pow() and no threshold search — just one indexed read each.
		*/
		buildLevelTables() {
			const cfg = this.resolved;
			const ramp = cfg.ramp.length > 0 ? cfg.ramp : ' ';
			const levelChar = new Uint16Array(LEVELS);
			const levelBand = new Uint8Array(LEVELS);

			for (let level = 0; level < LEVELS; level++) {
				const n = level / (LEVELS - 1);
				let index = Math.floor(Math.pow(n, cfg.gamma) * ramp.length);
				if (index < 0) index = 0;
				if (index > ramp.length - 1) index = ramp.length - 1;
				levelChar[level] = ramp.charCodeAt(index);

				let band = 0;
				for (let b = 0; b < cfg.bands.length; b++) {
					if (n >= cfg.bands[b].from) band = b;
				}
				levelBand[level] = band;
			}

			this.state.levelChar = levelChar;
			this.state.levelBand = levelBand;
		},

		/*
		Sizes the grid to the box and precomputes everything that only depends on geometry:
		per-source distance phase and decayed weight, and the edge falloff.
		*/
		buildGrid() {
			const root = this.$refs.root as HTMLElement | undefined;
			const probe = this.$refs.probe as HTMLElement | undefined;
			if (!root || !probe) return;

			const box = root.getBoundingClientRect();
			const probeBox = probe.getBoundingClientRect();
			const cellW = probeBox.width / PROBE_LEN;
			const cellH = probeBox.height;
			/* Zero-sized while hidden or before layout; nothing meaningful to build yet. */
			if (box.width < 1 || box.height < 1 || cellW < 0.5 || cellH < 0.5) return;

			const cols = Math.max(2, Math.ceil(box.width / cellW) + 1);
			const rows = Math.max(2, Math.ceil(box.height / cellH) + 1);
			const cfg = this.resolved;
			const state = this.state;
			const cells = cols * rows;

			/* Field spans 0–1 in x and 0–aspect in y, so rings come out round. */
			const aspect = (rows * cellH) / (cols * cellW);
			state.cols = cols;
			state.rows = rows;
			state.aspect = aspect;

			const srcPhase: Int32Array[] = [];
			const srcWeight: Float32Array[] = [];
			for (const source of cfg.sources) {
				const phase = new Int32Array(cells);
				const weight = new Float32Array(cells);
				const sx = source.x;
				const sy = source.y * aspect;
				for (let y = 0; y < rows; y++) {
					const uy = ((y + 0.5) / rows) * aspect;
					const rowBase = y * cols;
					for (let x = 0; x < cols; x++) {
						const ux = (x + 0.5) / cols;
						const dx = ux - sx;
						const dy = uy - sy;
						const r = Math.sqrt(dx * dx + dy * dy);
						phase[rowBase + x] = Math.round(r * source.k * RAD_TO_LUT);
						weight[rowBase + x] = source.amp / (1 + r * source.decay);
					}
				}
				srcPhase.push(phase);
				srcWeight.push(weight);
			}
			state.srcPhase = srcPhase;
			state.srcWeight = srcWeight;

			const edge = new Float32Array(cells);
			const edgeX = new Float32Array(cols);
			const edgeY = new Float32Array(rows);
			for (let x = 0; x < cols; x++) {
				edgeX[x] = edgeWeight((x + 0.5) / cols, cfg.edgeFadeX, cfg.edgeFadeX);
			}
			for (let y = 0; y < rows; y++) {
				edgeY[y] = edgeWeight((y + 0.5) / rows, cfg.edgeFadeTop, cfg.edgeFadeBottom);
			}
			for (let y = 0; y < rows; y++) {
				const rowBase = y * cols;
				for (let x = 0; x < cols; x++) {
					edge[rowBase + x] = edgeX[x] * edgeY[y];
				}
			}
			state.edge = edge;

			state.planeX = new Int32Array(cols);
			state.planeY = new Int32Array(rows);

			/*
			Each buffer holds the whole layer including row breaks, so a frame ends in one
			textContent write per band. The newlines are written once here and never touched
			again — the render loop only ever writes columns 0..cols-1.
			*/
			const stride = cols + 1;
			const buffers: Uint16Array[] = [];
			for (let b = 0; b < cfg.bands.length; b++) {
				const buf = new Uint16Array(stride * rows);
				for (let y = 0; y < rows; y++) {
					buf[y * stride + cols] = 10;
				}
				buffers.push(buf);
			}
			state.buffers = buffers;
		},

		/** Evaluate the field at `elapsed` seconds and push the glyphs to the DOM. */
		renderFrame() {
			const state = this.state;
			const cfg = this.resolved;
			const cols = state.cols;
			const rows = state.rows;
			if (cols === 0 || rows === 0) return;
			if (state.layers.length !== cfg.bands.length) return;
			if (state.buffers.length !== cfg.bands.length) return;

			const time = state.elapsed;
			const sourceCount = cfg.sources.length;
			const srcPhase = state.srcPhase;
			const srcWeight = state.srcWeight;

			/* Per-source, per-frame scalars: the travelling phase and the breathing gain. */
			const timeOffset = new Int32Array(sourceCount);
			const gain = new Float32Array(sourceCount);
			let totalAmp = 0;
			for (let s = 0; s < sourceCount; s++) {
				const source = cfg.sources[s];
				timeOffset[s] = Math.round((source.omega * time - source.phase) * RAD_TO_LUT);
				gain[s] = 1 + cfg.breathe * Math.sin(time * source.breatheRate + source.phase);
				totalAmp += Math.abs(source.amp);
			}

			const plane = cfg.plane;
			const planeX = state.planeX;
			const planeY = state.planeY;
			let planeOffset = 0;
			let planeAmp = 0;
			if (plane && plane.amp !== 0) {
				const angle = plane.angle + plane.angleDrift * time;
				const kx = Math.cos(angle) * plane.k * RAD_TO_LUT;
				const ky = Math.sin(angle) * plane.k * RAD_TO_LUT;
				for (let x = 0; x < cols; x++) {
					planeX[x] = Math.round(((x + 0.5) / cols) * kx);
				}
				for (let y = 0; y < rows; y++) {
					planeY[y] = Math.round(((y + 0.5) / rows) * state.aspect * ky);
				}
				planeOffset = Math.round(plane.omega * time * RAD_TO_LUT);
				planeAmp = plane.amp;
				totalAmp += Math.abs(plane.amp);
			}

			/* Amplitude is normalised globally, so decay still reads as spatial dimming. */
			const scale = totalAmp > 0 ? (0.5 * cfg.contrast) / totalAmp : 0;
			const edge = state.edge;
			const levelChar = state.levelChar;
			const levelBand = state.levelBand;
			const buffers = state.buffers;
			const bandCount = cfg.bands.length;
			const stride = cols + 1;

			for (let y = 0; y < rows; y++) {
				const rowBase = y * cols;
				const outBase = y * stride;
				const py = planeAmp !== 0 ? planeY[y] : 0;
				for (let x = 0; x < cols; x++) {
					const i = rowBase + x;
					let v = 0;
					for (let s = 0; s < sourceCount; s++) {
						v +=
							srcWeight[s][i] *
							gain[s] *
							SIN[(srcPhase[s][i] - timeOffset[s]) & LUT_MASK];
					}
					if (planeAmp !== 0) {
						v += planeAmp * SIN[(planeX[x] + py - planeOffset) & LUT_MASK];
					}

					let n = (0.5 + v * scale) * edge[i];
					if (n < 0) n = 0;
					else if (n > 1) n = 1;

					const level = (n * (LEVELS - 1)) | 0;
					const owner = levelBand[level];
					const code = levelChar[level];
					const out = outBase + x;
					/* Every band is written every cell — one owns the glyph, the rest get a
					   space — so the buffers never need clearing between frames. */
					for (let b = 0; b < bandCount; b++) {
						buffers[b][out] = b === owner ? code : 32;
					}
				}
			}

			const length = stride * rows - 1;
			for (let b = 0; b < bandCount; b++) {
				state.layers[b].textContent = codesToString(buffers[b], length);
			}
		},

		start() {
			const state = this.state;
			if (state.rafId !== 0) return;
			if (this.reducedMotion && this.resolved.respectReducedMotion) return;
			if (this.resolved.pauseWhenHidden && (!state.visible || !state.inView)) return;
			state.prevNow = 0;
			state.lastFrameAt = 0;
			state.rafId = requestAnimationFrame(this.tick);
		},

		stop() {
			if (this.state.rafId !== 0) {
				cancelAnimationFrame(this.state.rafId);
				this.state.rafId = 0;
			}
		},

		tick(now: number) {
			const state = this.state;
			state.rafId = requestAnimationFrame(this.tick);

			/*
			Elapsed time is accumulated from deltas rather than read off the clock, so a
			pause (offscreen, hidden tab) resumes where it left off instead of jumping.
			*/
			if (state.prevNow === 0) state.prevNow = now;
			let delta = (now - state.prevNow) / 1000;
			state.prevNow = now;
			/* A backgrounded tab can hand back a huge first delta; clamp it. */
			if (delta > 0.25) delta = 0.25;
			state.elapsed += delta * this.resolved.speed;

			const interval = this.frameInterval;
			if (interval > 0 && now - state.lastFrameAt < interval) return;
			state.lastFrameAt = now;

			this.renderFrame();
		},

		onResize() {
			this.buildGrid();
			this.renderFrame();
		},

		onIntersect(entries: IntersectionObserverEntry[]) {
			this.state.inView = entries[entries.length - 1].isIntersecting;
			/* The observers are wired up once at mount, so honour a later config change
			   here rather than assuming pauseWhenHidden is still set. */
			if (this.state.inView || !this.resolved.pauseWhenHidden) this.start();
			else this.stop();
		},

		onVisibilityChange() {
			this.state.visible = document.visibilityState !== 'hidden';
			if (this.state.visible || !this.resolved.pauseWhenHidden) this.start();
			else this.stop();
		},

		onMotionPreferenceChange(event: MediaQueryListEvent) {
			this.reducedMotion = event.matches;
			if (this.reducedMotion && this.resolved.respectReducedMotion) {
				this.stop();
				this.renderFrame();
			} else {
				this.start();
			}
		},

		bandStyle(band: WaveBand): StyleValue {
			return {
				backgroundImage: band.gradient,
				opacity: String(band.opacity),
			};
		},
	},
});
</script>

<style scoped>
.wave-field {
	/*
	Deliberately sets no `position`. Scoped styles are unlayered, and an unlayered rule
	beats every layered one regardless of specificity — so a `position: relative` here
	silently outranks a Tailwind `absolute` at the call site. (Same trap CLAUDE.md
	records for style.css; it is why this first shipped taking up flow space and pushing
	the page header down instead of sitting behind it.) `contain: layout` below already
	makes this element the containing block the layers need, so positioning is left
	entirely to the caller. The two are load bearing together — don't drop the
	containment without putting a position back.
	*/
	overflow: hidden;
	font-family: var(--font-mono);
	font-weight: 400;
	/* Plex Mono ligates; a ramp glyph pairing up would break the column grid. */
	font-variant-ligatures: none;
	font-kerning: none;
	user-select: none;
	pointer-events: none;
	/* Keeps the per-frame repaint from invalidating the rest of the page, and the
	   `layout` part is what makes this a containing block for the absolutely positioned
	   layers — see the note above. Deliberately not `strict`: that adds size
	   containment, and the grid is measured from this element's own box, which size
	   containment would zero out. */
	contain: layout paint style;

	/*
	Opacity fade on all four edges, on top of the intensity falloff the renderer already
	applies. The two do different jobs: the intensity fade thins the glyphs out so the
	boundary reads as part of the pattern, this one takes the remainder to zero.
	*/
	-webkit-mask-image:
		linear-gradient(
			to right,
			transparent 0,
			#000 var(--wave-fade-x),
			#000 calc(100% - var(--wave-fade-x)),
			transparent 100%
		),
		linear-gradient(
			to bottom,
			transparent 0,
			#000 var(--wave-fade-top),
			#000 calc(100% - var(--wave-fade-bottom)),
			transparent 100%
		);
	mask-image:
		linear-gradient(
			to right,
			transparent 0,
			#000 var(--wave-fade-x),
			#000 calc(100% - var(--wave-fade-x)),
			transparent 100%
		),
		linear-gradient(
			to bottom,
			transparent 0,
			#000 var(--wave-fade-top),
			#000 calc(100% - var(--wave-fade-bottom)),
			transparent 100%
		);
	/* Legacy keyword first, for WebKit older than the standard property. Both mean
	   "intersect"; without one of them the two masks union and barely fade at all. */
	-webkit-mask-composite: source-in;
	mask-composite: intersect;
}

.wave-field__layer {
	position: absolute;
	inset: 0;
	white-space: pre;
	/* The glyphs are a window onto the band's gradient; the text itself has no colour. */
	color: transparent;
	-webkit-background-clip: text;
	background-clip: text;
	background-repeat: no-repeat;
}

/* Measures the real advance width and line box of the loaded font. Hidden, not removed —
   display:none would have no box to measure. */
.wave-field__probe {
	position: absolute;
	top: 0;
	left: 0;
	white-space: pre;
	visibility: hidden;
	pointer-events: none;
}
</style>
