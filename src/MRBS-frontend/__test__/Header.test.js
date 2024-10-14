import { test, describe, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import App from '@/components/header.vue';

describe('Header test', () => {
    const username = 'test';
    const wrapper = mount(App, {
        props: {
            username: username,
        }
    })

  test('Have username been placed.', () => {
    const text = wrapper.find('#accountName').text();
    expect(text).toContain(username);
  });
});
