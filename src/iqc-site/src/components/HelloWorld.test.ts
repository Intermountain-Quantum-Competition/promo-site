import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HelloWorld from './HelloWorld.vue';

// Basic smoke test to ensure the landing-page content renders.
// Expand/replace with more specific assertions as the home page evolves.
describe('HelloWorld', () => {
	it('renders the IQC landing-page content', () => {
		const wrapper = mount(HelloWorld);

		expect(wrapper.text()).toContain('Intermountain Quantum Competition');
		expect(wrapper.text()).not.toContain('Get started');
	});
});
