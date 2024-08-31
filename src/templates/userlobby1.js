

const api_info = 'http://localhost:3000/api/info/';

  // get user info from ncu portal
async function getinfo(type){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const headers = urlParams.get('access_token')
    try {
      const response = await fetch(api_info+type,{ headers: { 'access_token': headers } });
      const data = await response.json();
      return data.result;
      } catch (error) {
      console.error("Error:", error);
    }
  }
async function setAccountName() {
    const account_type = await getinfo('accountName');
    document.getElementById("accountName").innerHTML += account_type;
  }
  // setAccountName();




//隱藏會議列表
function hidepopup(){
  document.querySelector('.popup').style.display='none';
}

  
//calendar
document.addEventListener("DOMContentLoaded", function() {
  const calendarEl = document.getElementById("calendar")
  
  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",
    locale:"zh-tw",
    height: 700,
    contentHeight: 700,

    windowResizeDelay: 1,
    displayEventEnd:true,
    fixedWeekCount:false,

    eventOrder: "start",

    dayMaxEventRows: true,   
    views: {
      dayGridMonth: {
        dayMaxEventRows:4 // adjust to 6 only for timeGridWeek/timeGridDay
      }
    },



     //calendar上方按鈕
    headerToolbar: {
      left: "today,dayGridMonth,timeGridWeek,timeGridDay",
      center:"prev title next",
      right: null,
    },
    buttonText: {
      today: "今天",
      month: "月",
      week: "周",
      day: "天",
    },




    eventSources:[
      {
      url: `./dbselectevent.php`
      }
  ],

    // 會議顯示
    // eventDisplay:
    eventTextColor: '#000000',
    eventBackgroundColor: "rgb(217,217,217)",



    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false, 
      hour12: false 
    },

    eventClick: function(info) {
      console.log(info.event);
      const StartTime = info.event.start.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const EndTime = info.event.end.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  });



      Swal.fire({
        title: info.event.title,
        html: `
            ${StartTime} ~ ${EndTime}<br>
            會議：${info.event.title}<br>
            借用單位: ${info.event.extendedProps.department}<br>
            發起人: ${info.event.extendedProps.name}<br>
            分機號碼: ${info.event.extendedProps.number}<br>
        `,
        confirmButtonText: "OK",
      })
    },

});



// 彈出視窗
function handleDateClick(info){
  const event = calendar.getEvents().filter(event => {
    return event.startStr.startsWith(info.dateStr);
 });
 event.sort((a, b) => a.start - b.start);

if (event) {
 // 顯示出框
 var dayofweek=info.date.getDay();
 var month=info.date.getMonth()+1;
 var day=info.date.getDate();
 var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
 var weekdayName = weekdays[dayofweek%7];


 document.querySelector('.popup').style.display='flex';
 document.querySelector('.popup-datetitle').innerHTML = month+"/"+day+"("+weekdayName+")"+"會議";
 
}

// 清空list
document.querySelector('.popup-list').innerHTML = '';

if(event.length>0){
 {
   // 為每個事件生成彈出框
   event.forEach(event => {
     const popup = document.createElement('div');
     popup.className = 'popup-content_box';
     popup.style.display = 'flex';

     const startTime = event.start.toLocaleString().slice(9, 16).replace(/:$/, '');
     const endTime = event.end.toLocaleString().slice(9, 16).replace(/:$/, '');


     popup.innerHTML = `
       <h3 class="popup-subtitle">
       ${startTime}~${endTime}<br>
         會議：${event.title}<br>
         借用單位: ${event.extendedProps.department}<br>
         發起人: ${event.extendedProps.name}<br>
         分機號碼: ${event.extendedProps.number}<br>
       </h3>
       <hr>
     `;

     // 添加到list中
     document.querySelector('.popup-list').appendChild(popup);
   });
 }}
 
}

  // 點日期彈出視窗
calendar.on('dateClick', function(info) {
  handleDateClick(info);
});


// // 點事件彈出視窗
// calendar.on('eventClick', function(info) {
//   // 取得被點擊事件的日期
//   const eventDate = info.event.start;
//   console.log(eventDate);
//   // 將日期部分格式化為 "YYYY-MM-DD"
//   const eventDateStr = eventDate.toISOString().split('T')[0];

//   // 過濾當天所有事件
//   const events = calendar.getEvents().filter(event => {
//     const eventStartStr = event.start.toISOString().split('T')[0];
//     return eventStartStr === eventDateStr;
//   });

//   // 確保事件按開始時間排序
//   events.sort((a, b) => a.start - b.start);

//   // 在這裡，你可以處理當天的所有事件

//   // 將這些事件資訊傳遞給 handleDateClick 或其他處理函數
//   const dateInfo = {
//     dateStr: eventDateStr,
//     date: eventDate,
//     events: events
//   };

//   handleDateClick(dateInfo);
// });



  calendar.render()
  


  
})



// 漢堡選單
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger-button');
  hamburger.addEventListener('click', function() {
      document.getElementById('hamburger-menu').classList.toggle('active');
      document.getElementById('lobby').classList.toggle('active');
    });
});


//申請換頁
document.addEventListener('DOMContentLoaded', function() {
  const requestbutton = document.getElementById('hamburger-requestbutton');
  requestbutton.addEventListener('click', function() {
      document.getElementById('hamburger-content').style.display = 'none';
      document.getElementById('hamburger-requestpage').style.display = 'flex';
    });
})
document.addEventListener('DOMContentLoaded', function() {
  const requestButton = document.getElementById('backbtn');
  requestButton.addEventListener('click', function() {
    document.getElementById('hamburger-content').style.display = 'block';
    document.getElementById('hamburger-requestpage').style.display = 'none';
  });
});

