// get user info from ncu portal
const api = '/api/';
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
function setUrlParams(origin_url, params) {
    // add params to url
    for (const key in params) {
      if (params[key] !== null) {
        origin_url += (origin_url.includes('?') ? '&' : '?') + key + '=' + params[key];
      }
    }
    return origin_url
}

async function getLog(condition) {
  const url = setUrlParams(api+'log', condition);
  const res = await axios.get(url);
  return res.data.data;
}

async function setAccountName() {
    var account_type = await getinfo('chinesename');
    account_type = DOMPurify.sanitize(account_type);
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
    location.href = "/page/"+button.id;
}

// extract the data from object
function extractData(obj) {
  let data = [];
  for (let i = 0; i < obj.length; i++) {
    let temp = [];
    temp.push(obj[i].unit, obj[i].chinesename, obj[i].IP, obj[i].operation_id, obj[i].datetime);
    data.push(temp);
  }
  return data;
}

// export log to csv
function downloadLog(){
    // call excelJs
    const workbook = new ExcelJS.Workbook();
    // file name
    const date = new Date();
    const file_name = `MRBS-Logs-${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    const sheet = workbook.addWorksheet(file_name); //在檔案中新增工作表 參數放自訂名稱

    // get the data need to be put in excel
    //const rows = [["test", "單位" , "ip", "操作內容", "時間"]]
    const rows = extractData(response);

    sheet.addTable({
      // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
      name: "總表", // 表格內看不到的，算是key值，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
      ref: "A1", // 從A1開始
      columns: [{ name: "單位" }, { name: "姓名" }, { name: "ip" }, {name : "操作內容"}, {name : "時間"}],
      rows: rows
    });

    // 表格裡面的資料都填寫完成之後，訂出下載的callback function
    // 異步的等待他處理完之後，創建url與連結，觸發下載
    workbook.xlsx.writeBuffer().then((content) => {
      const link = document.createElement("a");
      const blobData = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;"
      });
      link.download = file_name + ".xlsx";
      link.href = URL.createObjectURL(blobData);
      link.click();
    });
}

let response; // global variable for restoring logs.
//表單生成 grid
document.addEventListener("DOMContentLoaded", async function(){
    response = await getLog({offset : 0, num : 20000, day_limit : 180})
    const data = response.map(item => [
      item.unit,
      item.chinesename,
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
        columns: ['單位', '姓名', 'ip', '操作內容', '操作時間'],
        data: data,
        width:'1200px',
        fixedHeader:true,
        search: true,
        sort: true,
        resizable: true,
        pagination: {
          enabled: true,     
          limit: 20,          
          summary: true,     
        },
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

          
        }

    }).render(document.getElementById('gridtable'));
    
    document.getElementById('grid-search').addEventListener('input', function(event) {
    // 設定 Grid.js 的搜尋文字
    document.querySelector('.gridjs-search .gridjs-input').value = event.target.value;
    // 手動觸發輸入事件
    document.querySelector('.gridjs-search .gridjs-input').dispatchEvent(new Event('input'));
     });
  }
);
    