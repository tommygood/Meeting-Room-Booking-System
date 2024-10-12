import { test, describe, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

import App from '@/components/rootMenu.vue';

describe('Root Menu', async () => {
    function setPageName(val) {
        expect(val).toBe('會議管理'); // expect page name to be '會議管理'
    };

    const wrapper = mount(App, {
        props: {
            setPageName: setPageName,
        },
        attachTo: document.body,
    })

    test('Have set current page with specify color.', () => {
        vi.stubGlobal('location', { pathname: '/conference' }); // stub location.pathname
        wrapper.vm.setCurrentPageColor(); // call setCurrentPageColor method to set related page color
        const text = wrapper.text();
        expect(text).toBe('權限管理會議管理看板管理使用規則器材規則登入紀錄');
        
    });
});
