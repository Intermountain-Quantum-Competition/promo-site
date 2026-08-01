import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import HeroSection from './HeroSection.vue';
import WaveField from './WaveField.vue';

/*
shallowMount stubs WaveField out, which is what we want here: HeroSection's job is to size
itself, position the backdrop and place the slot above it. How the field draws is
WaveField's own test's problem, and mounting it for real would drag in the whole
measurement and animation harness for nothing.
*/

describe('HeroSection', function () {
	it('renders slot content', function () {
		const wrapper = shallowMount(HeroSection, {
			slots: { default: '<p class="hero-copy">Quantum on the frontier.</p>' },
		});

		expect(wrapper.find('.hero-copy').text()).toBe('Quantum on the frontier.');
	});

	/*
	The point of the component: the hero is taller than whatever is inside it, so the
	animation gets room rather than shrink-wrapping to the page header.
	*/
	it('takes its height from minHeight, not from its content', function () {
		const wrapper = shallowMount(HeroSection, {
			props: { minHeight: '40rem' },
			slots: { default: '<p>short</p>' },
		});

		expect(wrapper.find('section').attributes('style')).toContain('min-height: 40rem');
	});

	it('offsets the backdrop from the top by backdropTop', function () {
		const wrapper = shallowMount(HeroSection, {
			props: { backdropTop: '7rem' },
		});

		const field = wrapper.findComponent(WaveField);
		expect(field.attributes('style')).toContain('top: 7rem');
		/* Pinned to the other three edges, so the offset is the only thing moving. */
		expect(field.classes()).toContain('bottom-0');
		expect(field.classes()).toContain('inset-x-0');
	});

	it('forwards its config through to the wave field', function () {
		const wrapper = shallowMount(HeroSection, {
			props: { config: { opacity: 0.2, fps: 12 } },
		});

		expect(wrapper.findComponent(WaveField).props('config')).toEqual({
			opacity: 0.2,
			fps: 12,
		});
	});

	it('defaults to a backdrop that is offset and a section that has a height', function () {
		const wrapper = shallowMount(HeroSection);

		expect(wrapper.find('section').attributes('style')).toMatch(/min-height:\s*\S+/);
		expect(wrapper.findComponent(WaveField).attributes('style')).toMatch(/top:\s*\S+/);
	});
});
