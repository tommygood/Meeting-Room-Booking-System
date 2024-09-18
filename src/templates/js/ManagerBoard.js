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
    document.getElementById('board').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('board').style.color= 'white';
})

//換頁面
function changePage(button){
    location.href = "/page/"+button.id;
} 


function formatDateForMySQL(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


//save board information
const reserve_put=`/api/reservation/`;
function saveContent() {
  const rows = grid.config.data;
  rows.map(row => {
    const checkbox = document.querySelector(`#gridtable input[type="checkbox"][value="${row[4]}"]`);
    // 獲取 checkbox 當前的 checked 狀態
    const checkboxValue = checkbox ? checkbox.checked : false;

    const data = {
      reserve_id: row[4],
      room_id: '1',
      name: row[2],
      ext: row[5],
      start_time: formatDateForMySQL(row[6]),
      end_time: formatDateForMySQL(row[7]),
      show: checkboxValue,
      status:false,
    };
    
    fetch(reserve_put, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    })
    .then(response => response.json());
  });
  alert('預約完成');
  window.location.reload();
}

//get board information
function fetchData(start, end) {
  const api_board = `/api/reservation?start_time=${start}&end_time=${end}`;

  return fetch(api_board, {
    method: 'GET',
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => response.json())
  .then(data => {
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Unexpected data format from API');
    }

    data.data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    const rows = data.data.map(item => {
      const startDate = new Date(item.start_time);
      const endDate = new Date(item.end_time);
      const formattedDate = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}`;
      const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      const formattedTime = `${startTime}~${endTime}`;
    
      return {
        data: [
          formattedDate, 
          formattedTime, 
          item.name,     
          `<input type="checkbox" value="${item.reserve_id}" ${item.show ? 'checked' : ''}>`,
          item.reserve_id, // 在數據中保留 reserve_id
          item.ext,
          item.start_time,
          item.end_time,
        ]
      };
    });

    return rows; 
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    return []; 
  });
}



let grid; 
//render grid
function updateGrid(rows) {
  const gridContainer = document.getElementById('gridtable');
  gridContainer.innerHTML = '';

  grid = new gridjs.Grid({
    columns: [
      '日期', 
      '時間', 
      '會議名稱',  
      {
        name: '顯示',
        formatter: (cell) => gridjs.html(cell)
      }
    ],
    data: rows.map(row => row.data), 
    width: '900px',
    fixedHeader: true,
    search: false,
    resizable: true,
  
    style: {
      container: {
        'margin-left': '20px'
      },
      table: {
        border: '3px solid #ccc',
        'font-size': '16px',
        'text-align': 'center'
      },
      th: {
        'background-color': 'lightgray',
        color: '#333',
        'position': 'sticky',
        'top': '0',
        'z-index': '1',
      },
      td: {}
    },
  }).render(gridContainer);
}

function searchBoard() {
  const startInput = document.querySelector('input[name="startdate"]').value;
  const endInput = document.querySelector('input[name="enddate"]').value;

  if (!startInput || !endInput) {
    alert('請輸入完整的開始和結束日期');
    return;
  }

  const startDate = new Date(startInput);
  startDate.setHours(0, 0, 0, 0); 
  const start = startDate.toISOString().split('.')[0];

  const endDate = new Date(endInput); 
  endDate.setHours(23, 59, 59, 999); 
  const end = endDate.toISOString().split('.')[0];


  fetchData(start, end)
    .then(rows => {
      if (grid) {
        grid.updateConfig({
          data: rows.map(row => row.data) 
        }).forceRender(); 
      } else {
        updateGrid(rows); 
      }
    })
    .catch(error => {
      console.error('Error rendering Grid.js:', error);
    });
}



document.addEventListener("DOMContentLoaded", function() {
  // 設定初始的日期範圍
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); 
  const start = startDate.toISOString().split('.')[0];

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 加一個月
  endDate.setHours(0, 0, 0, 0); 
  const end = endDate.toISOString().split('.')[0];

  // 初始載入時抓取一個月內的資料並更新表格
  fetchData(start, end).then(rows => {

    updateGrid(rows); 
  }).catch(error => {
    console.error('Error rendering Grid.js:', error);
  });
})

