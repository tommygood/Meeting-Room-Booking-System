<template>
    <user_header :set-info="setInfo" :info="info"></user_header>
    <div class="test">
        <root_menu :setPageName="setPageName"></root_menu>
        <!-- 看板預覽/播放 -->
        <div style='display:flex;flex-direction: column;width:85%'>
            <h1 style='margin-left:2%'>
                [ {{ page_name }} ]
            </h1>
            <div style="font-size: 20px; outline: 3px solid #000000; background-color: #cacaca; margin: 10px; padding: 10px;">
                <form id="previewBoard" style='display:inline-flex'>
                    <div class="input-group">
                        <b>日期：</b>
                        <input type="date" class="hamburger-request" name="start-date"/>
                    </div>
                    <div class="input-group">
                        <b>時間：</b>
                        <input type="time" id="start-time" name="start-time" class="hamburger-timerequest">
                    </div>
                </form>
                <div style='display:inline-flex'>
                    <button id="board/preview" class="btn" v-on:click="previewBoard">未來預覽</button>
                </div>
                <button style='display:inline-flex' id="board/demo" class="btn" v-on:click="changePage">
                    當前播放
                </button>
            </div>
            <div class ="inputdate">
                <tr id='table_header' style='display:none;'>
                    <td>會議日期</td>
                    <td>會議時間</td>
                    <td>會議名稱</td>
                    <td>是否顯示</td>
                </tr>
                <tr id='table_title' style='display:none;'>
                    <td>
                        <input type="date" name="startdate" placeholder="開始時間" style="width:100px" />
                    </td>
                    <td>
                        <input type="date" name="enddate" placeholder="結束時間" style="width:100px"/> 
                    </td>
                    <td>
                        <input type="text" placeholder="Type a keyword..." id="grid-search" class="gridjs-input"/>
                    </td>
                    <td>
                        <button v-on:click="searchBoard">
                            篩選
                        </button>
                        <button v-on:click="saveContent">
                            儲存
                        </button>
                    </td>
                </tr>
            </div>
            <div id="gridtable"></div>
        </div>
    </div>
</template>
<script>
import root_menu from '@/components/rootMenu.vue';
import user_header from '@/components/header.vue';
import config from '@/config';

export default {
    name: 'board',
    components: {
        root_menu,
        user_header,
    },
    async mounted() {
        const cdn = ['https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js'
        ];
        await this.loadCDN(cdn);
        this.initTable();
        this.setTableTitle(1000);
        this.syncSearchBar();
        this.removeSearchBar();
    },
    data() {
        return {
            info: {},
            grid: null,
            table_title: null,
        }
    },
    methods: {
        setPageName(val) {
            this.page_name = val;
        },
        removeSearchBar() {
            // remove the search bar
            setTimeout(() => {
                console.log('remove search bar');
                //document.querySelector('.gridjs-search').style.display = 'none';
            }, 1000);
        },
        syncSearchBar() {
            document.getElementById('grid-search').addEventListener('input', function(event) {
                // 設定 Grid.js 的搜尋文字
                document.querySelector('.gridjs-search .gridjs-input').value = event.target.value;
                // 手動觸發輸入事件
                document.querySelector('.gridjs-search .gridjs-input').dispatchEvent(new Event('input'));
            });
        },
        setInfo(val) {
            this.info = val;
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
                // replace the original header of search bar 
                const origin_header = document.getElementsByClassName('gridjs-thead')[0];
                origin_header.style.display = 'none';
                const new_header = document.getElementById('table_header');
                table_body.insertBefore(new_header, table_body.firstChild);
                new_header.style.display = '';
                // show the table
                document.getElementsByClassName('gridjs-input')[0].dispatchEvent(new Event('input')); // trigger search event to make the table have the correct style
                document.getElementsByClassName('gridjs-table')[0].style.setProperty('display', 'table', 'important');
                document.getElementsByClassName('gridjs-footer')[0].style.setProperty('display', 'block', 'important');
            }, wait_seconds);
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
            
        },
        formatDateForMySQL(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');  
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        saveContent() {
            const reserve_put= config.apiUrl + `/reservation/`;
            const rows = this.grid.config.data;
            rows.map(row => {

                const checkbox = document.querySelector(`#gridtable input[type="checkbox"][value="${row[4]}"]`);
                // 獲取 checkbox 當前的 checked 狀態
                const checkboxValue = checkbox ? checkbox.checked : false;

                const data = {
                reserve_id: row[4],
                room_id: '1',
                name: row[2],
                ext: row[5],
                start_time: this.formatDateForMySQL(row[6]),
                end_time: this.formatDateForMySQL(row[7]),
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
            alert('預約成功');
            window.location.reload();
        },
        //get board information
        fetchData(start, end) {
            const api_board = config.apiUrl + `/reservation?start_time=${start}&end_time=${end}`;

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
        },
        //render grid
        updateGrid(rows) {
            const gridContainer = document.getElementById('gridtable');
            gridContainer.innerHTML = '';

            this.grid = new gridjs.Grid({
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
                width: '98%',
                fixedHeader: true,
                search: true,
                resizable: true,
                pagination: {
                    enabled: true,     
                    limit: 5,          
                    summary: true,     
                },
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
        },
        searchBoard() {
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


            this.fetchData(start, end)
            .then(rows => {
            if (this.grid) {
                this.grid.updateConfig({
                data: rows.map(row => row.data) 
                }).forceRender(); 
            } else {
                this.updateGrid(rows); 
            }
            })
            .catch(error => {
                console.error('Error rendering Grid.js:', error);
            });
            this.setTableTitle(1000);
            this.removeSearchBar();
        },
        initTable() {
            // 設定初始的日期範圍
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0); 
            const start = startDate.toISOString().split('.')[0];

            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // 加一個月
            endDate.setHours(0, 0, 0, 0); 
            const end = endDate.toISOString().split('.')[0];

            // 初始載入時抓取一個月內的資料並更新表格
            this.fetchData(start, end).then(rows => {

                this.updateGrid(rows); 
            }).catch(error => {
                console.error('Error rendering Grid.js:', error);
            });
        },
        // 跳轉預覽看板頁面
        previewBoard(){
            const formData = new FormData(document.getElementById("previewBoard"));
            const date = formData.get('start-date');
            const time = formData.get('start-time');
            if (date && time) {
                // 將選定的日期和時間拼接成查詢參數
                const queryString = `?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;
                window.open(`/board/preview${queryString}`, '_blank');
            } else {
                alert('請選擇日期和時間');
            }
        },
        changePage(event){
            const button = event.target;
            window.open("/"+button.id, '_blank');
        },
    }
}
</script>
<style>
.gridjs-table {
    display: none !important;
}
.gridjs-search {
    display: none !important;
}
.gridjs-footer {
    display: none !important;
}
</style>
<style scoped>
table, th, td {
  border: 1px solid !important;
  border-collapse: collapse !important;
}
.gridjs-wrapper{
  max-height: 90vh;
}

button {
    background-color: #8F8E8E;
    color: #fff;
}
.inputdate{
  display:flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.button{
    display:flex;
    align-items: center;
    justify-content: center;
    background-color: #8F8E8E;
    border-radius: 10px;
    width: 10%;
    height: 10%;
    cursor: pointer;
    z-index: 10;
}
button:hover{
    background-color:#9F9E9E;
    cursor: pointer; 
}
.buttontext{
    font: 700 24px/1.2 Inter, Helvetica, Arial, serif;
    color: #fff;
}

.btn {
    font: bold 15px/1.2 Inter, Helvetica, Arial, serif;
    letter-spacing: 6.3px;
    background: #b28080;
    width: fit-content;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    padding: 5px 10px;
}

.btn:hover {
    background-color: #b46969;
    cursor: pointer;
}

  /* 使用者/管理者按鈕 */
  .useradmin{
    /*position:absolute ;*/
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