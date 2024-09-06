
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
    document.getElementById('privilege').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('privilege').style.color= 'white';
})

//換頁面
function changePage(button){
    console.log(button.id);
    location.href = "/page/"+button.id;
}

//權限設置
function setPermission(){
  document.getElementById('popup-privilege').style.display='flex';
}







//違規畫面彈出
function addViolate(element){
  const role=element.getAttribute("data-role"); 
  document.getElementById('popup-violate').style.display='flex';
}


//新增違規
const api_post = 'http://localhost:3000/api/violation';
function postViolation(){
  const form = document.getElementById('violation');
  const formData = new FormData(form);
  const identifier = 'admin';
  const reason = formData.get('reason');
  const remark = formData.get('remark');
  const data={
    identifier:identifier,
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
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

//改權限
const api_put = 'http://localhost:3000/api/user/privilege'
function putPrivilege(){
  const form = document.getElementById('privilege-form');
  const formData = new FormData(form);
  const identifier = '113423004';
  const privilege = formData.get('privilege') === 'true'; 
  const data={
    identifier:identifier,
    privilege: privilege,
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
  })
  .catch(error => {
      console.error('Error:', error);
  });
}


function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

//get user data
async function fetchData(){
  const response = await fetch(`http://localhost:3000/api/user`);
  const result = await response.json();
  if (result && Array.isArray(result.data)){
    
    const data = await Promise.all(result.data.map(async item => {
      const violationCount = await countViolation(item.identifier);
      return [
        item.chinesename,
        item.unit,
        item.privilege_level,
        item.status,
        gridjs.html(`<a href="#" onclick="setPermission(this);" privilege=${item.privilege_level} status=${item.status}>修改</a>`),
        gridjs.html(`${violationCount}次 <a href="#" onclick="addViolate(this);">新增</a> <a href="query1">查詢</a>`)
      ];
    }));
    return data;
  };
}


// 計算違規次數
async function countViolation(identifier){
  const response =await fetch(`http://localhost:3000/api/violation?identifier=${identifier}`)
  const violationResult = await response.json();
  const violationCount = violationResult.data ? violationResult.data.length : 0; 
  return violationCount;
}


//表單生成 grid
document.addEventListener("DOMContentLoaded",function(){
  fetchData().then(data => {

    new gridjs.Grid({
        columns: ['姓名', '單位名稱', '身份權限', '狀態', '權限修改', '違規記點'],
        data:data,
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