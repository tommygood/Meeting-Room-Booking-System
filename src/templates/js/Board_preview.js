// document.addEventListener("DOMContentLoaded", function () {

//     const eventApiUrl = (start, end) => `/api/reservation?start_time=${start}&end_time=${end}`;
//     const urlParams = new URLSearchParams(window.location.search);
//     const date = urlParams.get('date');
//     const time = urlParams.get('time');

//     document.getElementById('date-time').innerText = date + " " + time; // 顯示看板上方日期時間


//     async function getevent() {
//         const day = new Date(date);
//         const tomorrow = new Date(date);
//         tomorrow.setDate(day.getDate() + 1);
//         try {
//             const response = await fetch(eventApiUrl(day.toISOString().split('T')[0], tomorrow.toISOString().split('T')[0]), {
//                 method: 'GET',
//                 credentials: 'include',
//                 headers: { 'Content-Type': 'application/json' },
//             });
//             const data = await response.json();
//             return data.data;

//         } catch (error) {
//             // 捕捉和處理異常
//             console.error('Fetch error:', error);
//             return null;
//         }
//     }

//     getevent().then(event => {

//         const events = event.data || [];
//         events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
//         console.log(events);

//         // TODAY
//         if (events.length > 0) {
//             document.querySelector('.event-list').innerHTML = '';
//             //顯示每個自己的會議
//             events.forEach(event => {
//                 const eventCard = document.createElement('div');
//                 eventCard.className = 'event-card-min';
//                 const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//                 const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//                 eventCard.innerHTML = DOMPurify.sanitize(`
//                     <div class="time-block-min">
//                         <span>${startTime}</span>
//                         <span>|</span>
//                         <span>${endTime}</span>
//                     </div>
//                     <div class="event-details-min">
//                         <h3>${event.name}</h3>
//                         <p>借用單位：${event.unit}</p>
//                         <p>借用人：${event.chinesename}</p>
//                     </div>
//                 `);
//                 document.querySelector('.event-card-min').appendChild(eventCard);
//             });
//         } else if (events.length > 0 && events[events.length - 1].end_time.time < time) {
//             document.querySelector('.event-list').innerHTML = DOMPurify.sanitize(`<div class="event-title">今日會議已結束</div>`);
//         }
//     });
// }
// )


const eventApiUrl = (start, end) => `/api/reservation?start_time=${start}&end_time=${end}`;
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
const time = urlParams.get('time');
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
    console.log(event); // 取得會議預約資料
    const events = event.data || [];
    // events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    console.log(events);
})
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
