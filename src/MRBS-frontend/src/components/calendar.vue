<template>
    <div id='lobby' class="lobby full-width">
        <!-- <div id="hamburger-button" class="hamburger-button" onclick="toggleMenu()"> </div> -->
        <!-- 月曆 -->
        <div id="calendar" class="calendar"></div>
    </div>
</template>
<script>
import config from '@/config';

export default {
    async mounted() {
        const cdn = ['https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js',
                'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
                'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js'
        ];
        await this.loadCDN(cdn);
        await this.loadCalendar();
    },
    props : {
        parent: {
            type: String,
        },
        eventApiUrl : {
            type : Function,
            default : (start, end) => config.apiUrl  + `/reservation?start_time=${start}&end_time=${end}`,
        },
        info : {
            type : Object
        },
        eventClick : {
            type : Function,
            default : (info) => {
                const startWeekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(info.event.start).getDay()];
                const endWeekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(info.event.end).getDay()];

                const startDate = new Date(info.event.start).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                const startTime = new Date(info.event.start).toLocaleTimeString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // 使用24小時制
                });

                const endDate = new Date(info.event.end).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                const endTime = new Date(info.event.end).toLocaleTimeString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // 使用24小時制
                });

                Swal.fire({
                    title: DOMPurify.sanitize(info.event.title),

                    html: DOMPurify.sanitize(`
                    開始日期：${startDate}(${startWeekday}) ${startTime}<br>
                    結束日期：${endDate}(${endWeekday}) ${endTime}<br>
                    借用單位：${info.event.extendedProps.unit}<br>
                    申&ensp;請&ensp;人：${info.event.extendedProps.chinesename}<br>
                    分機號碼：${info.event.extendedProps.number}<br>
                    `),
                    confirmButtonText: "OK",
                })
            },
        },
        setApplicationShow : {
            type : Function,
            default : () => {}
        }
    },
    methods : {
        test() {
            console.log('test')
        },
        resizeWindow() {
            // resize after 1 sec
            setTimeout(() => {
                console.log('calendar resize');
                window.dispatchEvent(new Event('resize'));
            }, 1000);
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
                    number: item.ext,
                    identifier: item.identifier,
                }
                }));
            } else {
                console.error('Unexpected data format:', result);
            }
            })
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
        showEditInterface(event, click_event) {
            console.log('click event:', event);
            const conference_info = {
                'start' : event.start_time,
                'end' : event.end_time,
                'reserve_id' : event.reserve_id,
                'title' : event.name,
                'chinesename' : event.chinesename,
                'unit' : event.unit,
                'number' : event.ext,
                'identifier' : event.identifier,
                'apiUrl' : config.apiUrl,
            }
            this.showEditConferncePage(conference_info);
        },
        showEditConferncePage(conference_info) {
            const startWeekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(conference_info.start).getDay()];
            const endWeekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(conference_info.end).getDay()];

            const startDate = new Date(conference_info.start).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            const startTime = new Date(conference_info.start).toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // 使用24小時制
            });

            const endDate = new Date(conference_info.end).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            const endTime = new Date(conference_info.end).toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // 使用24小時制
            });

            Swal.fire({
                title: DOMPurify.sanitize(conference_info.title),
                html: DOMPurify.sanitize(`
                    開始日期：${startDate}(${startWeekday}) ${startTime}<br>
                    結束日期：${endDate}(${endWeekday}) ${endTime}<br>
                    借用單位：${conference_info.unit}<br>
                    申&ensp;請&ensp;人：${conference_info.chinesename}<br>
                    分機號碼：${conference_info.number}<br>
                `),

                showCancelButton: true,
                showDenyButton: true,
                cancelButtonText: 'OK',
                confirmButtonText: '編輯會議',
                denyButtonText: '刪除會議',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log('parent:', this.parent);
                    if (this.parent == 'conference') {
                        console.log('parent is conference');
                        console.log(window.innerWidth);
                        if (window.innerWidth < 830) {
                            const lobby=document.getElementsByClassName('lobby');
                            lobby[0].style.position='absolute';
                            lobby[0].style.top='120%'
                            const cal = document.getElementById('calendar');
                            cal.style.marginLeft = '30%';
                            cal.style.marginTop = '20%';
                            cal.style.width = '100%';
                        }
                    }
                    this.setApplicationShow(true);
                    const form = document.getElementById('requestedit');
                    document.getElementById('hamburger-requestpage').style.display = 'none';
                    document.getElementById('hamburger-requestedit').style.display = 'flex';
                    document.getElementById('hamburger-content').style.display = 'none';
                    const startDate = new Date(conference_info.start);
                    const formattedStartDate = startDate.toISOString().split('T')[0];
                    const startHour = String(startDate.getHours()).padStart(2, '0');
                    const startMinute = String(startDate.getMinutes()).padStart(2, '0');
                    const endDate = new Date(conference_info.end);
                    const formattedEndDate = endDate.toISOString().split('T')[0];
                    const endHour = String(endDate.getHours()).padStart(2, '0');
                    const endMinute = String(endDate.getMinutes()).padStart(2, '0');
                    form.querySelector('input[name="name"]').value = conference_info.title;
                    form.querySelector('input[name="person"]').value = conference_info.chinesename;
                    form.querySelector('input[name="unit"]').value = conference_info.unit;
                    form.querySelector('input[name="ext"]').value = conference_info.number;
                    form.querySelector('input[name="startdate"]').value = formattedStartDate;
                    form.querySelector('select[name="starthour"]').value = startHour;
                    form.querySelector('select[name="startminute"]').value = startMinute;
                    form.querySelector('input[name="enddate"]').value = formattedEndDate;
                    form.querySelector('select[name="endhour"]').value = endHour;
                    form.querySelector('select[name="endminute"]').value = endMinute;
                    // set email
                    const identifier = conference_info.identifier;
                    const res = await fetch(conference_info.apiUrl + `/user/email?identifier=${identifier}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    form.querySelector('input[name="email"]').value = data.email;
                    document.getElementById('editbutton').onclick = () => {
                        this.reservationPut(conference_info.reserve_id);
                    };
                } else if (result.isDenied) {
                    // 刪除會議
                    Swal.fire({
                        title: '確定要刪除該會議嗎',
                        icon: "warning",
                        confirmButtonText: '確定',
                        showCancelButton: true,
                        cancelButtonText: '返回',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.reservationDelete(conference_info.reserve_id);
                            Swal.fire({
                                title: '刪除成功',
                                icon: 'success',
                            }).then(() => {
                                window.location.reload();
                            });
                        }
                    })
                }
            })
            this.resizeWindow();
        },
        async loadCalendar() {
            console.log('loadCalendar');
            const calendarEl = document.getElementById("calendar")

            const self = this;
            const calendar = new FullCalendar.Calendar(calendarEl, {

                initialView: "dayGridMonth",
                firstDay: 1,
                locale: "zh-tw",
                height: '100vh',
                contentHeight: 700,

                windowResizeDelay: 1,
                displayEventEnd: true,
                fixedWeekCount: false,

                eventOrder: "start",

                dayMaxEventRows: true,
                views: {
                    dayGridMonth: {
                        dayMaxEventRows: 4 // adjust to 6 only for timeGridWeek/timeGridDay
                    }
                },



                //calendar上方按鈕
                headerToolbar: {
                left: "today,dayGridMonth,timeGridWeek,timeGridDay",
                center: "title",
                right: "prev,next",
                },
                buttonText: {
                today: "今天",
                month: "月",
                week: "週",
                day: "天",
                },



                events: function (fetchInfo, successCallback, failureCallback) {
                    // 調用 API 獲取事件，fetchInfo 會自動提供 start 和 end 日期
                    // print events from the API
                    self.fetchevent(fetchInfo.startStr, fetchInfo.endStr)
                    .then(events => {
                        console.log(events)
                        successCallback(events);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        failureCallback(error);
                    });
                },



                // 會議顯示
                // eventDisplay:
                eventTextColor: '#000000',
                eventBackgroundColor: "rgb(217,217,217)",



                eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
                },


                eventClick: this.eventClick,
                datesSet: handleDatesSet(this.showEditInterface)
            });
            
            // 左邊「我的會議」視窗
            function handleDatesSet(showEditInterface) {
                const start = new Date();
                const end = new Date();
                end.setFullYear(end.getFullYear() + 1);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                const startOfDay = self.formatDateTimeForDatabase(start);
                const endOfDay = self.formatDateTimeForDatabase(end);
                fetch(self.eventApiUrl(startOfDay, endOfDay), {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(async (result) => {
                    const events = result.data || [];
                    await self.$nextTick();
                    // sleep 1 sec
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const filteredEvents = events.filter(event => event.identifier === self.info.identifier);
                    filteredEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
                    if (filteredEvents.length > 0) {
                        document.querySelector('.hamburger-list').innerHTML = '';
                        //顯示每個自己的會議
                        filteredEvents.forEach(event => {
                            const popup = document.createElement('div');
                            popup.className = 'list-content_box';
                            popup.style.display = 'flex';
                            popup.style.margin = '1%';
                            // get weekday from date
                            const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' ,hour12: false });
                            const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' ,hour12: false});
                            // show the year-date of start_time and end_time when they are different
                            if (event.start_time.split(' ')[0] === event.end_time.split(' ')[0]) {
                                const date = new Date(event.start_time).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit' });
                                const weekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(event.start_time).getDay()];
                                popup.innerHTML = DOMPurify.sanitize(`
                                <div class="list-subtitle">
                                    ${date}(${weekday})
                                    <br>
                                    ${startTime} ~ ${endTime}
                                    <br>
                                    <div class="list-title">${event.name}</div>
                                    
                                </div>
                                `);
                            } else {
                                const date = new Date(event.start_time).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit' });
                                const end_date = new Date(event.end_time).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit' });
                                const start_date_weekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(event.start_time).getDay()];
                                const end_date_weekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(event.end_time).getDay()];
                                popup.innerHTML = DOMPurify.sanitize(`
                                <div class="list-subtitle">
                                    ${date}(${start_date_weekday}) ~ ${end_date}(${end_date_weekday})
                                    <br>
                                    ${startTime} ~ ${endTime}
                                    <br>
                                    <div class="list-title">${event.name}</div>
                                    
                                </div>
                                `);
                            }
                            
                            
                            //     <br>
                            //     借用單位: ${event.unit}<br>
                            //     申請人: ${event.chinesename} &emsp; 分機號碼: ${event.ext}

                            //編輯自己的會議
                            popup.addEventListener('click', showEditInterface.bind(null, event));
                            document.querySelector('.hamburger-list').appendChild(popup);
                            // document.getElementById('event-list').style.overflow = 'auto';
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
            }

            calendar.render();
        },
        ruleBoxCheck() {
            const rulesCheckbox = document.getElementById('checkrule_update');
            console.log(rulesCheckbox, rulesCheckbox.checked);
            if (!rulesCheckbox.checked) {
                alert('請先勾選「我已詳閱《會議室使用規則》」才能提交申請。');
                return false;
            }
            return true;
        },
        //編輯會議
        async reservationPut(reserve_id) {
            if (!this.ruleBoxCheck()) {
                return;
            }
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

            console.log(data);
            const api = config.apiUrl + '/reservation';
            fetch(api, {
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
        async reservationDelete(reserve_id) {
            const api = config.apiUrl + '/reservation';
            fetch(api, {
                method: 'DELETE',
                credentials: 'include',
                body: JSON.stringify({ reserve_id: reserve_id }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
        }
    }
}
    
</script>
<style>
#swal2-html-container {
    text-align: left;
    font-family: "Microsoft JhengHei", sans-serif;

}
.fc-daygrid-body {
    width: 100% !important;
}
</style>