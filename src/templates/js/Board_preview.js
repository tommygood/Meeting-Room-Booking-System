
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
        const day = new Date(date);
        const tomorrow = new Date(date);
        tomorrow.setDate(day.getDate() + 1);
        try {
            const response = await fetch(eventApiUrl(day.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]), {
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
    }

    getevent().then(event => {
        // 取得會議預約資料
        event.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        console.log(event);

        // TODAY
        if (event.length > 0) {
            document.querySelector('.event-list').innerHTML = '';
            //顯示每個今日會議
            event.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card-min';
                const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
            });
        } else if (event.length > 0 && event[event.length - 1].end_time < time) {
            // 顯示今日會議已結束 // 未完成
            document.querySelector('.event-list').innerHTML = '';
            const eventCard = document.createElement('div');
            eventCard.className = 'event-title';
            eventCard.innerHTML = DOMPurify.sanitize(`今日會議已結束`);
        } else {
            // 顯示今日無會議 // 未完成
            document.querySelector('.event-list').innerHTML = '';
            const eventCard = document.createElement('div');
            eventCard.className = 'event-title';
            eventCard.innerHTML = DOMPurify.sanitize(`今日無會議`);
        }

        // NOW


        // NEXT
    });

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
