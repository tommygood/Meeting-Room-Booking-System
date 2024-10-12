import { test, describe, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import App from '@/components/welcome.vue';

describe('App.vue', () => {
  const wrapper = mount(App);

  test('歡迎內容是否正確', () => {
    const text = wrapper.find('h1').text();
    expect(text).toBe('行政大樓 二樓會議室借用系統');
  });
});
