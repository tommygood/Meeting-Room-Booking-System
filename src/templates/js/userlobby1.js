

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
    const account_type = await getinfo('chinesename');
    // document.getElementById("accountName").innerHTML += account_type;
    console.log(account_type);
  }
  setAccountName();




//隱藏彈出視窗
function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

  
function showRules(){
  Swal.fire({
    title: '會議室使用規則',
    html: `
      <div style="text-align: left; line-height: 1.6; font-size: 16px;">
        一、使用時間:每週一到週五,上班時段上午8:00至下午5:00。<br>
        二、座位數量:16個(備用4張)。<br>
        三、借用手續:<br>
        請至秘書室網頁「行政大樓2種會議室預約」登記,登載會議名稱、日期和時間、聯絡人、聯絡分機、e-mail和借用單位等資訊採優先登記制。<br>
        四、注意事項:<br>
        1.預約限三個月內活動;超過三個月以上不接受預約。<br>
        2.為保障各單位使用權益,請備用單位於預約時,確實填寫使用時段,勿超時預約。<br>
        3.預約單位與使用登記不符,或讓渡其他單位或個仁使用;違反三次以上(含三次)者,給停權一個月。<br>
        4.借用單位之使用時間,若與管理單位有衝突,以管理單位為優先。<br>
        5.務必小心使用會議室內設備,使用完畢後恢復原狀。<br>
        6.會議所需之筆電和茶水,由借用單位自行準備。<br>
        7.離去時,請將冷氣和電燈電源關閉,並關上門窗。<br>
        五、申請借用單位願意遵守所有相關規定,如有違反者,願負一切責任。<br>
      </div>
    `,
    confirmButtonText: 'OK',
  });
  
}



//calendar
document.addEventListener("DOMContentLoaded", function() {
  const calendarEl = document.getElementById("calendar")
  
  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",
    locale:"zh-tw",
    height: '100vh',
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
      week: "週",
      day: "天",
    },



    events: [ // Events 
      {
        title: "資料庫測試", // 事件標題
        start: '2024-09-02T12:08:00', // 開始時間，時間格式建議使用 ISO 格式 (yyyy-MM-ddTHH:mm:ss)
        end: '2024-09-02T13:08:00', // 結束時間
        // 其他自定義屬性，這些屬性不會影響 FullCalendar 的顯示
        extendedProps: {
        name: "小明",
        department: "秘書室",
        number: "576"
      }
      },

    ],
  //   eventSources:[
  //     {
  //     url: `./dbselectevent.php`
  //     }
  // ],

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
            申請人: ${info.event.extendedProps.name}<br>
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

