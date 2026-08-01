import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import WaveField, { type WaveFieldConfig, type WaveFieldOptions } from './WaveField.vue';

/*
WaveField measures itself to decide how many rows and columns to draw, and jsdom reports
every box as 0x0 — so without a stubbed getBoundingClientRect the component correctly
draws nothing and every assertion here would pass vacuously. `mountField` supplies the
measurements; the constants below are what the grid size is derived from.

The animation clock is stubbed too, so frames advance only when a test says so. That
keeps these deterministic and lets the time-dependent behaviour actually be asserted
rather than waited on.
*/

const CELL_WIDTH = 8;
const LINE_HEIGHT = 12;
const BOX_WIDTH = 240;
const BOX_HEIGHT = 180;

/* Mirrors the component's own sizing: one extra row/col so the grid overfills the box. */
const EXPECTED_COLS = Math.ceil(BOX_WIDTH / CELL_WIDTH) + 1;
const EXPECTED_ROWS = Math.ceil(BOX_HEIGHT / LINE_HEIGHT) + 1;

function rect(width: number, height: number): DOMRect {
	return {
		width,
		height,
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		x: 0,
		y: 0,
		toJSON() {
			return {};
		},
	};
}

let frames: Array<{ id: number; callback: FrameRequestCallback }> = [];
let nextFrameId = 1;
let cancelled: number[] = [];
let intersectionCallback: IntersectionObserverCallback | null = null;
let disconnects = 0;

/** Runs every queued animation frame at `time` ms, as the browser would. */
function advance(time: number) {
	const pending = frames;
	frames = [];
	for (const frame of pending) frame.callback(time);
}

function stubMatchMedia(reducedMotion: boolean) {
	vi.stubGlobal('matchMedia', function (query: string) {
		return {
			matches: reducedMotion,
			media: query,
			onchange: null,
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
			dispatchEvent() {
				return false;
			},
		};
	});
}

async function mountField(config: WaveFieldOptions = {}) {
	vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
		this: Element,
	) {
		/* The probe is a fixed run of characters; its width is what sets the cell advance. */
		if (this.classList.contains('wave-field__probe')) {
			return rect((this.textContent ?? '').length * CELL_WIDTH, LINE_HEIGHT);
		}
		return rect(BOX_WIDTH, BOX_HEIGHT);
	});

	const wrapper = mount(WaveField, { props: { config } });
	/* The layers are built in a $nextTick callback, so nothing is drawn until it flushes. */
	await flushPromises();
	return wrapper;
}

/** Raw layer text, newlines and all — `.text()` would trim the padding that matters here. */
function layerGrids(wrapper: VueWrapper): string[] {
	return wrapper.findAll('.wave-field__layer').map(function (layer) {
		return layer.element.textContent ?? '';
	});
}

function countGlyphs(grid: string): number {
	let count = 0;
	for (const char of grid) {
		if (char !== ' ' && char !== '\n') count++;
	}
	return count;
}

beforeEach(function () {
	frames = [];
	nextFrameId = 1;
	cancelled = [];
	intersectionCallback = null;
	disconnects = 0;

	stubMatchMedia(false);

	vi.stubGlobal('requestAnimationFrame', function (callback: FrameRequestCallback) {
		const id = nextFrameId++;
		frames.push({ id, callback });
		return id;
	});
	vi.stubGlobal('cancelAnimationFrame', function (id: number) {
		cancelled.push(id);
		frames = frames.filter(function (frame) {
			return frame.id !== id;
		});
	});

	vi.stubGlobal(
		'ResizeObserver',
		class {
			observe() {}
			unobserve() {}
			disconnect() {
				disconnects++;
			}
		},
	);
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(callback: IntersectionObserverCallback) {
				intersectionCallback = callback;
			}
			observe() {}
			unobserve() {}
			disconnect() {
				disconnects++;
			}
			takeRecords() {
				return [];
			}
		},
	);
});

afterEach(function () {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('WaveField rendering', function () {
	it('draws one layer per configured colour band', async function () {
		const wrapper = await mountField({
			bands: [
				{ from: 0, gradient: 'linear-gradient(red, red)' },
				{ from: 0.6 },
				{ from: 0.9 },
			],
		});

		const layers = wrapper.findAll('.wave-field__layer');
		expect(layers).toHaveLength(3);
		expect(layers[0].attributes('style')).toContain('linear-gradient(red, red)');
	});

	it('fills every layer with a grid matching the measured box', async function () {
		const wrapper = await mountField();

		const grids = layerGrids(wrapper);
		expect(grids.length).toBeGreaterThan(0);
		for (const grid of grids) {
			const lines = grid.split('\n');
			expect(lines).toHaveLength(EXPECTED_ROWS);
			for (const line of lines) {
				expect(line).toHaveLength(EXPECTED_COLS);
			}
		}
	});

	it('draws only glyphs from the configured ramp', async function () {
		const ramp = ' .:-=+#@';
		const wrapper = await mountField({ ramp });

		const allowed = new Set([...ramp, '\n']);
		for (const grid of layerGrids(wrapper)) {
			for (const char of grid) {
				expect(allowed.has(char)).toBe(true);
			}
		}
	});

	/*
	The bands are stacked and overlapping, so a cell showing through two of them at once
	would render one glyph on top of another. Exactly one band owns each cell.
	*/
	it('never draws the same cell in more than one band', async function () {
		const wrapper = await mountField();

		const grids = layerGrids(wrapper);
		for (let i = 0; i < grids[0].length; i++) {
			const drawn = grids.filter(function (grid) {
				return grid[i] !== ' ' && grid[i] !== '\n';
			});
			expect(drawn.length).toBeLessThanOrEqual(1);
		}
	});
});

describe('WaveField edge fading', function () {
	it('fades the top over a longer run than the bottom', async function () {
		const wrapper = await mountField({
			edgeFadeTop: 0.6,
			edgeFadeBottom: 0.02,
			edgeFadeX: 0,
			plane: null,
		});

		const rows = layerGrids(wrapper)
			.map(function (grid) {
				return grid.split('\n');
			})
			.reduce(function (merged, lines) {
				return merged.map(function (line, i) {
					return line + lines[i];
				});
			});

		const sample = Math.floor(EXPECTED_ROWS / 5);
		const top = rows.slice(0, sample).join('');
		const bottom = rows.slice(-sample).join('');

		/* The very first row sits deep inside the fade and should be fully clear. */
		expect(countGlyphs(rows[0])).toBe(0);
		expect(countGlyphs(top)).toBeLessThan(countGlyphs(bottom));
	});

	it('leaves both ends unfaded when the fades are zero', async function () {
		const wrapper = await mountField({
			edgeFadeTop: 0,
			edgeFadeBottom: 0,
			edgeFadeX: 0,
		});

		const rows = layerGrids(wrapper)
			.map(function (grid) {
				return grid.split('\n');
			})
			.reduce(function (merged, lines) {
				return merged.map(function (line, i) {
					return line + lines[i];
				});
			});

		expect(countGlyphs(rows[0])).toBeGreaterThan(0);
		expect(countGlyphs(rows[rows.length - 1])).toBeGreaterThan(0);
	});
});

describe('WaveField config merging', function () {
	function resolvedOf(wrapper: VueWrapper): WaveFieldConfig {
		return (wrapper.vm as unknown as { resolved: WaveFieldConfig }).resolved;
	}

	it('fills a partially specified source from the source defaults', async function () {
		const wrapper = await mountField({ sources: [{ x: 0.25 }] });

		const sources = resolvedOf(wrapper).sources;
		expect(sources).toHaveLength(1);
		expect(sources[0].x).toBe(0.25);
		/* Untouched fields still come from DEFAULT_SOURCE rather than being undefined. */
		expect(sources[0].k).toBeGreaterThan(0);
		expect(sources[0].amp).toBeGreaterThan(0);
	});

	it('keeps defaults for keys the caller did not set', async function () {
		const wrapper = await mountField({ contrast: 3 });

		const resolved = resolvedOf(wrapper);
		expect(resolved.contrast).toBe(3);
		expect(resolved.ramp.length).toBeGreaterThan(1);
		expect(resolved.bands.length).toBeGreaterThan(0);
	});

	it('honours an explicitly disabled plane wave', async function () {
		const wrapper = await mountField({ plane: null });

		expect(resolvedOf(wrapper).plane).toBeNull();
	});
});

describe('WaveField animation lifecycle', function () {
	it('redraws as time advances', async function () {
		const wrapper = await mountField();
		const before = layerGrids(wrapper).join('');

		/* The first frame only establishes the time base, so it takes two to see motion. */
		advance(100);
		advance(1100);

		expect(layerGrids(wrapper).join('')).not.toBe(before);
	});

	it('draws a static frame and starts no loop under prefers-reduced-motion', async function () {
		stubMatchMedia(true);
		const wrapper = await mountField();

		expect(frames).toHaveLength(0);
		expect(countGlyphs(layerGrids(wrapper).join(''))).toBeGreaterThan(0);
	});

	it('stops the loop when scrolled out of view', async function () {
		await mountField();
		expect(frames.length).toBeGreaterThan(0);

		intersectionCallback?.(
			[{ isIntersecting: false } as IntersectionObserverEntry],
			{} as IntersectionObserver,
		);

		expect(cancelled.length).toBeGreaterThan(0);
		expect(frames).toHaveLength(0);
	});

	it('resumes when scrolled back into view', async function () {
		await mountField();

		intersectionCallback?.(
			[{ isIntersecting: false } as IntersectionObserverEntry],
			{} as IntersectionObserver,
		);
		intersectionCallback?.(
			[{ isIntersecting: true } as IntersectionObserverEntry],
			{} as IntersectionObserver,
		);

		expect(frames.length).toBeGreaterThan(0);
	});

	it('cancels the loop and disconnects its observers on unmount', async function () {
		const wrapper = await mountField();

		wrapper.unmount();

		expect(cancelled.length).toBeGreaterThan(0);
		/* Both the resize and intersection observers. */
		expect(disconnects).toBe(2);
	});
});
