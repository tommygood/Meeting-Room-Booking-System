document.addEventListener("DOMContentLoaded", function () {

    const eventApiUrl = (start, end) => `/api/reservation?start_time=${start}&end_time=${end}`;
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    const time = urlParams.get('time');

    // 顯示看板上方日期時間(3頁)
    document.querySelectorAll('.date-time').forEach(element => {
        element.innerText = date + "\n" + time;
    });

    async function getevent() {
        // day can not be later than today
        let today_date = new Date();
        today_date.setHours(0, 0, 0, 0);
        const day = new Date(date);
        const tomorrow = new Date(date);
        if (day < today_date) {
            alert('日期不可晚於今天');
            return null;
        }

        
        tomorrow.setDate(day.getDate() + 1);
        try {
            const response = await fetch(eventApiUrl(day.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]), {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            console.log(data);
            return data.data;

        } catch (error) {
            // 捕捉和處理異常
            console.error('Fetch error:', error);
            return null;
        }
    }

    function eventCardContent(event, startTime, endTime) {
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
    }

    // save the slides, so that we can add them back to swiper
    let slides = document.querySelectorAll('.swiper-slide'); 
    // use settimout to keep checking if the reservation is changed
    setInterval(() => {
        // get the event data
        getevent().then(events => {
            // 取得會議預約資料
            events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    
            // display events not ended yet and happened today
            if (events.length == 0) {
                // 顯示今日無會議 // 未完成
                document.querySelector('.event-list').innerHTML = '';
                const eventCard = document.createElement('div');
                eventCard.className = 'event-title';
                eventCard.innerHTML = '今日無會議';
                document.querySelector('.event-list').appendChild(eventCard);
            }
            else {
                let index = 0;
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
                    eventCard.innerHTML = eventCardContent(event, startTime, endTime);
                    document.querySelector('.event-list').appendChild(eventCard);

                    // display the event happened now
                    if (index == 0) {
                        // add .swiper-slide back to swiper if there is no div which contains event-list-now
                        if (!document.querySelector('.event-list-now')) {
                            document.querySelector('.swiper-wrapper').appendChild(slides[1]);
                            swiper.update();
                        }

                        // put the first event to the div which class is event-list-now
                        const eventCardNow = document.createElement('div');
                        eventCardNow.className = 'event-card-max';
                        eventCardNow.innerHTML = eventCardContent(event, startTime, endTime);
                        // replace the event if there is an event
                        if (document.querySelector('.event-list-now').childNodes.length == 0) {
                            document.querySelector('.event-list-now').appendChild(eventCardNow);
                        }
                        else {
                            document.querySelector('.event-list-now').replaceChildren(eventCardNow);
                        }
                    }

                    // display the next event
                    if (index == 1) {
                        // put the second event to the div which class is event-list-next
                        // add .swiper-slide back to swiper if there is no div which contains event-list-now
                        if (!document.querySelector('.event-list-next')) {
                            document.querySelector('.swiper-wrapper').appendChild(slides[2]);
                            swiper.update();
                        }
                        const eventCardNow = document.createElement('div');
                        eventCardNow.className = 'event-card-max';
                        eventCardNow.innerHTML = eventCardContent(event, startTime, endTime);
                        // replace the event if there is an event
                        if (document.querySelector('.event-list-next').childNodes.length == 0) {
                            document.querySelector('.event-list-next').appendChild(eventCardNow);
                        }
                        else {
                            document.querySelector('.event-list-next').replaceChildren(eventCardNow);
                        }
                    }
                    index++;
                };
                // set the now event to empty if there is no event
                if (index == 0) {
                    document.querySelector('.event-list').innerHTML = '今日無會議';

                    // remove the now and next event if there is no event
                    const next_event = document.querySelectorAll('.swiper-slide')[2];
                    const now_event = document.querySelectorAll('.swiper-slide')[1];
                    if (now_event && next_event) {
                        now_event.remove();
                        next_event.remove();
                        swiper.update();
                    }
                }
                else if (index == 1) {
                    // remove the next event if there is only one event
                    const next_event = document.querySelectorAll('.swiper-slide')[2];
                    if (next_event) {
                        next_event.remove();
                        swiper.update();
                    }
                }
            }
        })
    }, 5000);

    const swiper = new Swiper('.swiper', { // 創建一個輪播

        loop: true, // 輪播結束後回到第一張繼續輪播
    
        navigation: { // 前一張、下一張按鈕
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    
        pagination: { // 下方頁籤
            el: ".swiper-pagination",
        },
    });
    
});
