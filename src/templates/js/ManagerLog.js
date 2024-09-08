// get user info from ncu portal
const api = 'http://localhost:3000/api/';
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

function setUrlParams(origin_url, params) {
    const url = new URL(origin_url);
    for (const key in params) {
        url.searchParams.set(key, params[key]);
    }
    return url.href;
}

async function getLog(condition) {
  const url = setUrlParams(api+'log', condition);
  const res = await axios.get(url);
  return res.data.data;
}

async function setAccountName() {
    const account_type = await getinfo('chinesename');
    document.getElementById("accountName").innerHTML += account_type;
}
setAccountName();

//當頁按鈕變色
document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('log').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('log').style.color= 'white';
})

//換頁面
function changePage(button){
    console.log(button.id);
    location.href = "/page/"+button.id;
}


//表單生成 grid
document.addEventListener("DOMContentLoaded", async function(){
    const response = await getLog({offset : 0, num : 10});
    console.log(response);
    const data = response.map(item => [
      item.identifier,
      item.IP,
      item.operation_id,
      new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short' 
      }).format(new Date(item.datetime))
    ]);
    new gridjs.Grid({
        columns: ['姓名', 'ip', '操作內容', '操作時間'],
        data: data,
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
    