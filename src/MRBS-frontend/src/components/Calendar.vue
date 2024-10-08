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
        this.loadCalendar();
    },
    props : {
        eventApiUrl : {
            type : Function
        },
        info : {
            type : Object
        }
    },
    methods : {
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
                    number: item.ext
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


                eventClick: function (info) {
                    const StartTime = info.event.start.toLocaleString('zh-TW', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        weekday: 'short'
                    });
                    const EndTime = info.event.end.toLocaleString('zh-TW', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        weekday: 'short'
                    });



                    Swal.fire({
                        title: DOMPurify.sanitize(info.event.title),

                        html: DOMPurify.sanitize(`
                            ${StartTime} ~ ${EndTime}<br>
                            會議：${info.event.title}<br>
                            借用單位: ${info.event.extendedProps.unit}<br>
                            申請人: ${info.event.extendedProps.chinesename}<br>
                            分機號碼: ${info.event.extendedProps.number}<br>
                        `),
                        confirmButtonText: "OK",
                    })
                },
                datesSet: handleDatesSet,
            });
            
            // 左邊「我的會議」視窗
            function handleDatesSet() {
                const start = new Date();
                const end = new Date();
                end.setFullYear(end.getFullYear() + 1);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                const startOfDay = self.formatDateTimeForDatabase(start);
                const endOfDay = self.formatDateTimeForDatabase(end);
                console.log(startOfDay, endOfDay);
                fetch(self.eventApiUrl(startOfDay, endOfDay), {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(async (result) => {
                    const events = result.data || [];
                    await self.$nextTick();
                    const filteredEvents = events.filter(event => event.identifier === self.info.identifier);
                    filteredEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

                    if (filteredEvents.length > 0) {
                    document.querySelector('.hamburger-list').innerHTML = '';
                    //顯示每個自己的會議
                    filteredEvents.forEach(event => {
                        const popup = document.createElement('div');
                        popup.className = 'list-content_box';
                        popup.style.display = 'flex';
                        const startTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const endTime = new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const date = new Date(event.start_time).toLocaleDateString([], { month: '2-digit', day: '2-digit', weekday: 'short' });

                        popup.innerHTML = DOMPurify.sanitize(`
                        <div class="list-subtitle">
                            ${date} ${startTime} ~ ${endTime}
                            <br>
                            <div class="list-title">${event.name}</div>
                            
                        </div>
                        `);
                        //     <br>
                        //     借用單位: ${event.unit}<br>
                        //     申請人: ${event.chinesename} &emsp; 分機號碼: ${event.ext}

                        //編輯自己的會議
                        popup.onclick = () => {
                        Swal.fire({
                            title: DOMPurify.sanitize(event.name),
                            html: DOMPurify.sanitize(`
                            ${date} <br>
                            ${startTime} ~ ${endTime}<br>
                            借用單位: ${event.unit}<br>
                            申請人: ${event.chinesename}<br>
                            分機號碼: ${event.ext}<br>
                        `),
                            showCancelButton: true,
                            showDenyButton: true,
                            cancelButtonText: 'OK',
                            confirmButtonText: '編輯會議',
                            denyButtonText: '刪除會議',
                        }).then((result) => {
                            if (result.isConfirmed) {
                            const form = document.getElementById('requestedit');
                            document.getElementById('hamburger-requestpage').style.display = 'none';
                            document.getElementById('hamburger-requestedit').style.display = 'flex';
                            document.getElementById('hamburger-content').style.display = 'none';
                            const startDate = new Date(event.start_time);
                            const formattedStartDate = startDate.toISOString().split('T')[0];
                            const startHour = String(startDate.getHours()).padStart(2, '0');
                            const startMinute = String(startDate.getMinutes()).padStart(2, '0');
                            const endDate = new Date(event.end_time);
                            const formattedEndDate = startDate.toISOString().split('T')[0];
                            const endHour = String(endDate.getHours()).padStart(2, '0');
                            const endMinute = String(endDate.getMinutes()).padStart(2, '0');
                            form.querySelector('input[name="name"]').value = event.name;
                            form.querySelector('input[name="person"]').value = event.chinesename;
                            form.querySelector('input[name="unit"]').value = event.unit;
                            form.querySelector('input[name="ext"]').value = event.ext;
                            form.querySelector('input[name="startdate"]').value = formattedStartDate;
                            form.querySelector('select[name="starthour"]').value = startHour;
                            form.querySelector('select[name="startminute"]').value = startMinute;
                            form.querySelector('input[name="enddate"]').value = formattedEndDate;
                            form.querySelector('select[name="endhour"]').value = endHour;
                            form.querySelector('select[name="endminute"]').value = endMinute;
                            document.getElementById('editbutton').onclick = () => {
                                self.reservationPut(event.reserve_id);
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
                                self.reservationDelete(event.reserve_id);
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
                        };
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
            const existingEvents = await this.fetchevent(startOfDay, endOfDay);
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