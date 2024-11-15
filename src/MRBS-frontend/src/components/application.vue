<template>
    <div id="hamburger-menu" class="hamburger-menu" style="margin-top: 1vh;" v-show="show">
    <!-- 我的會議頁面 -->
    <div id="hamburger-content" class="hamburger-content">
        <h3 class="hamburger-title">我的會議</h3>
        <div class="hamburger-list" id="event-list">

        </div>
        <div v-on:click="apply" id="hamburger-requestbutton" class="hamburger-requestbutton">
            <h3 class="hamburger-title" style="color:white">預約申請</h3>
        </div>
    </div>
    <!-- 申請頁面 -->
    <div id="hamburger-requestpage" class="hamburger-requestpage">
        <h3 class="hamburger-title">送出申請</h3>
        <form id="request">
            <div class="hamburger-list">
                <div class="input-group">
                    <h2 class="hamburger-request-title">會議名稱：</h2>
                    <input type="text" class="hamburger-request" name='name' placeholder="會議名稱" />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">&nbsp;&nbsp;&nbsp;申請人 ：</h2>
                    <input type="text" class="hamburger-request" name='person' placeholder="申請人(固定)"
                        style="background-color:#9999995f" readonly />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">申請單位：</h2>
                    <input type="text" class="hamburger-request" name='unit' placeholder="申請單位(固定)"
                        style="background-color:#9999995f" readonly />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">分機號碼：</h2>
                    <input type="text" class="hamburger-request" name='ext' placeholder="分機號碼" />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">電子信箱：</h2>
                    <input type="text" class="hamburger-request" name='email' placeholder="電子信箱" />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">開始日期：</h2>
                    <input type="date" class="hamburger-request" name="startdate" id="startdate" />
                    <select name="starthour" id="starthour" style="margin-left:3%;">
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                    </select>
                    <span>:</span>
                    <select name="startminute" id="startminute">
                        <option value="00">00</option>
                        <option value="30">30</option>
                    </select>
                </div>

                <div class="input-group">
                    <h2 class="hamburger-request-title">結束日期：</h2>
                    <input type="date" class="hamburger-request" name="enddate" id="enddate" />
                    <select name="endhour" id="endhour" style="margin-left:3%;">
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                    </select>
                    <span>:</span>
                    <select name="endminute" id="endminute">
                        <option value="00">00</option>
                        <option value="30">30</option>
                    </select>
                </div>

                <div class="request-check">
                    <input type="checkbox" id="checkrule" style="width: 25px;">
                    <h2 class="hamburger-request-title">
                        我已詳閱
                        <a href="#" v-on:click="showRules">
                            《會議室使用規則》
                        </a>
                    </h2>
                </div>
            </div>
            <div id="hamburger-bottom" class="hamburger-bottom">
                <div v-on:click="back" id="backbtn" class="hamburger-sendbutton">
                    <h3 class="hamburger-title" style="color:white">返回</h3>
                </div>
                <div v-on:click="reservationPost" id="sendbutton" class="hamburger-sendbutton">
                    <h3 class="hamburger-title" style="color:white">申請送出</h3>
                </div>

            </div>
        </form>
    </div>
    <!-- 編輯頁面 -->
    <div id="hamburger-requestedit" class="hamburger-requestpage">
        <h3 class="hamburger-title">編輯申請</h3>
        <form id="requestedit">
            <div class="hamburger-list">
                <div class="input-group">
                    <h2 class="hamburger-request-title">會議名稱：</h2>
                    <input type="text" class="hamburger-request" name='name' placeholder="會議名稱" />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">&nbsp;&nbsp;&nbsp;申請人 ：</h2>
                    <input type="text" class="hamburger-request" name='person' placeholder="申請人(固定)"
                        style="background-color:#ece673" readonly />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">申請單位：</h2>
                    <input type="text" class="hamburger-request" name='unit' placeholder="申請單位(固定)"
                        style="background-color:#ece673" readonly />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">分機號碼：</h2>
                    <input type="text" class="hamburger-request" name='ext' placeholder="分機號碼" />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">電子信箱：</h2>
                    <input type="text" class="hamburger-request" name='email' placeholder="電子信箱" />
                </div>
                <div class="input-group">
                    <h2 class="hamburger-request-title">開始日期：</h2>
                    <input type="date" class="hamburger-request" name="startdate" id="startdate" />
                    <select name="starthour" id="editstarthour" style="margin-left:3%;">
                        <option v-if="is_admin" value="00">00</option>
                        <option v-if="is_admin" value="01">01</option>
                        <option v-if="is_admin" value="02">02</option>
                        <option v-if="is_admin" value="03">03</option>
                        <option v-if="is_admin" value="04">04</option>
                        <option v-if="is_admin" value="05">05</option>
                        <option v-if="is_admin" value="06">06</option>
                        <option v-if="is_admin" value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option v-if="is_admin" value="18">18</option>
                        <option v-if="is_admin" value="19">19</option>
                        <option v-if="is_admin" value="20">20</option>
                        <option v-if="is_admin" value="21">21</option>
                        <option v-if="is_admin" value="22">22</option>
                        <option v-if="is_admin" value="23">23</option>
                        <option v-if="is_admin" value="24">24</option>
                    </select>
                    <span>:</span>
                    <select name="startminute" id="editstartminute">
                        <option value="00">00</option>
                        <option value="30">30</option>
                    </select>
                </div>

                <div class="input-group">
                    <h2 class="hamburger-request-title">結束日期：</h2>
                    <input type="date" class="hamburger-request" name="enddate" id="enddate" />
                    <select name="endhour" id="endhour" style="margin-left:3%;">
                        <option v-if="is_admin" value="00">00</option>
                        <option v-if="is_admin" value="01">01</option>
                        <option v-if="is_admin" value="02">02</option>
                        <option v-if="is_admin" value="03">03</option>
                        <option v-if="is_admin" value="04">04</option>
                        <option v-if="is_admin" value="05">05</option>
                        <option v-if="is_admin" value="06">06</option>
                        <option v-if="is_admin" value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option v-if="is_admin" value="18">18</option>
                        <option v-if="is_admin" value="19">19</option>
                        <option v-if="is_admin" value="20">20</option>
                        <option v-if="is_admin" value="21">21</option>
                        <option v-if="is_admin" value="22">22</option>
                        <option v-if="is_admin" value="23">23</option>
                        <option v-if="is_admin" value="24">24</option>
                    </select>
                    <span>:</span>
                    <select name="endminute" id="endminute">
                        <option value="00">00</option>
                        <option value="30">30</option>
                    </select>
                </div>
                <div class="request-check">
                    <input type="checkbox" id="checkrule_update" style="width: 25px;">
                    <h2 class="hamburger-request-title">
                        我已詳閱
                        <a href="#" v-on:click="showRules">
                            《會議室使用規則》
                        </a>
                    </h2>
                </div>
            </div>
            <div class="hamburger-bottom">
                <div v-on:click="back" id="backbtnedit" class="hamburger-sendbutton">
                    <h3 class="hamburger-title" style="color:white">返回</h3>
                </div>
                <div id="editbutton" class="hamburger-sendbutton">
                    <h3 class="hamburger-title" style="color:white">編輯送出</h3>
                </div>
            </div>
        </form>
    </div>
</div>
</template>
<script>
import config from '@/config';
export default {
    name: 'application',
    props: {
        parent: String,
        info: Object,
        formatDateTimeForDatabase: Function,
        show: {
            type: Boolean,
            default: true
        },
        setApplicationShow: Function,
        remove_application_when_back: {
            type: Boolean,
            default: false
        },
        is_admin: {
            type: Boolean,
            default: false
        },
    },
    async mounted() {
        this.syncStartEndDate();
        if (window.innerWidth < 830) {
            document.getElementById('hamburger-menu').style.marginTop = '30%';
        }
    },
    methods: {
        resizeWindow() {
            // resize after 1 sec
            setTimeout(() => {
                console.log('applying resize');
                window.dispatchEvent(new Event('resize'));
            }, 0);
        },
        apply() {
            document.getElementById('hamburger-content').style.display = 'none';
            document.getElementsByClassName('hamburger-requestpage')[0].style.display = 'flex';
            document.querySelector('input[name="person"]').value = this.info.chinesename;
            document.querySelector('input[name="unit"]').value = this.info.unit;
            document.querySelector('input[name="email"]').value = this.info.email;
            // set margin-top = 150% on #hamburger-menu when the screen size is under 830px
            if (window.innerWidth < 830) {
                document.getElementById('hamburger-menu').style.marginTop = '30%';
                console.log(document.getElementById('hamburger-menu').style.height)
                document.getElementById('hamburger-menu').style.height = '0p';
            }
            this.resizeWindow();
        },
        syncStartEndDate() {
            const startDate = document.getElementById('startdate');
            startDate.addEventListener('change', function () {
                document.getElementById('enddate').value = startDate.value;
            });
        },
        back() {
            document.getElementById('hamburger-content').style.display = 'block';
            document.getElementsByClassName('hamburger-requestpage')[0].style.display = 'none';
            document.getElementById('hamburger-requestedit').style.display = 'none';
            if (this.remove_application_when_back) {
                this.setApplicationShow(false);
            }
            // set margin-top = 50% on #hamburger-menu when the screen size is under 830px
            if (window.innerWidth < 830) {
                document.getElementById('hamburger-menu').style.marginTop = '30%';
                if (this.parent == 'conference') {
                    console.log('parent is conference');
                    console.log(window.innerWidth);
                    if (window.innerWidth < 830) {
                        const lobby=document.getElementsByClassName('lobby');
                        lobby[0].style.position='';
                        lobby[0].style.top=''
                        const cal = document.getElementById('calendar');
                        cal.style.marginLeft = '';
                        cal.style.marginTop = '';
                        cal.style.width = '';
                    }
                }
            }
            this.resizeWindow();
        },
        async getDoc(doc_name) {
            const api = config.apiUrl + `/doc?doc_name=${doc_name}`;
            const res = await fetch(api, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            })
            const data = await res.json();
            return Object.keys(data).length == 0 ? false : {blocks: JSON.parse(data.data.blocks), id_content: JSON.parse(data.data.id_content)};
        },
        async showRules() {
            const text = await this.getDoc('use');
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
        ruleBoxCheck() {
            const rulesCheckbox = document.getElementById('checkrule');
            if (!rulesCheckbox.checked) {
                alert('請先勾選「我已詳閱《會議室使用規則》」才能提交申請。');
                return false;
            }
            return true;
        },
        //上傳預約
        async reservationPost() {
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
            const startTimestamp = this.formatDateTimeForDatabase(`${startdate}T${starthour}:${startminute}:00`);
            const endTimestamp = this.formatDateTimeForDatabase(`${enddate}T${endhour}:${endminute}:00`);


            if (!startdate || !enddate || !starthour || !startminute || !endhour || !endminute || !name || !ext) {
                alert('所有欄位都是必填的，請完整填寫表單！');
                return;
            }
            
            if (!this.ruleBoxCheck()) {
                return;
            }
            //不能借現在以前的時間&超過三個月
            const today = new Date();
            const reservationDate = new Date(startdate);
            const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));

            const privilege = this.info.privilege_level;
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
            const api = config.apiUrl + '/reservation';
            fetch(api, {
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
    }
}
</script>
<style scoped>
input {
            padding-left: 3%;  /* 調整右邊的內邊距 */
        }
</style>