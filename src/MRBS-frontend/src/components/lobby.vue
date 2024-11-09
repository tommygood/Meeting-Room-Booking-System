<template>
    <body>
        <user_header :setInfo="setInfo" :info="info"></user_header>
        <div class="content">
            <application :info="info" :formatDateTimeForDatabase="formatDateTimeForDatabase" :is_admin="false"></application>
            <calendar :eventApiUrl="eventApiUrl" :info="info"></calendar>
        </div>
    </body>
</template>
<!-- 
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js'></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js"></script>
<script src="/js/userlobby1.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js"></script>
-->
<script>
// import user header component from './header.vue'
import user_header from './header.vue';
import calendar from './calendar.vue';
import application from './application.vue';
import config from '@/config';

export default {
    async mounted() {
        const cdn = ['https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js',
                'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
                'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js'
        ];
        await this.loadCDN(cdn);
    },
    components: {
        user_header,
        calendar,
        application
    },
    data () {
        return {
            info: {},
            eventApiUrl: (start, end) => config.apiUrl  + `/reservation?start_time=${start}&end_time=${end}`,
        }
    },
    methods: {
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
                    document.head.appendChild(script);
                });
            }));
        },
        async getBlocksAndId() {
            const res = await fetch(`/api/doc?doc_name=use`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            })
            const data = await res.json();
            return Object.keys(data).length == 0 ? false : {blocks: JSON.parse(data.data.blocks), id_content: JSON.parse(data.data.id_content)};
        },
        async showRules() {
            const text = await getBlocksAndId();
            let htmlContent = '';
            text.blocks.forEach(block =>{
                if (block.type === 'paragraph' && block.data && block.data.text) {
                htmlContent += `<p>${block.data.text}</p>`;
                }
                else if (block.type === 'image'){
                console.log(block.data.width);
                htmlContent += `<img src="${block.data.url}" style="width:${block.data.width}">`;
                }
                });
            Swal.fire({
                title: '會議室使用規則',
                html: htmlContent, // 顯示會議室規則，目前排版置中(需修改)
            });
        },
        //starttime&endtime轉datetime格式
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
        // post reservation
        async reservationPost() {
            console.log("Reservation");
            const form = document.getElementById('request');
            const formData = new FormData(form);
            const name = formData.get('name');
            const startdate = formData.get('startdate');
            const starthour = formData.get('starthour');
            const startminute = formData.get('startminute');
            const enddate = formData.get('enddate');
            const endhour = formData.get('endhour');
            const endminute = formData.get('endminute');
            const ext = formData.get('ext');
            const startTimestamp = formatDateTimeForDatabase(`${startdate}T${starthour}:${startminute}:00`);
            const endTimestamp = formatDateTimeForDatabase(`${enddate}T${endhour}:${endminute}:00`);


            if (!startdate || !enddate || !starthour || !startminute || !endhour || !endminute || !name || !ext) {
            alert('所有欄位都是必填的，請完整填寫表單！');
            return;

            }
            const rulesCheckbox = document.getElementById('checkrule');
            if (!rulesCheckbox.checked) {
            alert('請先勾選「我已詳閱《會議室使用規則》」才能提交申請。');
            return;
            }


            //不能借現在以前的時間&超過三個月
            const today = new Date();
            const reservationDate = new Date(startdate);
            const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));

            const privilege = info.privilege_level;
            if (privilege != 1) {
                if (reservationDate > threeMonthsLater) {
                    alert('借閱日期不能超過三個月後，請選擇在三個月內的日期！');
                    return;
                }
            }

            const data = {
            name: name,
            room_id: '1',
            start_time: startTimestamp,
            end_time: endTimestamp,
            show: true,
            ext: ext,

            }
            fetch('/api/reservation', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then((data) => {
                if (data.suc) {
                alert("預約成功");
                window.location.reload();
                }
                else {
                alert(`預約失敗：${data.result}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        fetchevent(start, end) {
            return fetch(this.eventApiUrl(start, end), {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
            .then(result => {
            if (result && Array.isArray(result.data)) {
                // 將 data 中的每個項目格式化為 FullCalendar 需要的事件格式
                return result.data.map(item => ({
                id: item.reserve_id,
                title: item.name, // 預約名稱
                start: item.start_time, // 開始時間
                end: item.end_time, // 結束時間
                extendedProps: {
                    chinesename: item.chinesename,
                    unit: item.unit,
                    show: item.show,
                    number: item.ext
                }
                }));
            } else {
                console.error('Unexpected data format:', result);
            }
            })
        },
        //編輯會議
        async reservationPut(reserve_id) {
            const formData = new FormData(document.getElementById("requestedit"));
            const name = formData.get('name');
            const startdate = formData.get('startdate');
            const starthour = formData.get('starthour');
            const startminute = formData.get('startminute');
            const enddate = formData.get('enddate');
            const endhour = formData.get('endhour');
            const endminute = formData.get('endminute');
            const ext = formData.get('ext');
            const startTimestamp = this.formatDateTimeForDatabase(`${startdate}T${starthour}:${startminute}:00`);
            const endTimestamp = this.formatDateTimeForDatabase(`${enddate}T${endhour}:${endminute}:00`);
            const startOfDay = this.formatDateTimeForDatabase(`${startdate}T00:00:00`);
            const endOfDay = this.formatDateTimeForDatabase(`${enddate}T23:59:59`);
            const existingEvents = await fetchevent(startOfDay, endOfDay);
            // 構建數據對象
            const data = {
                reserve_id: reserve_id,
                name: name,
                room_id: '1',
                start_time: startTimestamp,
                end_time: endTimestamp,
                ext: ext,
                show: true,
                status: false,
            };

            fetch('/api/reservation', {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then((data) => {
            if (data.suc) {
                alert("預約成功");
                window.location.reload();
            }
            else {
                alert(`預約失敗：${data.result}`);
            }
            })
            .catch(error => {
            console.error('Error:', error);
            alert('發生錯誤，請稍後重試。');
            });
        },
        //刪除會議
        async reservationDelete(reserve_id) {
            const delete_api = '/api/reservation';
            fetch(delete_api, {
                method: 'DELETE',
                credentials: 'include',
                body: JSON.stringify({ reserve_id: reserve_id }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
        },
    }  
}

</script>