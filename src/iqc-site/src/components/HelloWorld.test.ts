import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HelloWorld from './HelloWorld.vue';

// Tests live next to the code they cover. This one exists mainly to keep the harness
// honest -- it will go when HelloWorld does, and that's fine.
describe('HelloWorld', () => {
	it('increments the counter when the button is clicked', async () => {
		const wrapper = mount(HelloWorld);
		const button = wrapper.get('button');

		expect(button.text()).toBe('Count is 0');

		await button.trigger('click');

		expect(button.text()).toBe('Count is 1');
	});
});
