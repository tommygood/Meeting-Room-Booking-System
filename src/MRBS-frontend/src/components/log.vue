<style scoped>
    .gridjs-search {
        display: none;
    }
</style>
<template>
    <link href="https://unpkg.com/gridjs@6.2.0/dist/theme/mermaid.min.css" rel="stylesheet" />
    <user_header :set-info="setInfo" :info="info"></user_header>
    <div class="test">
        <root_menu :set-page-name="setPageName"></root_menu>
        
        <!-- 右邊表格 -->
        <div>
            <h1 style='margin-left:2%'>
            [ {{ page_name }} ]
        </h1>
            <div class="search-container" style="display:inline-flex">
                <span class="search-label" >關鍵字搜尋 ： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <input type="text" placeholder="Type a keyword..." id="grid-search" class="gridjs-input"/>
            </div>
            <button id="download-button" class='fancy' v-on:click="downloadLog" style="margin-left:55%;margin-top:20px;">下載紀錄</button>
            <div id="gridtable"></div>
        </div>
        
    </div>
</template>

<script>
import root_menu from '@/components/rootMenu.vue';
import user_header from '@/components/header.vue';
import config from '@/config';

export default {
    name: 'conference',
    components: {
        root_menu,
        user_header,
    },
    data() {
        return {
            info: {},
            response: [], // global variable for restoring logs.
        }
    },
    async mounted() {
        const cdn = [
            'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
            'https://unpkg.com/gridjs@6.2.0/dist/gridjs.umd.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js'
        ];
        await this.loadCDN(cdn);
        await this.loadLogContent();
        this.removeSearchBar();
        this.showTable();
    },
    methods: {
        showTable() {
            setTimeout(async () => {
                const input_event = new Event('input');
                document.getElementsByClassName('gridjs-table')[0].style.setProperty('display', 'table', 'important');
                document.getElementsByClassName('gridjs-footer')[0].style.setProperty('display', 'block', 'important');
                document.getElementsByClassName('gridjs-input')[0].dispatchEvent(new Event('input'));
            }, 1000);
        },
        findButton(name) {
            const buttons = document.getElementsByTagName('button');
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].title === name) {
                    return buttons[i];
                }
            }
            return null;
        },
        setPageName(val) {
            this.page_name = val;
        },
        removeSearchBar() {
            // remove the search bar
            setTimeout(() => {
                document.querySelector('.gridjs-search').style.display = 'none';
            }, 1000);
        },
        setInfo(val) {
            this.info = val;
        },
        async loadCDN(cdn) {
            // load required cdn, and wait for all cdn to be loaded
            await Promise.all(cdn.map(src => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }));
        },
        // extract the data from object
        extractData(obj) {
            let data = [];
            for (let i = 0; i < obj.length; i++) {
                let temp = [];
                temp.push(obj[i].unit, obj[i].chinesename, obj[i].IP, obj[i].operation_id, obj[i].datetime);
                data.push(temp);
            }
            return data;
        },
        // export log to csv
        downloadLog(){
            // call excelJs
            const workbook = new ExcelJS.Workbook();
            // file name
            const date = new Date();
            const file_name = `MRBS-Logs-${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            const sheet = workbook.addWorksheet(file_name); //在檔案中新增工作表 參數放自訂名稱

            // get the data need to be put in excel
            //const rows = [["test", "單位" , "ip", "操作內容", "時間"]]
            const rows = this.extractData(this.response);

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
        },
        setUrlParams(origin_url, params) {
            // add params to url
            for (const key in params) {
            if (params[key] !== null) {
                origin_url += (origin_url.includes('?') ? '&' : '?') + key + '=' + params[key];
            }
            }
            return origin_url
        },
        async getLog(condition) {
            const api = config.apiUrl + '/log';
            const url = this.setUrlParams(api, condition);
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            this.response = data.data;
        },
        async loadLogContent(){
            await this.getLog({offset : 0, num : 20000, day_limit : 180})
            const data = this.response.map(item => [
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
                    limit: 5,          
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
        },
    },
}
</script>
<style scoped>
.test {
    background-color: white;
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
    max-height: 83vh;
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