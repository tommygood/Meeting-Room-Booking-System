
let privilege;
const api_info = 'http://localhost:3000/api/info/';
//抓資訊到申請頁面的資料
async function fetchUserInfo(identifier) {
  try {
    const response = await fetch('http://localhost:3000/api/user');
    const result = await response.json();

    if (result && Array.isArray(result.data)) {
      const user = result.data.find(item => item.identifier === identifier);
      
      if (user) {
        document.querySelector('input[name="person"]').value = user.chinesename || '';
        document.querySelector('input[name="unit"]').value = user.unit || '';
        document.querySelector('input[name="phone"]').value = user.mobilePhone || '';
        document.querySelector('input[name="email"]').value = user.email || '';
        privilege=user.privilege_level;
        if(privilege!=1){
          document.getElementById('useradmin').style.display = 'none';
        }
      } 
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}


// 在頁面加載後自動調用 fetchUserInfo
document.addEventListener("DOMContentLoaded", function() {
  fetchUserInfo('113423004');
});


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


async function reservationPost(){
  
  const form = document.getElementById('request');
  const formData = new FormData(form);
  const date=formData.get('date');
  const name = formData.get('name');
  const starthour = formData.get('starthour');
  const startminute = formData.get('startminute');
  const endhour = formData.get('endhour');
  const endminute = formData.get('endminute');
  const ext = formData.get('ext');
  const startTimestamp = formatDateTimeForDatabase(`${date}T${starthour}:${startminute}:00`);
  const endTimestamp = formatDateTimeForDatabase(`${date}T${endhour}:${endminute}:00`);
  const startOfDay = formatDateTimeForDatabase(`${date}T00:00:00`);
  const endOfDay = formatDateTimeForDatabase(`${date}T23:59:59`);
  const existingEvents = await fetchevent(startOfDay, endOfDay);


  if (!date || !starthour || !startminute || !endhour || !endminute || !name || !ext) {
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
  const reservationDate = new Date(date);
  const today = new Date();
  console.log(startTimestamp);
  console.log(today);
  if(new Date(startTimestamp )<=today){
    alert('預約時間請選在現在後的時間！');
    return;
  }

  const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));
  if(privilege!=1){
    if (reservationDate > threeMonthsLater) {
      alert('借閱日期不能超過三個月後，請選擇在三個月內的日期！');
      return;
    }
  }

  // 檢查新預約是否與現有事件有時間衝突
  const hasConflict = existingEvents.some(event => {
    const existingStart = new Date(event.start);
    const existingEnd = new Date(event.end);
    return (new Date(startTimestamp) < existingEnd && new Date(endTimestamp) > existingStart);
  });
  if (hasConflict) {
    alert('該時間段已被預約，請選擇其他時間。');
    return;
  }

  const data={
    //目前寫死的
      identifier:'113423004',
      name:name,
      room_id:'1',
      start_time:startTimestamp,
      end_time:endTimestamp,
      show:true,
      ext: ext,
      
  }
  fetch('http://localhost:3000/api/reservation', {
    method: 'POST',
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }) 
  .then(response => response.json())
  .then(result => {
      console.log('Success:', result);
      alert('預約成功！');
  })
  .catch(error => {
      console.error('Error:', error);
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
     document.querySelector('.hamburger-list').appendChild(popup);
   });
 }}
 
}

  // 點日期彈出視窗
calendar.on('dateClick', function(info) {
  handleDateClick(info);
});

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

