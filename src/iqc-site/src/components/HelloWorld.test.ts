import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HelloWorld from './HelloWorld.vue';

// Tests live next to the code they cover. This one exists mainly to keep the harness
// honest -- it will go when HelloWorld does, and that's fine.
describe('HelloWorld', () => {
	it('renders the IQC landing-page content', () => {
		const wrapper = mount(HelloWorld);

		expect(wrapper.text()).toContain('Intermountain Quantum Competition');
		expect(wrapper.text()).not.toContain('Get started');
	});
});
