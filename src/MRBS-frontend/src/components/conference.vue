<template>
    <user_header :set-info="setInfo" :info="info"></user_header>
    <div class="test">
        <root_menu :setPageName="setPageName"></root_menu>
        <calendar :info="info" :eventClick="eventClick" ref="calendar_ref" :setApplicationShow="setApplicationShow"></calendar>
        <application :info="info" :show="application_show" :remove_application_when_back="remove_application_when_back" :setApplicationShow="setApplicationShow"></application>
    </div>
</template>
<script>
import root_menu from '@/components/rootMenu.vue';
import user_header from '@/components/header.vue';
import calendar from '@/components/calendar.vue';
import application from './application.vue';
import config from '@/config';

export default {
    name: 'conference',
    components: {
        root_menu,
        user_header,
        calendar,
        application,
    },
    data() {
        return {
            info: {},
            application_show: false,
            remove_application_when_back: true,
        }
    },
    methods: {
        setPageName(val) {
            this.page_name = val;
        },
        setApplicationShow(val) {
            this.application_show = val;
        },
        eventClick(click_event) {
            const date = new Date(click_event.event.start).toLocaleDateString([], { month: '2-digit', day: '2-digit', weekday: 'short' });
            const event = click_event.event.extendedProps;
            const reserve_id = click_event.event._def.publicId;
            const title = click_event.event.title;
            const apiUrl = config.apiUrl;
            const conference_info = {
                'start' : click_event.event.start,
                'end' : click_event.event.end, date, 
                'reserve_id' : reserve_id, 
                'title' : title, 
                'apiUrl' : apiUrl,
                'chinesename' : event.chinesename,
                'unit' : event.unit, 
                'number' : event.number,
                'identifier' : event.identifier
            };
            console.log('conference_info:', conference_info);
            this.$refs.calendar_ref.showEditConferncePage(conference_info);
        },
        async loadCDN(cdn) {
            // load required cdn, and wait for all cdn to be loaded
            await Promise.all(cdn.map(src => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }));
            
        },
        setInfo(val) {
            this.info = val;
        },
    }
}
</script>
<style scoped>
.test {
    background-color: white;
}
</style>