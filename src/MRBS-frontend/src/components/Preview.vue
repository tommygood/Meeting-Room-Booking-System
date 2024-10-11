<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

    <div class="swiper">
        <!-- swiper class 要輪播的內容為 swiper-wrapper -->
        <div class="swiper-wrapper">
            <!-- 今日會議 -->
            <div class="swiper-slide">
                <div class="container">
                    <div class="table-container">
                        <div class="title">- TODAY -</div>
                        <!-- 顯示會議資訊 -->
                        <div class="event-list"></div>
                    </div>
                </div>
            </div>
            <!-- 現正進行會議 -->
            <div class="swiper-slide">
                <div class="container">
                    <div class="table-container">
                        <div class="title">- NOW -</div>
                        <div class="event-list-now"></div>
                    </div>
                </div>
            </div>
            <!-- 下一場會議 -->
            <div class="swiper-slide">
                <div class="container">
                    <div class="table-container">
                        <div class="title">- NEXT -</div>
                        <!-- <div class="divider"></div> -->
                        <!-- <div class="event-card-max"> -->
                        <!-- <div class="this-label">— NEXT —</div> -->
                        <div id="next-event" class="event-list-next"></div>
                        <!-- </div> -->
                    </div>
                </div>
            </div>
        </div>

        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>
<script>
import config from '@/config';

export default {
    name: 'board',
    props: {
        demo: {
            type: Boolean,
            default: false
        }
    },
    async mounted() {
        const cdn = ['https://unpkg.com/swiper/swiper-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js'
        ];
        await this.loadCDN(cdn);
        this.displayDatetime();
        this.setSwiper();
        this.setTopDatetime();
        // save the slides, so that we can add them back to swiper
        this.slides = document.querySelectorAll('.swiper-slide'); 
        this.event_list =  Object.assign(document.querySelector('.event-list'));
        this.event_list_now = Object.assign(document.querySelector('.event-list-now'));
        this.event_list_next = Object.assign(document.querySelector('.event-list-next'));
        // keep checking if the reservation is changed
        this.reservationMonitor();
        // reload the page every 15 minutes
        this.reloadMonitor();
    },
    data() {
        return {
            info: {},
            swiper: null,
            date : null,
            time : null,
            slides: null,
            event_list: null,
            event_list_now: null,
            event_list_next: null,
        }
    },
    methods: {
        eventApiUrl: (start, end) => config.apiUrl + `/reservation?start_time=${start}&end_time=${end}`,
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
        isDemoPage() {
            return this.demo;
        },
        setSwiper() {
            if (this.isDemoPage()) {
                this.swiper = new Swiper('.swiper', { // 創建一個輪播
                    autoplay: { // 自動輪播 swiper
                        delay: 5 * 1000, // 每兩秒切換下一張
                    },
                    loop: true, // 輪播結束後回到第一張繼續輪播
            
                });
            }
            else {
                this.swiper = new Swiper('.swiper', { // 創建一個輪播
                    loop: true, // 輪播結束後回到第一張繼續輪播
                
                    navigation: { // 前一張、下一張按鈕
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                
                    pagination: { // 下方頁籤
                        el: ".swiper-pagination",
                    },
                });
            }
        },
        displayDatetime() {
            // get datetime from query string if url path is not demo
            if (!this.isDemoPage()) {
                const urlParams = new URLSearchParams(window.location.search);
                this.date = urlParams.get('date');
                this.time = urlParams.get('time');
            }
            else {
                // get current datetime if url path is demo
                const datetime = new Date();
                this.date = datetime.toISOString().split('T')[0];
                this.time = datetime.toTimeString().split(' ')[0];
            }
        },
        setTopDatetime() {
            // 顯示看板上方日期時間(3頁)
            document.querySelectorAll('.date-time').forEach(element => {
                element.innerText = this.date + "\n" + this.time;
            });
        },
        async getevent() {
            // day can not be later than today
            let today_date = new Date();
            today_date.setHours(0, 0, 0, 0);
            const day = new Date(this.date);
            const tomorrow = new Date(this.date);
            if (day < today_date) {
                alert('日期不可晚於今天');
                return null;
            }
            
            tomorrow.setDate(day.getDate() + 1);
            try {
                const response = await fetch(this.eventApiUrl(day.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]), {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                return data.data;

            } catch (error) {
                // 捕捉和處理異常
                console.error('Fetch error:', error);
                return null;
            }
        },
        eventCardContent(event, startTime, endTime) {
            return `
                <div class="time-block-min">
                    <span>${startTime}</span>
                    <span>|</span>
                    <span>${endTime}</span>
                </div>
                <div class="event-details-min">
                    <h3>${event.name}</h3>
                    <p>借用單位：${event.unit}</p>
                    <p>借用人：${event.chinesename}</p>
                </div>
            `;
        },
        findSwiper(val) {
            const cur_slides = document.querySelectorAll('.swiper-slide');
            for (let i = 0; i < cur_slides.length; i++) {
                if (cur_slides[i].childNodes[0].childNodes[0].childNodes[0].innerHTML.includes(val)) {
                    return cur_slides[i];
                }
            }
            return cur_slides[0];
        },
        removeBothEvent() {
            const next_event = this.findSwiper('NEXT');
            const now_event = this.findSwiper('NOW');
            if (now_event) {
                console.log('remove now event', now_event);
                now_event.remove();
                this.swiper.update();
            }
            if (next_event) {
                console.log('remove next event', next_event);
                next_event.remove();
                this.swiper.update();
            }
        },
        // use settimout to keep checking if the reservation is changed
        reservationMonitor() {
            setInterval(() => {
                // get the event data
                this.getevent().then(events => {
                    // 取得會議預約資料
                    events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

                    if (document.querySelector('.event-list') == null) {
                        // add swiper-slide back
                        document.querySelector('.swiper-wrapper').appendChild(this.slides[0]);
                        this.swiper.update();
                    }
                    if (document.querySelector('.event-list-now') == null) {
                        //console.log('add event-list-now');
                        // add swiper-slide back
                        document.querySelector('.swiper-wrapper').appendChild(this.slides[1]);
                        this.swiper.update();
                    }
                    if (document.querySelector('.event-list-next') == null) {
                        // add swiper-slide back
                        document.querySelector('.swiper-wrapper').appendChild(this.slides[2]);
                        this.swiper.update();
                    }
            
                    // display events not ended yet and happened today
                    if (events.length == 0) {
                        // 顯示今日無會議 // 未完成
                        document.querySelector('.event-list').innerHTML = '';
                        const eventCard = document.createElement('div');
                        eventCard.className = 'event-title';
                        eventCard.innerHTML = '今日無會議';
                        document.querySelector('.event-list').appendChild(eventCard);
                        this.removeBothEvent();
                    }
                    else {
                        let index = 0;
                        let now_empty = true;
                        let next_empty = true;
                        let can_put_next = false;
                        document.querySelector('.event-list').innerHTML = '';
                        //顯示每個今日會議
                        for (const event of events) {
                            const eventCard = document.createElement('div');
                            eventCard.className = 'event-card-min';
                            const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            // not display the event which is already ended
                            const datetime = new Date();
                            if (new Date(event.end_time) < datetime) {
                                continue;
                            }
            
                            // display the event happened today
                            eventCard.innerHTML = this.eventCardContent(event, startTime, endTime);
                            document.querySelector('.event-list').appendChild(eventCard);

                            // display the event happened now
                            if (index == 0) {
                                // check reservation time is now
                                if (new Date(event.start_time) > datetime) {
                                    can_put_next = true;
                                }
                                else {

                                    // add .swiper-slide back to swiper if there is no div which contains event-list-now
                                    if (!document.querySelector('.event-list-now')) {
                                        document.querySelector('.swiper-wrapper').appendChild(this.slides[1]);
                                        this.swiper.update();
                                    }

                                    // put the first event to the div which class is event-list-now
                                    const eventCardNow = document.createElement('div');
                                    eventCardNow.className = 'event-card-max';
                                    eventCardNow.innerHTML = this.eventCardContent(event, startTime, endTime);
                                    // replace the event if there is an event
                                    if (document.querySelector('.event-list-now').childNodes.length == 0) {
                                        document.querySelector('.event-list-now').appendChild(eventCardNow);
                                    }
                                    else {
                                        document.querySelector('.event-list-now').replaceChildren(eventCardNow);
                                    }
                                    now_empty = false;
                                }
                            }

                            console.log('event:', event, 'index:', index, 'can_put_next:', can_put_next);
                            // display the next event
                            if ((index == 1 && !can_put_next)  || (index == 0 && can_put_next)) {
                                // put the second event to the div which class is event-list-next
                                // add .swiper-slide back to swiper if there is no div which contains event-list-now
                                if (!document.querySelector('.event-list-next')) {
                                    document.querySelector('.swiper-wrapper').appendChild(this.slides[2]);
                                    this.swiper.update();
                                }
                                const eventCardNow = document.createElement('div');
                                eventCardNow.className = 'event-card-max';
                                console.log('put next event:', event);
                                eventCardNow.innerHTML = this.eventCardContent(event, startTime, endTime);
                                // replace the event if there is an event
                                if (document.querySelector('.event-list-next').childNodes.length == 0) {
                                    document.querySelector('.event-list-next').appendChild(eventCardNow);
                                }
                                else {
                                    document.querySelector('.event-list-next').replaceChildren(eventCardNow);
                                }
                                next_empty = false;
                            }
                            index++;
                        };
                        console.log('now_empty:', now_empty, 'next_empty:', next_empty);
                        console.log('index:', index);
                        // set the now event to empty if there is no event
                        if (!now_empty && next_empty) {
                            const next_event = document.querySelectorAll('.swiper-slide')[2];  
                            if (next_event) {
                                console.log('remove next event', next_event);
                                next_event.remove();
                                this.swiper.update();
                            }
                        }
                        else if (now_empty && next_empty) {
                            //document.querySelector('.event-list-now').innerHTML = '今日無會議';
                            // remove the now and next event if there is no event
                            this.removeBothEvent();
                        }
                        else if (now_empty && !next_empty && document.querySelectorAll('.swiper-slide').length == 3) {
                            const now_event = this.findSwiper('NOW');
                            if (now_event) {
                                console.log('remove now event', now_event);
                                now_event.remove();
                                this.swiper.update();
                            }
                        }
                    }
                })
                this.swiper.update();
            }, 5000);
        },
        reloadMonitor() {
            // reload the page every 15 minutes
            setInterval(() => {
                window.location.reload();
            }, 15 * 60 * 1000);
        },
    }
}
</script>
<style src="@/assets/board.css" scoped></style>
<style scoped>

.swiper {
            margin: 0px 0px;
            width: 90%;
            height: 95%;
        }

        .swiper-slide {
            width: contain;
            height: contain;
        }

        :root {
            --swiper-theme-color: #666;
        }

        .block {
            width: contain;
            height: contain;
            background-color: rgb(238 238 238);
            box-shadow: inset 0 4px 4px 0 rgb(0 0 0 / 25%);
        }

</style>