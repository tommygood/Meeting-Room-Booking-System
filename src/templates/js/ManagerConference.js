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

function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}


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
      const startTime = info.event.start.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const endTime = info.event.end.toLocaleString('zh-TW', {
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
          ${startTime} ~ ${endTime}<br>
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
          document.querySelector('input[name="name"]').value = info.event.title;
          document.querySelector('input[name="person"]').value = info.event.extendedProps.chinesename;
          document.querySelector('input[name="unit"]').value = info.event.extendedProps.unit;
          document.querySelector('input[name="phone"]').value = info.event.extendedProps.phone; // 假設有對應資料
          document.querySelector('input[name="ext"]').value = info.event.extendedProps.number;
          document.querySelector('input[name="email"]').value = info.event.extendedProps.email; // 假設有對應資料
          const startDate = new Date(info.event.start);
          document.querySelector('input[name="date"]').value = startDate.toISOString().split('T')[0]; // 只取日期部分        
          const startHour = String(startDate.getHours()).padStart(2, '0');
          const startMinute = String(startDate.getMinutes()).padStart(2, '0');
          document.querySelector('select[name="starthour"]').value = startHour;
          document.querySelector('select[name="startminute"]').value = startMinute;

          const endDate = new Date(info.event.end);
          const endHour = String(endDate.getHours()).padStart(2, '0');
          const endMinute = String(endDate.getMinutes()).padStart(2, '0');
          document.querySelector('select[name="endhour"]').value = endHour;
          document.querySelector('select[name="endminute"]').value = endMinute;  

        } else {
          
        }
          })
        },

});

  calendar.render()
  
})