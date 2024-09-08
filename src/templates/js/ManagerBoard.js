const api_info = 'http://localhost:3000/api/info/';

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
    const account_type = await getinfo('chinesename');
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


//抓Board 資料
function fetchData() {
  const date = new Date();
  date.setHours(0, 0, 0, 0); 
  const today = date.toISOString().split('.')[0];

  const date2 = new Date();
  date2.setDate(date2.getDate() + 7); 
  date2.setHours(0, 0, 0, 0); 
  const nextSevenDay = date2.toISOString().split('.')[0];

  const api_board = `http://localhost:3000/api/reservation?start_time=${today}&end_time=${nextSevenDay}`;

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

    const rows = data.data.map(item => {
      const startDate = new Date(item.start_time);
      const endDate = new Date(item.end_time);

      // mm/dd
      const formattedDate = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}`;
      
      //  hh:ss~hh:ss
      const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      const formattedTime = `${startTime}~${endTime}`;

      return {
        reserve_id: item.reserve_id, 
        data: [
          formattedDate, 
          formattedTime, 
          item.name,     
          item.show        
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

function saveContent(){

}



// 表單生成 grid
document.addEventListener("DOMContentLoaded", function() {
  fetchData().then(rows => {
    console.log(rows); 
    new gridjs.Grid({
      columns: [
        '日期', 
        '時間', 
        '會議名稱',  
        {
          name: '顯示',
          formatter: (cell) => {
            return gridjs.html(`<input type="checkbox" ${cell ? 'checked' : ''}>`);
          }
        }
      ],
      data: rows.map(row => row.data), 
      width: '900px',
      fixedHeader: true,
      search: true,
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
          'position': 'sticky', // 使標題固定
          'top': '0', // 固定在表格的頂部
          'z-index': '1', // 確保標題在最上層
        },
        td: {}
      },
      rowClick: (row, rowData) => {
        const reserve_id = rows[row.index].reserve_id; // 獲取 reserve_id
        console.log('Reserve ID:', reserve_id);
        // 在這裡執行基於 reserve_id 的操作
      }
    }).render(document.getElementById('gridtable'));
  }).catch(error => {
    console.error('Error rendering Grid.js:', error);
  });
});

