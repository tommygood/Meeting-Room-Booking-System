// get user info from ncu portal
const api_info = '/api/info/';
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
  var account_type = await getinfo('chinesename');
  account_type = DOMPurify.sanitize(account_type);
  document.getElementById("accountName").innerHTML += account_type;
}
setAccountName();

function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';

}


//fetch event info from sql
const eventApiUrl = (start, end) => `/api/reservation?start_time=${start}&end_time=${end}`;
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
          number: item.ext,
          reserve_id: item.reserve_id,
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


//enddate跟著startdate變化
document.addEventListener('DOMContentLoaded', function() {
  const startDate = document.getElementById('startdate');
  startDate.addEventListener('change', function() {
    document.getElementById('enddate').value = startDate.value;
  });
})


//換頁面
function changePage(button){
    console.log(button.id);
    location.href = "/page/"+button.id;
}

function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';

}

//starttime&endtime轉datetime格式
function formatDateTimeForDatabase(dateTime) {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回 'YYYY-MM-DD HH:MM:SS'
}


//編輯會議
async function reservationPut(reserve_id) {
  const formData = new FormData(document.getElementById("request"));
  const name = formData.get('name');
  const startdate =formData.get('startdate');
  const starthour =formData.get('starthour');
  const startminute =formData.get('startminute');
  const enddate =formData.get('enddate');
  const endhour =formData.get('endhour');
  const endminute =formData.get('endminute');
  const ext =formData.get('ext');
  const startTimestamp = formatDateTimeForDatabase(`${startdate}T${starthour}:${startminute}:00`);
  const endTimestamp = formatDateTimeForDatabase(`${enddate}T${endhour}:${endminute}:00`);

  // 構建數據對象
  const data = {
    reserve_id: reserve_id,
    name: name,
    room_id: '1',
    start_time: startTimestamp,
    end_time: endTimestamp,
    ext: ext,
    show: true,
    status: false,
  };
  fetch('/api/reservation', {
    method: 'PUT',
    credentials: 'include', 
    body: JSON.stringify(data),  
    headers: { 
      'Content-Type': 'application/json' 
    },
  })
  .then(response => response.json())
  .then((data) => {
    console.log(data);

    if (data.result === "Invalid time, start_time should be less than end_time") {
      alert('無效的時間，開始時間應該早於結束時間。');
    } else if (data.result === "Invalid time, there is a confliction with other reservations") {
      alert('無效的時間，與其他預約有衝突。');
    } else if (data.result === 'Invalid token') {
      alert('無效的憑證，請重新登入。');
    } else if (data.suc) {
      alert("123");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('發生錯誤，請稍後重試。');
  });
}

const delete_api='/api/reservation';
async function reservationDelete(reserve_id){
  fetch(delete_api,{
    method: 'DELETE',
    credentials: 'include', 
    body: JSON.stringify({reserve_id: reserve_id}),  
    headers: { 'Content-Type': 'application/json' },
  })
 .then(response => response.json())
}





// calendar
document.addEventListener("DOMContentLoaded", function() {
  const calendarEl = document.getElementById("calendar")
  
  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",
    firstDay:1,
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
      const startTime = info.event.start.toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        weekday: 'short'
    });
    const endTime = info.event.end.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short'
  });



    Swal.fire({
      title: DOMPurify.sanitize(info.event.title),
      html: DOMPurify.sanitize(`
          ${startTime} ~ ${endTime}<br>
          會議：${info.event.title}<br>
          借用單位: ${info.event.extendedProps.unit}<br>
          申請人: ${info.event.extendedProps.chinesename}<br>
          分機號碼: ${info.event.extendedProps.number}<br>
      `),
      showCancelButton: true,
      showDenyButton: true,
      cancelButtonText: 'OK' ,
      confirmButtonText: '編輯會議',
      denyButtonText: '刪除會議',
      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById('hamburger-menu').style.display='flex';
          document.querySelector('input[name="name"]').value = info.event.title;
          document.querySelector('input[name="person"]').value = info.event.extendedProps.chinesename;
          document.querySelector('input[name="unit"]').value = info.event.extendedProps.unit;
          document.querySelector('input[name="ext"]').value = info.event.extendedProps.number;
          const startDate = new Date(info.event.start);
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const startHour = String(startDate.getHours()).padStart(2, '0');
          const startMinute = String(startDate.getMinutes()).padStart(2, '0');
          const endDate = new Date(info.event.end);
          const formattedEndDate = startDate.toISOString().split('T')[0];
          const endHour = String(endDate.getHours()).padStart(2, '0');
          const endMinute = String(endDate.getMinutes()).padStart(2, '0');
          document.querySelector('input[name="startdate"]').value = formattedStartDate;
          document.querySelector('select[name="starthour"]').value = startHour;
          document.querySelector('select[name="startminute"]').value = startMinute;
          document.querySelector('input[name="enddate"]').value = formattedEndDate; 
          document.querySelector('select[name="endhour"]').value = endHour; 
          document.querySelector('select[name="endminute"]').value = endMinute;  
          document.getElementById('requestsend').onclick =() => {
            reservationPut(info.event.extendedProps.reserve_id);
          };
        } else if (result.isDenied) {
          // User denied the action or closed the dialog
          Swal.fire({
            title: DOMPurify.sanitize('確定要刪除該會議嗎'),
            icon: "warning",
            confirmButtonText: '確定',
            showCancelButton: true,
            cancelButtonText: '返回' ,
          }).then((result) => {
            if (result.isConfirmed) {
              reservationDelete(info.event.extendedProps.reserve_id);
              Swal.fire({
                title: DOMPurify.sanitize('刪除成功'),
                icon:'success',
              }).then(() => {
                window.location.reload();
              });
            }  
          })
          
        }
          })
        },

});

  calendar.render()
  
})