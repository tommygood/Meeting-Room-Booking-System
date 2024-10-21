import { test, describe, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

import App from '@/components/preview.vue';

function convertHourFormat(hour) {
    const h = parseInt(hour);
    if (h > 12) {
        return h - 12;
    }
    else {
        return h;
    }
}

function checkTriggeredEvent(triggered_event, expected_event) {
    expect(triggered_event.today).toBe(expected_event.today);
    expect(triggered_event.now).toBe(expected_event.now);
    expect(triggered_event.next).toBe(expected_event.next);
}

function eventMaker(name, start_time, end_time) {
    return { 
        chinesename:"test",
        ext : "0912345678",
        identifier : "113423005",
        name : name,
        reserve_id : 207,
        room_name : "會議室1",
        show : 1,
        start_time : start_time,
        end_time : end_time,
        unit : null,
    }
}

describe('Test if Preview Component can correctly demonstrate the events in different situations.', async () => {
    // make stub object for slide
    const mock_slides = [ document.createElement('div'), document.createElement('div'), document.createElement('div') ];
    mock_slides[0].setAttribute('class', 'event-list');
    mock_slides[0].innerHTML = "today";
    mock_slides[1].setAttribute('class', 'event-list-now');
    mock_slides[1].innerHTML = "now";
    mock_slides[2].setAttribute('class', 'event-list-next');
    mock_slides[2].innerHTML = "next";

    const wrapper = mount(App, {
        attachTo: document.body,
        props: {
            mock_swiper: {
                update: vi.fn(),
            },
            mock_slides: mock_slides,
        }
    })

    test('Show the "no conference in today" when there is no reservation since now.', () => {
        const events = [];
        const triggered_event = wrapper.vm.reservationStausCheck(events); // 
        const text = wrapper.text();
        expect(text).toBe('- TODAY -今日無會議');
        checkTriggeredEvent(triggered_event, { today: false, now: false, next: false });
    });

    test('Show a event is in progress.', () => {
        // set start time to current time with format "YYYY-MM-DD HH:00:00"
        let now = new Date();
        let start_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        // set end time to an hour later
        now.setHours(now.getHours() + 1);
        let end_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        const events = [
            eventMaker("測試預約1", start_time, end_time)
        ];
        const triggered_event = wrapper.vm.reservationStausCheck(events); // 
        const text = wrapper.text();
        checkTriggeredEvent(triggered_event, { today: true, now: true, next: false});
    });

    test('Show a event is in the future.', () => {
        // set start time to an hour later
        let now = new Date();
        now.setHours(now.getHours() + 1);
        let start_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        // set end time to two hours later
        now.setHours(now.getHours() + 2);
        let end_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        const events = [
            eventMaker("測試預約1", start_time, end_time)
        ];
        const triggered_event = wrapper.vm.reservationStausCheck(events); // 
        const text = wrapper.text();
        checkTriggeredEvent(triggered_event, { today: true, now: false, next: true });
    });

    /*
    test('Show a future event and a event in progress.', () => {
        // set start time to an hour later
        let now = new Date();
        const now_start_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        now.setHours(now.getHours() + 1);
        const now_end_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:30:00`;
        const future_start_time = now_end_time;
        // set end time to two hours later
        now.setHours(now.getHours() + 2);
        const future_end_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        const events = [
            eventMaker("測試預約1", now_start_time, now_end_time), 
            eventMaker("測試預約2", future_start_time, future_end_time)
        ];
        const triggered_event = wrapper.vm.reservationStausCheck(events); // 
        const text = wrapper.text();
        // check if each column in events has been rendered
        for (let i = 0; i < events.length; i++) {
            expect(text).toContain(events[i].name);
            expect(text).toContain(convertHourFormat(events[i].start_time.slice(11, 16)));
            expect(text).toContain(convertHourFormat(events[i].end_time.slice(11, 16)));
        }
        // check if each column in events has been rendered
        checkTriggeredEvent(triggered_event, { today: true, now: true, next: true });
    });
    */

    test('Should ignore the event that is not in today.', () => {
        // set start time to yesterday
        let now = new Date();
        now.setDate(now.getDate() - 1);
        const start_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        // set end time to an hour later
        now.setHours(now.getHours() + 1);
        const end_time = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 13)}:00:00`;
        const events = [
            eventMaker("測試預約1", start_time, end_time),
        ];
        const triggered_event = wrapper.vm.reservationStausCheck(events); // 
        const text = wrapper.text();
        checkTriggeredEvent(triggered_event, { today: false, now: false, next: false });
    });
});