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
    console.log(button.id);
    location.href = "/page/"+button.id;
}



//表單生成 grid
document.addEventListener("DOMContentLoaded",function(){
    const grid = new gridjs.Grid({
        columns: [
            '日期', 
            '時間', 
            '會議名稱',  
            {
                name: '顯示',
                formatter: (cell, row) => {
              return gridjs.html(`<input type="checkbox" ${cell ? 'checked' : ''}>`);
                }
            }
        ],
        data: [
          [
            '8/20',
            '08:00~10:00',
            '資料庫測試',
            true,

          ],
          [
            '8/20',
            '11:00~13:00',
            '今天吃什麼',
            false,

          ],
          [
            '8/21',
            '13:00~15:00',
            '資料庫測試',
            true,

          ],
          [
            '8/24',
            '10:00~10:30',
            '資料庫測試',
            true,
          ],
          
          
          // 繼續添加其他行數據
        ],
        width:'900px',
        fixedHeader:true,
        search: true,
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
  });
    