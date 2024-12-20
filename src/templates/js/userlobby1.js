let info;

const api_self = '/api/user/self';
async function getUserInfo() {
  try {
    const response = await fetch(api_self, {
      method: 'GET',
      credentials: "include",
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

//get user information & set accountName
async function setUserInfo() {
  try {
    info = await getUserInfo();
    const name = DOMPurify.sanitize(info.chinesename);
    document.getElementById("accountName").innerHTML += name;
    const useradmin = document.getElementById('useradmin');
    try {
      const privilege = info.privilege_level;

      if (privilege != 1) {
        useradmin.style.display = 'none';
      }
    } catch (error) {
      console.error('Error fetching privilege:', error);
    }
  }
  catch (error) {
    console.error("Error:", error);
  }
}
setUserInfo();


//fetch event info from sql
const eventApiUrl = (start, end) => `/api/reservation?start_time=${start}&end_time=${end}`;
function fetchevent(start, end) {
  return fetch(eventApiUrl(start, end), {
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
            unit: item.unit,
            show: item.show,
            number: item.ext
          }
        }));
      } else {
        console.error('Unexpected data format:', result);
      }
    })
}

function toggleMenu() {
  const menu = document.getElementById('hamburger-menu');
  const lobby = document.getElementById('lobby');

  // 切換active狀態來控制菜單顯示或隱藏
  menu.classList.toggle('active');

  // 根據菜單是否隱藏來調整lobby的寬度
  if (menu.classList.contains('active')) {
      lobby.classList.add('full-width');
  } else {
      lobby.classList.remove('full-width');
  }
}

//隱藏彈出視窗
function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}
async function getBlocksAndId() {
  const res = await fetch(`/api/doc?doc_name=use`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
  })
  const data = await res.json();
  return Object.keys(data).length == 0 ? false : {blocks: JSON.parse(data.data.blocks), id_content: JSON.parse(data.data.id_content)};
};



async function showRules() {
  const text = await getBlocksAndId();
  let htmlContent = '';
  text.blocks.forEach(block =>{
    if (block.type === 'paragraph' && block.data && block.data.text) {
      htmlContent += `<p>${block.data.text}</p>`;
    }
    else if (block.type === 'image'){
      console.log(block.data.width);
      htmlContent += `<img src="${block.data.url}" style="width:${block.data.width}">`;
    }
    });
  Swal.fire({
    title: '會議室使用規則',
    html: htmlContent, // 顯示會議室規則，目前排版置中(需修改)
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
async function reservationPost() {

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


  if (!startdate || !enddate || !starthour || !startminute || !endhour || !endminute || !name || !ext) {
    alert('所有欄位都是必填的，請完整填寫表單！');
    return;

  }
  const rulesCheckbox = document.getElementById('checkrule');
  if (!rulesCheckbox.checked) {
    alert('請先勾選「我已詳閱《會議室使用規則》」才能提交申請。');
    return;
  }


  //不能借現在以前的時間&超過三個月
  const today = new Date();
  const reservationDate = new Date(startdate);
  const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));

  const privilege = info.privilege_level;
  if (privilege != 1) {
    if (reservationDate > threeMonthsLater) {
      alert('借閱日期不能超過三個月後，請選擇在三個月內的日期！');
      return;
    }
  }

  const data = {
    name: name,
    room_id: '1',
    start_time: startTimestamp,
    end_time: endTimestamp,
    show: true,
    ext: ext,

  }
  fetch('/api/reservation', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.suc) {
        alert("預約成功");
        window.location.reload();
      }
      else {
        alert(`預約失敗：${data.result}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//編輯會議
async function reservationPut(reserve_id) {
  const formData = new FormData(document.getElementById("requestedit"));
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
      if (data.suc) {
        alert("預約成功");
        window.location.reload();
      }
      else {
        alert(`預約失敗：${data.result}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('發生錯誤，請稍後重試。');
    });
}


//刪除會議
const delete_api = '/api/reservation';
async function reservationDelete(reserve_id) {
  fetch(delete_api, {
    method: 'DELETE',
    credentials: 'include',
    body: JSON.stringify({ reserve_id: reserve_id }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
}


//calendar
document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar")

  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",
    firstDay: 1,
    locale: "zh-tw",
    height: '100vh',
    contentHeight: 700,

    windowResizeDelay: 1,
    displayEventEnd: true,
    fixedWeekCount: false,

    eventOrder: "start",

    dayMaxEventRows: true,
    views: {
      dayGridMonth: {
        dayMaxEventRows: 4 // adjust to 6 only for timeGridWeek/timeGridDay
      }
    },



    //calendar上方按鈕
    headerToolbar: {
      left: "today,dayGridMonth,timeGridWeek,timeGridDay",
      center: "title",
      right: "prev,next",
    },
    buttonText: {
      today: "今天",
      month: "月",
      week: "週",
      day: "天",
    },



    events: function (fetchInfo, successCallback, failureCallback) {
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


    eventClick: function (info) {
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
        title: DOMPurify.sanitize(info.event.title),

        html: DOMPurify.sanitize(`
            ${StartTime} ~ ${EndTime}<br>
            會議：${info.event.title}<br>
            借用單位: ${info.event.extendedProps.unit}<br>
            申請人: ${info.event.extendedProps.chinesename}<br>
            分機號碼: ${info.event.extendedProps.number}<br>
        `),
        confirmButtonText: "OK",
      })
    },
    datesSet: handleDatesSet,
  });
  
  //hamburger-list
  const hamburger = document.getElementById('hamburger-button');
  hamburger.addEventListener('click', () => {
    const menu = document.getElementById('hamburger-menu');
    const lobby = document.getElementById('lobby');

    menu.classList.toggle('active');

    if (menu.classList.contains('active')) {
        lobby.classList.add('full-width');
    } else {
        lobby.classList.remove('full-width');
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);  })
  

  // 左邊「我的會議」視窗
  function handleDatesSet() {
    const start = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const startOfDay = formatDateTimeForDatabase(start);
    const endOfDay = formatDateTimeForDatabase(end);
    fetch(eventApiUrl(startOfDay, endOfDay), {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(result => {
        const events = result.data || [];
        const filteredEvents = events.filter(event => event.identifier === info.identifier);
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
            const date = new Date(event.start_time).toLocaleDateString([], { month: '2-digit', day: '2-digit', weekday: 'short' });

            popup.innerHTML = DOMPurify.sanitize(`
              <div class="list-subtitle">
                ${date} ${startTime} ~ ${endTime}
                <br>
                <div class="list-title">${event.name}</div>
                
              </div>
            `);
            //     <br>
            //     借用單位: ${event.unit}<br>
            //     申請人: ${event.chinesename} &emsp; 分機號碼: ${event.ext}

            //編輯自己的會議
            popup.onclick = () => {
              Swal.fire({
                title: DOMPurify.sanitize(event.name),
                html: DOMPurify.sanitize(`
                ${date} <br>
                ${startTime} ~ ${endTime}<br>
                借用單位: ${event.unit}<br>
                申請人: ${event.chinesename}<br>
                分機號碼: ${event.ext}<br>
            `),
                showCancelButton: true,
                showDenyButton: true,
                cancelButtonText: 'OK',
                confirmButtonText: '編輯會議',
                denyButtonText: '刪除會議',
              }).then((result) => {
                if (result.isConfirmed) {
                  const form = document.getElementById('requestedit');
                  document.getElementById('hamburger-requestpage').style.display = 'none';
                  document.getElementById('hamburger-requestedit').style.display = 'flex';
                  document.getElementById('hamburger-content').style.display = 'none';
                  const startDate = new Date(event.start_time);
                  const formattedStartDate = startDate.toISOString().split('T')[0];
                  const startHour = String(startDate.getHours()).padStart(2, '0');
                  const startMinute = String(startDate.getMinutes()).padStart(2, '0');
                  const endDate = new Date(event.end_time);
                  const formattedEndDate = startDate.toISOString().split('T')[0];
                  const endHour = String(endDate.getHours()).padStart(2, '0');
                  const endMinute = String(endDate.getMinutes()).padStart(2, '0');
                  form.querySelector('input[name="name"]').value = event.name;
                  form.querySelector('input[name="person"]').value = event.chinesename;
                  form.querySelector('input[name="unit"]').value = event.unit;
                  form.querySelector('input[name="ext"]').value = event.ext;
                  form.querySelector('input[name="startdate"]').value = formattedStartDate;
                  form.querySelector('select[name="starthour"]').value = startHour;
                  form.querySelector('select[name="startminute"]').value = startMinute;
                  form.querySelector('input[name="enddate"]').value = formattedEndDate;
                  form.querySelector('select[name="endhour"]').value = endHour;
                  form.querySelector('select[name="endminute"]').value = endMinute;
                  document.getElementById('editbutton').onclick = () => {
                    reservationPut(event.reserve_id);
                  };
                } else if (result.isDenied) {
                  // 刪除會議
                  Swal.fire({
                    title: '確定要刪除該會議嗎',
                    icon: "warning",
                    confirmButtonText: '確定',
                    showCancelButton: true,
                    cancelButtonText: '返回',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      reservationDelete(event.reserve_id);
                      Swal.fire({
                        title: '刪除成功',
                        icon: 'success',
                      }).then(() => {
                        window.location.reload();
                      });
                    }
                  })

                }
              })
            };
            document.querySelector('.hamburger-list').appendChild(popup);
            // document.getElementById('event-list').style.overflow = 'auto';
          });
        }
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }

  calendar.render()

})






//申請換頁
document.addEventListener('DOMContentLoaded', function () {

  const requestbutton = document.getElementById('hamburger-requestbutton');
  requestbutton.addEventListener('click', function () {
    document.getElementById('hamburger-content').style.display = 'none';
    document.getElementById('hamburger-requestpage').style.display = 'flex';
    document.querySelector('input[name="person"]').value = info.chinesename;
    document.querySelector('input[name="unit"]').value = info.unit;
    document.querySelector('input[name="email"]').value = info.email;

  });
})

//enddate跟著startdate變化
document.addEventListener('DOMContentLoaded', function () {
  const startDate = document.getElementById('startdate');
  startDate.addEventListener('change', function () {
    document.getElementById('enddate').value = startDate.value;
  });
})

//申請頁面返回
document.addEventListener('DOMContentLoaded', function () {
  const requestButton = document.getElementById('backbtn');
  requestButton.addEventListener('click', function () {
    document.getElementById('hamburger-content').style.display = 'block';
    document.getElementById('hamburger-requestpage').style.display = 'none';
  });
});

//編輯頁面返回
document.addEventListener('DOMContentLoaded', function () {
  const requestButton = document.getElementById('backbtnedit');
  requestButton.addEventListener('click', function () {
    document.getElementById('hamburger-content').style.display = 'block';
    document.getElementById('hamburger-requestedit').style.display = 'none';
  });
});