  // get user info from ncu portal
  const api_info = 'http://localhost:3000/api/info/';
  async function getinfo(type){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const headers = urlParams.get('access_token')
      try {
        const response = await fetch(api_info+type,{ headers: { 'access_token': headers } });
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error("Error:", error);
      }
    }
  async function setAccountName() {
      const account_type = await getinfo('chinesename');
      document.getElementById("accountName").innerHTML += account_type;
    }
    setAccountName();
  
//fetch event info from sql
const eventApiUrl = (start, end) => `http://localhost:3000/api/reservation?start_time=${start}&end_time=${end}`;
function fetchevent(start, end){
  return fetch(eventApiUrl(start, end),{
    method: 'GET',
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then(result => {
    if (result && Array.isArray(result.data)) {
      // 將 data 中的每個項目格式化為 FullCalendar 需要的事件格式
      return result.data.map(item => ({
        id: item.reserve_id,
        title: item.name, // 預約名稱
        start: item.start_time, // 開始時間
        end: item.end_time, // 結束時間
        extendedProps: {
          chinesename: item.chinesename,
          unit:item.unit,
          show: item.show,
          number: item.ext
        }
      }));
    } else {
      console.error('Unexpected data format:', result); 
    }
  })}



//當頁按鈕變色
document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('conference').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('conference').style.color= 'white';
})

//換頁面
function changePage(button){
    console.log(button.id);
    location.href = "/page/"+button.id;
}

function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

// calendar
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



    events: function(fetchInfo, successCallback, failureCallback) {
      // 調用 API 獲取事件，fetchInfo 會自動提供 start 和 end 日期
      fetchevent(fetchInfo.startStr, fetchInfo.endStr)
          .then(events => successCallback(events))
          .catch(error => failureCallback(error));
  },





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
          借用單位: ${info.event.extendedProps.unit}<br>
          申請人: ${info.event.extendedProps.chinesename}<br>
          分機號碼: ${info.event.extendedProps.number}<br>
      `,
      showCancelButton: true,
      cancelButtonText: 'OK' ,
      confirmButtonText: '編輯會議', 

      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById('hamburger-menu').style.display='flex';

        } else {
          
        }
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

  calendar.render()
  
})