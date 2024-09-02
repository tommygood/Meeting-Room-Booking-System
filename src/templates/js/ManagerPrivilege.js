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
    console.log(account_type);
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
    console.log(button.id);
    location.href = "/page/"+button.id;
}

//權限設置
function setPermission(element){
  const role=element.getAttribute("data-role");  
  const state=element.getAttribute("data-state");
  console.log(role,state);
  document.getElementById('popup-permission').style.display='flex';
}
function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

//新增違規
function addViolate(element){
  const role=element.getAttribute("data-role"); 
  document.getElementById('popup-violate').style.display='flex';

}


//表單生成 grid
document.addEventListener("DOMContentLoaded",function(){
    const grid = new gridjs.Grid({
        columns: ['姓名', '單位名稱', '身份權限', '狀態', '權限修改', '違規記點'],
        data: [
          [
            '王曉明',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="#" onclick=" setPermission(this);" data-role="管理員" data-state="有效">修改</a>'),
            gridjs.html('4次 <a href="#" onclick="addViolate(this);">新增</a> <a href="query1">查詢</a>')
          ],
          [
            '王小美',
            '太空科學與管理研究中心',
            '管理員',
            '✔️',
            gridjs.html('<a href="link2">修改</a>'),
            gridjs.html('0次 <a href="add2">新增</a> <a href="query2">查詢</a>')
          ],
          [
            '張晴明',
            '太空科學與管理研究中心',
            '管理員',
            '✔️',
            gridjs.html('<a href="link3">修改</a>'),
            gridjs.html('0次 <a href="add3">新增</a> <a href="query3">查詢</a>')
          ],
          [
            '張民政',
            '祕書室二樓',
            '一般使用者',
            '❌',
            gridjs.html('<a href="link4">修改</a>'),
            gridjs.html('0次 <a href="add4">新增</a> <a href="query4">查詢</a>')
          ],
          [
            '王曉明',
            '祕書室二樓',
            '一般使用者',
            '✔️',
            gridjs.html('<a href="link1">修改</a>'),
            gridjs.html('4次 <a href="add1">新增</a> <a href="query1">查詢</a>')
          ],
          [
            '王小美',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="link2">修改</a>'),
            gridjs.html('0次 <a href="add2">新增</a> <a href="query2">查詢</a>')
          ],
          [
            '張晴明',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="link3">修改</a>'),
            gridjs.html('0次 <a href="add3">新增</a> <a href="query3">查詢</a>')
          ],
          [
            '王小美',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="link2">修改</a>'),
            gridjs.html('0次 <a href="add2">新增</a> <a href="query2">查詢</a>')
          ],
          [
            '張晴明',
            '太空科學與管理研究中心',
            '管理員',
            '✔️',
            gridjs.html('<a href="link2"">修改</a>'),
            gridjs.html('0次 <a href="add3">新增</a> <a href="query3">查詢</a>')
          ],
          [
            '張民政',
            '祕書室二樓',
            '管理員',
            '❌',
            gridjs.html('<a href="link4">修改</a>'),
            gridjs.html('0次 <a href="add4">新增</a> <a href="query4">查詢</a>')
          ],
          [
            '王曉明',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="link1">修改</a>'),
            gridjs.html('4次 <a href="add1">新增</a> <a href="query1">查詢</a>')
          ],
          [
            '王小美',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="link2">修改</a>'),
            gridjs.html('0次 <a href="add2">新增</a> <a href="query2">查詢</a>')
          ],
          [
            '張晴明',
            '祕書室二樓',
            '管理員',
            '✔️',
            gridjs.html('<a href="#" >修改</a>'),
            gridjs.html('0次 <a href="add3">新增</a> <a href="query3">查詢</a>')
          ],
          
          // 繼續添加其他行數據
        ],
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