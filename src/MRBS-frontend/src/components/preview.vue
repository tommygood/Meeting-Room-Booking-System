<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
    <div id="bg_img" style='height:100vh'>
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
        },
        mock_swiper: {
            type: Object,
            default: null
        },
        mock_slides: {
            type: Array,
            default: []
        }
    },
    async mounted() {
        document.querySelector('body').style.display = 'none'; // disable the body before loading the background image
        this.loadCSS(); // load css dynamically to avoid css not loaded issue
        const cdn = ['https://unpkg.com/swiper/swiper-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js'
        ];
        await this.loadCDN(cdn);
        this.setBgImage();
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
            swiper: this.mock_swiper,
            date : null,
            time : null,
            slides: this.mock_slides,
            event_list: null,
            event_list_now: null,
            event_list_next: null,
        }
    },
    methods: {
        loadCSS() {
            const style = document.createElement('style');
            // load css dynamically to avoid css not loaded issue
            style.innerHTML = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: sans-serif;
            }


            .container {
                width: 100%;
                height: 100%;
                /* padding: 50px; */
                text-align: center;
            }

            .date-time {
                font-size: 70px;
                font-family: monospace;
                color: #ffffff;
                margin-top: 50px;
                align-content: end;
                height: 10%;
            }

            .divider {
                height: 1px;
                background-color: #ccc;
                margin: 25px 45px;
                /* align-self: center; */
            }

            /* 資訊卡(大框) */
            .table-container {
                width: 90%;
                height: 80%;
                margin: 50px auto;
                /* padding: 20px; */
                background-color: rgba(255, 255, 255, 0.80);
                border-radius: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                border: 3px solid #b0e0f5; /* Light blue border for side stripes */
            }

            /* 資訊卡標題 */
            .title {
                background: linear-gradient(to right, #6cd3a1, #37b9df); /* Gradient colors */
                height: 8%;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;

                font-size: 70px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 20px;
                align-content: center;
            }

            /* TODAY */

            .event-card-min {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                margin: 20px 15px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #ffffff50;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .time-block-min {
                color: #00a4bb;
                font-weight: 700;
                font-size: 45px;
                text-align: center;
            }

                .time-block-min span {
                    display: block;
                }

            .event-details-min {
                text-align: left;
                margin-left: 20px;
            }

            .event-details-min h3 {
                font-size: 50px;
                font-weight: 700;
                width: auto;
                color: #3e3a39;
                margin-bottom: 8px;
            }

            .event-details-min p {
                font-size: 30px;
                color: #999999;
            }

            /* NOW & NEXT */
            .event-card-max {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 85%;
                padding: 20px 100px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .event-title {
                font-size: 80px;
                font-weight: 700;
                height: 25%;
                /* margin-bottom: 20px; */
                align-content: center;
                margin: 0px 25px;
            }

            .time-block-max {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100%;
                height: 10%;
                font-size: 80px;
                font-weight: 700;
                color: #00a4bb;
            }

            .time-block-max span {
                display: block;
            }

            .time-block-max .dash {
                margin: 0 10px;
            }

            .label {
                font-size: 30px;
                height: 5%;
                color: #666;
                margin-bottom: 5px;
            }

            .value {
                font-size: 50px;
                font-weight: 700;
                height: 15%;
                color: #000;
                margin-bottom: 20px;
                align-content: center;
            }
            `;
            document.getElementsByTagName("head")[0].appendChild(style);
        },
        setBgImage() {
            // set background image
            //document.querySelector('body').style.backgroundImage = "url('/public/bg_board.png')";

            document.querySelector('body').style.display = '';
        },
        eventApiUrl: (start, end) => config.apiUrl + `/reservation/show?start_time=${start}&end_time=${end}`,
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
                this.date = datetime.toLocaleDateString();
                this.time = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        // check if the reservation is changed
        reservationStausCheck(events) {
            // record which event is triggered
            let triggered_event = {'today': false, 'now': false, 'next': false};
            // 取得會議預約資料
            events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

            // add swiper-slide back if there is no related event
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
                eventCard.innerHTML = '<h3>今日無會議</h3>';
                document.querySelector('.event-list').appendChild(eventCard);
                this.removeBothEvent();
            }
            else {
                let index = 0;
                let now_empty = true;
                let next_empty = true;
                let can_put_next = false;
                // reset today list if the content is not empty
                if (!document.querySelector('.event-list').innerHTML.includes('今日無會議')) {
                    document.querySelector('.event-list').innerHTML = '';
                }
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
                    triggered_event['today'] = true;

                    // display the event happened now
                    if (index == 0) {
                        // check reservation time is now
                        if (new Date(event.start_time) > datetime) {
                            can_put_next = true;
                        }
                        else {
                            triggered_event['now'] = true;
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
                        triggered_event['next'] = true;
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
                    document.querySelector('.event-list').innerHTML = '<h3>今日無會議</h3>';
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
            this.swiper.update();
            return triggered_event;
        },
        // use settimout to keep checking if the reservation is changed
        reservationMonitor() {
            setInterval(async () => {
                const events = await this.getevent();
                this.reservationStausCheck(events);
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
<style>
#bg_img {
    background-image: url('@/assets/bg_board.png');
}

</style>
<style scoped>

body {
    background-image: url('@/assets/bg_board.png');
}

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