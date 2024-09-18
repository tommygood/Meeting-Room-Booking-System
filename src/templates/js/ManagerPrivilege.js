

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

async function setAccountName() {
    var account_type = await getinfo('chinesename');
    account_type = DOMPurify.sanitize(account_type);
    document.getElementById("accountName").innerHTML += account_type;
  }
  setAccountName();


//當頁按鈕變色
document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('privilege').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('privilege').style.color= 'white';
})

//換頁面
function changePage(button){
    location.href = "/page/"+button.id;
}

//權限設置
let selectedIdentifier;
let selectedName;
function setPermission(identifier,name){
  document.getElementById('popup-privilege').style.display='flex';
  selectedIdentifier = String(identifier);
  selectedName = name;
}


//刪除使用者(status設為-1，fetch時候不會顯示status==-1)
function deleteUser(){
  Swal.fire({
    title:`確定要刪除「${selectedName}」？`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', 
    cancelButtonColor: '#3085d6', 
    confirmButtonText: '確定刪除', 
    cancelButtonText: '取消' 
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(status_put,{
        method: 'PUT',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({identifier:selectedIdentifier, status: -1}),
      })
      .then(response => response.json())
      .catch(error => {
          console.error('Error:', error);
      });
      Swal.fire(
        '已刪除！',
        '您的數據已被刪除。',
        'success'
      );

    } else {
      Swal.fire(
        '已取消',
       '您的數據未被刪除。',
        'info' 
      );
    }
  });
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
  .then(data => {
    return data; // 返回事件數組
  })
}

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


//新增違規畫面彈出
async function addViolate(identifier){
  const today = new Date(); 

  const threeMonthsAgo = new Date(today); 
  threeMonthsAgo.setMonth(today.getMonth() - 3); 
  today.setHours(23, 59, 59, 999);
  if (threeMonthsAgo.getMonth() > today.getMonth()) {
    threeMonthsAgo.setFullYear(today.getFullYear() - 1);
  }
  const startOfRange = formatDateTimeForDatabase(threeMonthsAgo);
  const endOfRange = formatDateTimeForDatabase(today);
  const existingEvents = await fetchevent(startOfRange,endOfRange);
  const result = existingEvents .data || []; 
  const events = result.filter(event => event.identifier === identifier);
  selectedIdentifier = identifier;
  document.getElementById('popup-violate').style.display='flex';

  const selectElement = document.getElementById('violation-name');
    selectElement.innerHTML = '';
    // 將過濾後的事件添加為 <select> 的選項
    events.forEach(event => {
      const option = document.createElement('option');
  
      // 將 start_time 轉換為 Date 對象
      const startTime = new Date(event.start_time);
      
      // 格式化為 mm/dd
      const month = String(startTime.getMonth() + 1).padStart(2, '0'); // 月份需要加 1
      const day = String(startTime.getDate()).padStart(2, '0');
      
      // 獲取星期幾
      const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
      const dayOfWeek = daysOfWeek[startTime.getDay()];
      
      // 格式化為 mm/dd (星期幾)
      const formattedDate = `${month}/${day} (${dayOfWeek})`;
      option.value = event.reserve_id;  // 可以根據需要調整 value
      option.textContent = DOMPurify.sanitize(`${formattedDate} ${event.name}`);
      selectElement.appendChild(option);
    });
}


//新增違規
const api_post = '/api/violation';
function postViolation(){
  const form = document.getElementById('violation');
  const formData = new FormData(form);
  const reservation_id = formData.get('reservation_id');
  const reason = formData.get('reason');
  const remark = formData.get('remark');
  const data={
    reserve_id:reservation_id,
    reason:reason,
    remark:remark,
  };
  fetch(api_post,
    {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  ).then(response => response.json())
  .then(result => {
      console.log('Success:', result);
      alert('新增成功！');
      window.location.reload();
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

//改權限&status
const api_put = '/api/user/privilege';
const status_put = '/api/user/status';
function putPrivilege(){
  const form = document.getElementById('privilege-form');
  const formData = new FormData(form);
  const privileges = (formData.get('privilege')== 1 ? 1 : 0 ); 
  const status = (formData.get('status')== 1 ? 1 : 0); 

  const data={
    identifier:selectedIdentifier,
    privileges: privileges,
  }
  fetch(api_put,{
    method: 'PUT',
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
  .then(result => {
      console.log('Success:', result);
      alert('修改成功！');
      window.location.reload();
  })
  .catch(error => {
      console.error('Error:', error);
  });


  fetch(status_put,{
    method: 'PUT',
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({identifier:selectedIdentifier, status: status}),
  })
  .then(response => response.json())
  .catch(error => {
      console.error('Error:', error);
  });
}

const violation_get=`/api/violation`;
async function showViolation(identifier){
  const violation= await fetch(violation_get)
  .then(response => response.json())
  .then(result =>{
    const violation = result.data || []; 
    const violationList = violation.filter(violation => violation.identifier === identifier);
    console.log(violationList);
    return violationList;
  });
  if (violation.length > 0) {
    const violationHtml = violation.map(violation => {
      const date = new Date(violation.datetime);
      // 獲取格式化的日期和時間
      const formattedDate = date.toLocaleString().split(' ')[0];
    
      // 獲取星期幾
      const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
      const dayOfWeek = `${daysOfWeek[date.getDay()]}`;
    
      const content= DOMPurify.sanitize(`
        <div >
          <p><strong>違規時間：</strong> ${formattedDate} (${dayOfWeek})</p>
          <p><strong>原因：</strong> ${violation.reason}</p>
          <p><strong>備註：</strong> ${violation.remark}</p>
          <button type="button" class="delete-btn" data-id="${violation.violation_id}">刪除</button>
          <hr>
        </div>
      `);
      return content;
    }).join('');
      //刪除還沒寫
    Swal.fire({
      title: DOMPurify.sanitize("違規紀錄"),
      html: violationHtml,
      confirmButtonText: 'OK',
      width: '600px', 
      customClass: {
        popup: 'swal-wide', 
      },
      didOpen: () => {
        // 動態綁定刪除按鈕的點擊事件
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
          button.addEventListener('click', function() {
            const violationId = this.getAttribute('data-id');
            violationDelete(violationId); // 呼叫刪除函數
          });
        });
      }
    });
  } else {
    Swal.fire({
      title: DOMPurify.sanitize('沒有違規記錄'),
      text: DOMPurify.sanitize('該用戶沒有違規記錄。'),
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }
}

const violation_del=`/api/violation`;
function violationDelete(violation_id){
  try{

    fetch(violation_del,{
      method: 'DELETE',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({violation_id: violation_id}),
    })
    .then(response => response.json())
    .then(data=>{
      if(data.suc){
        alert("刪除完成");
        window.location.reload();
      }
      else{
        alert("刪除失敗");
      }
    });
  } catch(error){
    console.error('Error:', error);
  }
}




//關閉視窗
function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}
//get user data
async function fetchData() {
  const response = await fetch(`/api/user`);
  const result = await response.json();

  if (result && Array.isArray(result.data)) {
    // 過濾掉 status 為 -1 的項目
    const filteredData = result.data.filter(item => item.status !== -1);

    const data = await Promise.all(filteredData.map(async item => {
      const privilegeText = item.privilege_level == 1 ? '管理者' : '一般使用者';
      const statusText = item.status == 1 ? '✔️' : '❌';
      return {
        data: [
          item.chinesename,
          item.unit,
          privilegeText,
          statusText,
          gridjs.html(`<a href="#" onclick="setPermission('${item.identifier}','${item.chinesename}');" >修改</a>`),
          gridjs.html(`${item.violation_count}次 <a href="#" onclick="addViolate('${item.identifier}');">新增</a> <a href="#" onclick="showViolation('${item.identifier}')">查詢</a>`)
        ],
        extendedProps: {
          identifier: item.identifier // 將 identifier 作為隱藏數據
        }
      };
    }));
    return data;
  }
}


//表單生成 grid
document.addEventListener("DOMContentLoaded",function(){
  fetchData().then(data => {

    new gridjs.Grid({
        columns: ['姓名', '單位名稱', '身份權限', '狀態', '權限修改', '違規記點'],
        data: data.map(item => item.data),
        width:'1200px',
        fixedHeader:true,
        search: true,
        sort: true,
        resizable: true,
        style: {
            container:{
              'margin-left':'20px'
            },
            table: {
              border: '3px solid #ccc',
              'font-size': '16px',
              'text-align': 'center'
            },
            th: {
                'background-color': 'lightgray',
                color: '#333',
                'position': 'sticky', // 使標題固定
                'top': '0', // 固定在表格的頂部
                'z-index': '1', // 確保標題在最上層
              },
            td: {

            },
          
        }

    }).render(document.getElementById('gridtable'));

     document.getElementById('grid-search').addEventListener('input', function(event) {
      // 設定 Grid.js 的搜尋文字
      document.querySelector('.gridjs-search .gridjs-input').value = event.target.value;
      // 手動觸發輸入事件
      document.querySelector('.gridjs-search .gridjs-input').dispatchEvent(new Event('input'));
     });
  });


});
