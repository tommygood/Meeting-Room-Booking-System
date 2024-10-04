
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

    // use settimout to keep checking if the reservation is changed
    setInterval(() => {
        // get the event data
        getevent().then(event => {
            // 取得會議預約資料
            event.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
            console.log(event);
    
            // TODAY
            if (event.length > 0) {
                let index = 0;
                document.querySelector('.event-list').innerHTML = '';
                //顯示每個今日會議
                event.forEach(event => {
                    const eventCard = document.createElement('div');
                    eventCard.className = 'event-card-min';
                    const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    // not display the event which is already ended
                    const datetime = new Date();
                    if (new Date(event.end_time) < datetime) {
                        return;
                    }
    
                    // display the event happened today
                    eventCard.innerHTML = DOMPurify.sanitize(`
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
                    `);
                    document.querySelector('.event-list').appendChild(eventCard);

                    // display the event happened now
                    if (index == 0) {
                        // put the first event to the div which class is event-list-now
                        document.querySelector('.event-list-now').innerHTML = '';
                        const eventCardNow = document.createElement('div');
                        eventCardNow.className = 'event-card-now';
                        eventCardNow.innerHTML = DOMPurify.sanitize(`
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
                        `);
                        document.querySelector('.event-list-now').appendChild(eventCardNow);
                    }

                    // display the next event
                    if (index == 1) {
                        // put the second event to the div which class is event-list-next
                        document.querySelector('.event-list-next').innerHTML = '';
                        const eventCardNow = document.createElement('div');
                        eventCardNow.className = 'event-card-now';
                        eventCardNow.innerHTML = DOMPurify.sanitize(`
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
                        `);
                        document.querySelector('.event-list-next').appendChild(eventCardNow);
                    }
                    index++;
                });
            }
            else {
                // 顯示今日無會議 // 未完成
                document.querySelector('.event-list').innerHTML = '';
                const eventCard = document.createElement('div');
                eventCard.className = 'event-title';
                eventCard.innerHTML = '今日無會議';
                document.querySelector('.event-list').appendChild(eventCard);
            }
    })}, 1000);

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
