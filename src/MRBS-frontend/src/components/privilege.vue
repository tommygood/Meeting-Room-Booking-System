<style scoped>
    .gridjs-search {
        display: none;
    }
</style>
<template>
    <link rel="stylesheet" href="https://unpkg.com/gridjs@6.2.0/dist/theme/mermaid.min.css">
    <!-- 表單 -->
    <user_header :setInfo="setInfo" :info="info"></user_header>
    <div class="test">
        <root_menu :setPageName="setPageName"></root_menu>
        <div>
            <h1 style='margin-left:2%'>
                [ {{ page_name }} ]
            </h1>
            <tr id='table_title' style='display:none;'>
                <td colspan='6'>
                    <div class="search-container">
                        <span class="search-label">關鍵字搜尋 :&nbsp;</span>
                        <input type="text" placeholder="Type a keyword..." id="grid-search" class="gridjs-input"/>
                    </div>
                </td>
            </tr>
            <div id="gridtable"></div>
            <!-- 權限修改視窗 -->
            <div id="popup-privilege" class="popup"> 
                <form id="privilege-form">
                    <div class="popup-content">
                        <h2 class="popup-title">權限修改</h2>
                        <div class="popup-input">
                            <h2 class="title">目前權限 :&nbsp;</h2>
                            <select id="privilegeSelect" class="selector" name="privilege" >
                                <option value='1'>管理者</option>
                                <option value='0'>一般使用者</option>
                            </select>
                        </div>
                        <div class="popup-input">
                            <h2 class="title">目前狀態 :&nbsp;</h2>
                            <select id="actionSelect" class="selector"  name="status">
                                <option value="1">有效</option>
                                <option value="0">無效</option>
                            </select>
                        </div>
                        <div class="bottom-button">
                            <div class="popup-button" style="width:150px" v-on:click="hidePopup('popup-privilege')">
                                <h3 class="hamburger-title" style="color:white">返回</h3>
                            </div>
                            <div class="popup-button" style="width:150px" v-on:click="deleteUser()">
                                <h3 class="hamburger-title" style="color:white">刪除</h3>
                            </div>
                            <div class="popup-button" style="width:150px" v-on:click="putPrivilege()">
                                <h3 class="hamburger-title" style="color:white">確定</h3>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- 違規新增 -->
            <div id="popup-violate" class="popup">
                <form id="violation">
                    <div class="popup-content">
                        <h2 class="popup-title">會議違規紀錄</h2>
                        <div class="popup-input">
                            <h2 class="title">會議選擇 :&nbsp;</h2>
                            <select type="text" id="violation-name" name="reservation_id" >
                            </select>
                        </div>
                        <div class="popup-input">
                            <h2 class="title">違規事項 :&nbsp;</h2>
                            <select type="text" id="violation-input" name="reason" >
                                <option value="未關閉設備">未關閉設備</option>
                                <option value="未復原場地">未復原場地</option>
                                <option value="超時使用會議室"> 超時使用會議室</option>
                                <option value="預約後未使用場地">預約後未使用場地</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <hr/>
                        <h2 class="title">違規備註 :&nbsp;</h2>
                        <textarea id="violationNote" class="large-textarea" name="remark" >無備註</textarea>
                        <div class="bottom-button">
                            <div class="popup-button" style="width:180px" v-on:click="hidePopup('popup-violate')">
                                <h3 class="hamburger-title" style="color:white">返回</h3>
                            </div>
                            <div class="popup-button" style="width:180px" v-on:click="postViolation">
                                <h3 class="hamburger-title" style="color:white">確定</h3>
                            </div> 
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import root_menu from '@/components/rootMenu.vue';
import user_header from '@/components/header.vue';
import config from '@/config';

export default {
    name: 'privilege',
    async mounted() {
        await this.loadCDN(['https://unpkg.com/gridjs@6.2.0/dist/gridjs.umd.js',
            'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
        ])
        this.initTable();
    },
    components: {
        root_menu,
        user_header,
    },
    data() {
        return {
            info: {},
            selectedIdentifier: null,
            selectedName: null,
            table_title: null,
            page_name: null,
        }
    },
    methods: {
        setPageName(val) {
            this.page_name = val;
        },
        setTableTitle(wait_seconds) {
            setTimeout(() => {
                if (this.table_title == null) {
                    this.table_title = document.getElementById('table_title');
                }
                const table_body = document.getElementsByClassName('gridjs-tbody')[0];
                // insert table title after table was rendered
                this.table_title.style.display = '';
                table_body.insertBefore(this.table_title, table_body.firstChild);
                // show the table
                document.getElementsByClassName('gridjs-input')[0].dispatchEvent(new Event('input')); // trigger search event to make the table have the correct style
                document.getElementsByClassName('gridjs-table')[0].style.setProperty('display', 'table', 'important');
                document.getElementsByClassName('gridjs-footer')[0].style.setProperty('display', 'block', 'important');
            }, wait_seconds);
        },
        removeSearchBar() {
            // remove the search bar
            setTimeout(() => {
                console.log('remove search bar');
                document.querySelector('.gridjs-search').style.display = 'none';
            }, 1000);
        },
        async loadCDN(cdn) {
            // load required cdn, and wait for all cdn to be loaded
            await Promise.all(cdn.map(src => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }));
            // remove the search bar
            //this.removeSearchBar();
        },
        setInfo(val) {
            this.info = val;
        },
        setPermission(event){
            document.getElementById('popup-privilege').style.display='flex';
            const id = event.target.id;
            const [identifier, name] = id.split(' ');
            this.selectedIdentifier = String(identifier);
            this.selectedName = name;
        },
        deleteUser(){
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
                    body: JSON.stringify({identifier:this.selectedIdentifier, status: -1}),
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
        },
        fetchevent(start, end){
            const eventApiUrl = (start, end) =>  config.apiUrl + `/reservation?start_time=${start}&end_time=${end}`;
            return fetch(eventApiUrl(start, end),{
                method: 'GET',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
            .then(data => {
                return data; // 返回事件數組
            })
        },
        formatDateTimeForDatabase(dateTime) {
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需要加1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回 'YYYY-MM-DD HH:MM:SS'
        },
        async addViolate(event){
            const identifier = event.target.id;
            const today = new Date(); 

            const threeMonthsAgo = new Date(today); 
            threeMonthsAgo.setMonth(today.getMonth() - 3); 
            today.setHours(23, 59, 59, 999);
            if (threeMonthsAgo.getMonth() > today.getMonth()) {
                threeMonthsAgo.setFullYear(today.getFullYear() - 1);
            }
            const startOfRange = this.formatDateTimeForDatabase(threeMonthsAgo);
            const endOfRange = this.formatDateTimeForDatabase(today);
            const existingEvents = await this.fetchevent(startOfRange,endOfRange);
            const result = existingEvents .data || []; 
            const events = result.filter(event => event.identifier === identifier);
            this.selectedIdentifier = identifier;
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
        },
        postViolation(){
            const api_post = config.apiUrl + '/violation';
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
        },
        putPrivilege(){
            const api_put = config.apiUrl + '/user/privilege';
            const status_put = config.apiUrl + '/user/status';
            const form = document.getElementById('privilege-form');
            const formData = new FormData(form);
            const privileges = (formData.get('privilege')== 1 ? 1 : 0 ); 
            const status = (formData.get('status')== 1 ? 1 : 0); 

            const data={
                identifier:this.selectedIdentifier,
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
                body: JSON.stringify({identifier:this.selectedIdentifier, status: status}),
            })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
            });
        },
        async showViolation(event){
            const identifier = event.target.id;
            const violation_get= config.apiUrl + `/violation`;
            const violation= await fetch(violation_get, 
                {
                    method: 'GET',
                    credentials: 'include', 
                    headers: { 'Content-Type': 'application/json' },
                }
            )
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
                    <p><strong>記錄違規時間：</strong> ${formattedDate} (${dayOfWeek})</p>
                    <p><strong>原因：</strong> ${violation.reason}</p>
                    <p><strong>備註：</strong> ${violation.remark}</p>
                    <button type="button" class="delete-btn" data-id="${violation.violation_id}">刪除</button>
                    <hr>
                    </div>
                `);
                return content;
                }).join('');
                const self = this;
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
                        self.violationDelete(violationId); // 呼叫刪除函數
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
        },
        violationDelete(violation_id){
            const violation_del= config.apiUrl + `/violation`;
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
        },
        hidePopup(popupId) {
            document.getElementById(popupId).style.display = 'none';
        },
        //get user data
        async fetchData() {
            const api = config.apiUrl + '/user';
            const response = await fetch(api, {
                method: 'GET',
                credentials: 'include',
            });
            const result = await response.json();

            if (result && Array.isArray(result.data)) {
                // 過濾掉 status 為 -1 的項目
                const filteredData = result.data.filter(item => item.status !== -1);

                const data = await Promise.all(filteredData.map(async item => {
                const privilegeText = item.privilege_level == 1 ? '管理者' : '一般使用者';
                const statusText = item.status == 1 ? '✔️' : '❌';
                return {
                    data: [
                    item.unit,
                    item.chinesename,
                    privilegeText,
                    statusText,
                    gridjs.html(`<a href="#" class='editPermission' id='${item.identifier} ${item.chinesename}' >修改</a>`),
                    gridjs.html(`${item.violation_count}次 <button class='bind-addViolation fancy' id='${item.identifier}');">新增</button> <button href="#" class="bind-showViolation fancy" id='${item.identifier}'>查詢</button>`)
                    ],
                    extendedProps: {
                    identifier: item.identifier // 將 identifier 作為隱藏數據
                    }
                };
                }));

                // add event listener to onclick buttons
                setInterval(() => {
                    const editPermission = document.querySelectorAll('.editPermission');
                    editPermission.forEach(button => {
                        console.log('set', this.setPermission)
                        button.addEventListener('click', this.setPermission);
                    });
                    const addViolation = document.querySelectorAll('.bind-addViolation');
                    addViolation.forEach(button => {
                        button.addEventListener('click', this.addViolate);
                    });
                    const showViolation = document.querySelectorAll('.bind-showViolation');
                    showViolation.forEach(button => {
                        button.addEventListener('click', this.showViolation);
                    });
                }, 1000);
                return data;
            }
        },
        // 初始化表格
        async initTable() {
            this.fetchData().then(data => {
                new gridjs.Grid({
                    columns: ['單位名稱','姓名',  '身份權限', '狀態', '權限修改', '違規記點'],
                    data: data.map(item => item.data),
                    width:'95%',
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
                        'margin-left':'20px',
                    },
                        table: {
                            border: '3px solid #ccc',
                            'font-size': '16px',
                            'text-align': 'center'
                        },
                        th: {
                            'background-color': ' #3A3937',
                            'color': 'white',
                            'font-size': '18px',
                            'position': 'sticky', // 使標題固定
                            'top': '0', // 固定在表格的頂部
                            'z-index': '1', // 確保標題在最上層
                            'font-weight': 'bold'  ,
                            'border-right': 'none',
                            'border-left': 'none',
                        },
                        td: {
                            'font-size': '18px',
                            'font-weight': 'bold'  ,
                            'border-right': 'none',
                            'border-left': 'none',
                        },
                    },

                }).render(document.getElementById('gridtable'));
                this.setTableTitle(1);
            });
            document.getElementById('grid-search').addEventListener('input', function(event) {
                // 設定 Grid.js 的搜尋文字
                document.querySelector('.gridjs-search .gridjs-input').value = event.target.value;
                // 手動觸發輸入事件
                document.querySelector('.gridjs-search .gridjs-input').dispatchEvent(new Event('input'));
            });
        },
    },
}
</script>
<style>
table {
    width: 100% !important;
}
.test {
    display: flex;
}
button.fancy {
  background: #AAAAAA;
  border-radius: 15px;
  box-shadow: #999999 0 10px 20px -10px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Inter,Helvetica,"Apple Color Emoji","Segoe UI Emoji",NotoColorEmoji,"Noto Color Emoji","Segoe UI Symbol","Android Emoji",EmojiSymbols,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 6px 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
}
</style>
<style scoped>

td {
    padding: 6px 12px;
}

/* 右半邊畫面 */
.search-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 30px;
  margin-top: 10px;
}
.search-label{
    font: 600 20px/1 Inter, Helvetica, Arial, serif;
    color: #000;
}
/* 表格單雙換顏色間隔開*/  
tr:nth-of-type(even) td {
  background: #fff;
}
tr:nth-of-type(odd) td {
  background: #EEE;
}
/* 表格大小 */
.gridjs-wrapper{
  max-height: 88vh;
}





/* 彈出視窗 */
 .popup{
    background: rgba(0, 0, 0,0.6);
    display: none;
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    z-index: 10;
    justify-content: center;
    align-items: center;
  
  }
  .popup-content{
    display: flex;
    flex-direction: column;
    margin: 10px;
    height: fit-content;
    padding-bottom:30px;
    width: 500px;
    background:#FFF ;
    justify-self: center;
    align-items: center;
    border-radius: 30px;

  }
  .bottom-button{
    display: flex;
    flex-direction: row;

  }
  .popup-button{
    margin-left: 3%;
    margin-right:3%;
    margin-top: 20px;
    width: 20%;
    height: 50px;
    background-color: #EEE;
    display: flex;
    justify-content: center;
    align-items: center;
    font: 700 24px/1.2 Inter, Helvetica, Arial, serif;
    background-color:#8F8E8E;
    border-radius: 15px;
  }
  .popup-button:hover{
    background-color:#9F9E9E;
    cursor: pointer;
  }
 .popup-title{
    font: 600 28px/1.2 Inter, Helvetica, Arial, serif;
    color: rgb(105 106 106);
    letter-spacing: 6.3px;
    text-align: center;
  }
 .popup-input{
    display: flex;
    flex-direction: row;
    justify-content: left;
    width:80%;
    margin-top: 15px;
    margin-bottom: 10px;
 }
.title{
    font: 600 28px/1.2 Inter, Helvetica, Arial, serif;
    color: rgb(105 106 106);
    letter-spacing: 6.3px;
    text-align: center;
    margin:0px;
}
.selector{
    width: 90px;
}
.large-textarea {
    width: 70%; 
    height: 80px; 
    padding: 10px; 
    font-size: 16px; 
    resize:none;
  }
.violation-input{
    width: 114.33px;
}



/* 使用者/管理者按鈕 */
.useradmin{
  position:absolute ;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  border:1px black solid;
  width: fit-content;
  height:40px;
  margin-top: 10px;
  margin-left:85%;
}

.useradmin-button{
  width: 40px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;

  background-repeat: no-repeat;
  background-size: cover;
  justify-content: center;
}
.useradmin-button:hover{
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
</style>
<style scoped>
.search-container {
    margin-bottom:1%
}
</style>
