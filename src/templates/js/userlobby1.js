let identifier;
// let privilege;
let info;
const api_info = '/api/info/';
  // get user info from ncu portal
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

const api_self = '/api/user/self';
async function getUserInfo(){
  try {
    const response = await fetch(api_self,{
      method: 'GET',
      credentials: "include",
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function setUserInfo(){
  try{
    info = await getUserInfo();
    console.log(info);
  }
  catch (error) {
    console.error("Error:", error);
  }
}

setUserInfo();

async function setAccountName() {
    const account_type = await getinfo('chinesename');
    document.getElementById("accountName").innerHTML += account_type;
  }
setAccountName();

//拿identifier
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    
  }).join(''));
  return JSON.parse(jsonPayload);
}
function getIdentifier(){
  try {
    var token = document.cookie.split('token=')[1];
    if (token) {
        identifier=parseJwt(token); 

    } else {
        console.error('Token not found in cookies.');
    }
} catch (error) {
    console.error('Error parsing JWT:', error);
}
}
getIdentifier();



//拿privilege_level
async function getPrivilege() {
  const response = await fetch("/api/user/privilege");
  const data = await response.json();
  const privilege_level = data.data;
  console.log(privilege_level);
  return privilege_level;
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
          number: item.ext
        }
      }));
    } else {
      console.error('Unexpected data format:', result); 
    }
  })}



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

//上傳預約
async function reservationPost(){
  
  const form = document.getElementById('request');
  const formData = new FormData(form);
  const name = formData.get('name');
  const startdate = formData.get('startdate'); 
  const starthour = formData.get('starthour');
  const startminute = formData.get('startminute');
  const enddate = formData.get('enddate');  
  const endhour = formData.get('endhour');
  const endminute = formData.get('endminute');
  const ext = formData.get('ext');
  const startTimestamp = formatDateTimeForDatabase(`${startdate}T${starthour}:${startminute}:00`);
  const endTimestamp = formatDateTimeForDatabase(`${enddate}T${endhour}:${endminute}:00`);
  const startOfDay = formatDateTimeForDatabase(`${startdate}T00:00:00`);
  const endOfDay = formatDateTimeForDatabase(`${enddate}T23:59:59`);
  const existingEvents = await fetchevent(startOfDay, endOfDay);

  if (!startdate || !enddate || !starthour || !startminute || !endhour || !endminute || !name || !ext) {
    alert('所有欄位都是必填的，請完整填寫表單！');
    return; 

  }
  const rulesCheckbox = document.getElementById('checkrule');
  if (!rulesCheckbox.checked) {
      alert('請先勾選「我已詳閱《會議室使用規則》」才能提交申請。');
      return; 
  }
  if (startTimestamp >= endTimestamp) {
    alert('開始時間不能晚於或等於結束時間，請修正時間！');
    return; 
  }

    //不能借現在以前的時間&超過三個月
  const today = new Date();
  if(new Date(startTimestamp )<=today){
    alert('預約時間請選在現在後的時間！');
    return;
  }
  const reservationDate = new Date(startdate);
  const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));

  const privilege = getPrivilege();
  if(privilege!=1){
    if (reservationDate > threeMonthsLater) {
      alert('借閱日期不能超過三個月後，請選擇在三個月內的日期！');
      return;
    }
  }

  // 檢查新預約是否與現有事件有時間衝突
  // 檢查新預約是否與現有事件有時間衝突
  const hasConflict = existingEvents.some(event => {
    const existingStart = new Date(event.start);
    const existingEnd = new Date(event.end);

    // 檢查新事件是否與現有事件重疊
    // 包括現有事件跨日情況，且覆蓋到新事件日期
    return (new Date(startTimestamp) < existingEnd && new Date(endTimestamp) > existingStart);
  });

  if (hasConflict) {
    alert('該時間段已被預約，請選擇其他時間。');
    return true;
  }

  const data={
      name:name,
      room_id:'1',
      start_time:startTimestamp,
      end_time:endTimestamp,
      show:true,
      ext: ext,
      
  }
  fetch('/api/reservation', {
    method: 'POST',
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }) 
  .then(response => response.json())
  .then(result => {
      console.log('Success:', result);
      alert('預約成功！');
      window.location.reload();

  })
  .catch(error => {
      console.error('Error:', error);
  });
}

//刪除會議
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




//calendar
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
      const StartTime = info.event.start.toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        weekday: 'short'
    });
    const EndTime = info.event.end.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short'
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
        confirmButtonText: "OK",
      })
    },
    datesSet: handleDatesSet, 
});



// 左邊「我的會議」視窗
function handleDatesSet(){
  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);
  start.setHours(0, 0, 0, 0); 
  end.setHours(23, 59, 59, 999); 
  const startOfDay = formatDateTimeForDatabase(start);
  const endOfDay = formatDateTimeForDatabase(end);
  fetch(eventApiUrl(startOfDay, endOfDay),{
    method: 'GET',
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then(result => {
    const events = result.data || []; 
    const filteredEvents = events.filter(event => event.identifier === identifier.data);
    filteredEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    if (filteredEvents.length > 0) {
      document.querySelector('.hamburger-list').innerHTML = '';
      //顯示每個自己的會議
      filteredEvents.forEach(event => {
        const popup = document.createElement('div');
        popup.className = 'list-content_box';
        popup.style.display = 'flex';
        const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = new Date(event.start_time).toLocaleDateString([], { month: '2-digit', day: '2-digit' ,weekday:'short'});

        popup.innerHTML = `
          <h3 class="list-subtitle">
            ${date} <br>
            ${startTime} ~ ${endTime}<br>
            會議：${event.name}<br>
            借用單位: ${event.unit}<br>
            發起人: ${event.chinesename}<br>
            分機號碼: ${event.ext}<br>
          </h3>
          <hr>
        `;

        //編輯自己的會議
        popup.onclick = () => {
          Swal.fire({
            title: event.name,
            html: `
                ${date} <br>
                ${startTime} ~ ${endTime}<br>
                借用單位: ${event.unit}<br>
                申請人: ${event.chinesename}<br>
                分機號碼: ${event.ext}<br>
            `,
            showCancelButton: true,
            showDenyButton: true,
            cancelButtonText: 'OK' ,
            confirmButtonText: '編輯會議',
            denyButtonText: '刪除會議',
            }).then((result) => {
              if (result.isConfirmed) {
                document.getElementById('hamburger-requestpage').style.display='flex';
                document.getElementById('hamburger-content').style.display='none';
                document.querySelector('input[name="name"]').value = event.name;
                document.querySelector('input[name="person"]').value = event.chinesename;
                document.querySelector('input[name="unit"]').value = event.unit;
                document.querySelector('input[name="ext"]').value = event.ext;
                const startDate = new Date(event.start_time);
                document.querySelector('input[name="date"]').value = startDate.toISOString().split('T')[0]; // 只取日期部分        
                const startHour = String(startDate.getHours()).padStart(2, '0');
                const startMinute = String(startDate.getMinutes()).padStart(2, '0');
                document.querySelector('select[name="starthour"]').value = startHour;
                document.querySelector('select[name="startminute"]').value = startMinute;
      
                const endDate = new Date(event.end_time);
                const endHour = String(endDate.getHours()).padStart(2, '0');
                const endMinute = String(endDate.getMinutes()).padStart(2, '0');
                document.querySelector('select[name="endhour"]').value = endHour;
                document.querySelector('select[name="endminute"]').value = endMinute;  
                //還沒寫完
                document.getElementById('requestsend').onclick = reservationPut;

              } else if (result.isDenied) {
                // 刪除會議
                Swal.fire({
                  title: '確定要刪除該會議嗎',
                  icon: "warning",
                  confirmButtonText: '確定',
                  showCancelButton: true,
                  cancelButtonText: '返回' ,
                }).then((result) => {
                  if (result.isConfirmed) {
                    reservationDelete(event.reserve_id);
                    Swal.fire({
                      title: '刪除成功',
                      icon:'success',
                    }).then(() => {
                      window.location.reload();
                    });
                  }  
                })
                
              }
                })
        };
        document.querySelector('.hamburger-list').appendChild(popup);
        document.getElementById('event-list').style.overflow = 'scroll';
      });
    } 
  })
  .catch(error => {
    console.error('Error fetching events:', error);
  });
}

  calendar.render()
  
})



// 漢堡選單
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger-button');
  const lobby = document.getElementById('lobby');
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
      document.querySelector('input[name="person"]').value = info.chinesename;
      document.querySelector('input[name="unit"]').value = info.unit;
      document.querySelector('input[name="phone"]').value = info.mobilePhone;
      document.querySelector('input[name="email"]').value = info.email;

    });
})

//enddate跟著startdate變化
document.addEventListener('DOMContentLoaded', function() {
  const startDate = document.getElementById('startdate');
  startDate.addEventListener('change', function() {
    document.getElementById('enddate').value = startDate.value;
  });
})

document.addEventListener('DOMContentLoaded', function() {
  const requestButton = document.getElementById('backbtn');
  requestButton.addEventListener('click', function() {
    document.getElementById('hamburger-content').style.display = 'block';
    document.getElementById('hamburger-requestpage').style.display = 'none';
  });
});






// 顯示使用者/管理者
document.addEventListener('DOMContentLoaded', async function() {
  const useradmin = document.getElementById('useradmin');
  try {
    const privilege = await getPrivilege(); 

    if (privilege != 1) {
      useradmin.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching privilege:', error);
  }
});