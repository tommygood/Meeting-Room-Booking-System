<template>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <body>
        <header>
            <div class="navbar">
                <div id="hamburger-button" class="hamburger-button" v-on:click="toggleMenu"> </div>
                <h1 class="header-text">行政大樓二樓<br>會議室預約系統
                  <div id="phone_account_name" style="font-size: medium;display: none;">歡迎登入,&nbsp; {{ account_name }} </div>
                </h1>
                <h3 class="account-title header-text" id="accountName">歡迎登入,&nbsp; {{ account_name }} </h3>
                <a class="header-text" v-on:click="redirect('/')">［登出］</a>
                <!-- 切換 使用者/管理者 -->
                <div class="useradmin" id='useradmin'>
                    <img src="../../public/user.png" class="useradmin-button" v-on:click="redirect('/lobby')">
                    <hr style="margin: 0; height: 100%;" />
                    <img src="../../public/admin.png" class="useradmin-button" v-on:click="redirect('/privilege')">
                </div>
            </div>
        </header>
    </body>
</template>
<script>
import config from '@/config';
export default {
    name: 'user_header',
    props: {
        info: Object,
        setInfo: Function,
        username: String
    },
    data() {
        return {
            account_name: this.username,
        };
    },
    async mounted() {
        // load required cdn
        const cdn = ['https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js',
            'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
            'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js'
        ];
        await this.loadCDN(cdn);
        this.setUserInfo();
    },
    methods: {
      redirect(path) {
          window.location.href = path;
      },
      loadCDN(cdn) {
          // Return a promise that resolves when all scripts are loaded
          return Promise.all(
              cdn.map(src => {
                  return new Promise((resolve, reject) => {
                      const script = document.createElement('script');
                      script.src = src;
                      script.onload = () => resolve(src); // Resolve when script is loaded
                      script.onerror = () => reject(new Error(`Failed to load ${src}`)); // Reject if there's an error loading the script
                      document.head.appendChild(script);
                  });
              })
          );
      },
        // toggle the menu
        toggleMenu() {
            console.log('toggleMenu');
            if (window.innerWidth < 830) {
              document.getElementById('hamburger-menu').style.display = document.getElementById('hamburger-menu').style.display === 'none' ? 'block' : 'none';
              document.getElementById('fc-dom-1').style.marginTop = document.getElementById('hamburger-menu').style.display === 'none' ? '10%' : '';

            }
            else {
              const menu = document.getElementById('hamburger-menu');
              const lobby = document.getElementById('lobby');

              // 切換active狀態來控制菜單顯示或隱藏
              menu.classList.toggle('active');

              // 根據菜單是否隱藏來調整lobby的寬度
              if (menu.classList.contains('active')) {
                  // console.log('1');
                  lobby.classList.add('full-width');
              } else {
                  // console.log('1');
                  lobby.classList.remove('full-width');
              }
              setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
              }, 1);
            }
        },

        // add a async function
        async getUserInfo() {
            try {
                const api = config.apiUrl + '/user/self';
                console.log('api:', api);
                const response = await fetch(api, {
                method: 'GET',
                credentials: "include",
                });
                const data = await response.json();
                return data.data;
            } catch (error) {
                console.error("Error:", error);
            }
        }, 
        //get user information & set accountName
        async setUserInfo() {
            try {
                this.setInfo(await this.getUserInfo());
                await this.$nextTick();
                const name = DOMPurify.sanitize(this.info.chinesename);
                this.account_name = name;
                const useradmin = document.getElementById('useradmin');
                try {
                    const privilege = this.info.privilege_level;

                    if (privilege != 1) {
                        useradmin.style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error fetching privilege:', error);
                }
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
    }
};
</script>
<style href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.min.css" rel="stylesheet"></style>
<style>
body {
    width: contain;
    height: 100%;
    margin: 0;
  }
  
  header {
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    padding: 10px;
  }
  
  .navbar {
    display: flex;
    justify-content: right;
    align-items: center;
  }
  
  .navbar h1 {
    position: absolute;
    left: 60px;
    font-size: 20px;
    color: #333;
    line-height: 1;
  }
  
  .navbar h3 {
    font-size: 20px;
    margin: 0px 0px 0px 300px;
    color: #215D5A;
  }
  
  .navbar a {
    font-size: 20px;
    margin: 0px 0px;
    color: #3C9A86;
  }

  header{
    transform: scale(1.2); /* 調整縮放比例 */
    transform-origin: left; /* 縮放中心設為元素中心 */
    width: calc(100% / 1.22); /* 縮放寬度以補償 scale 的影響 */
    height: 6vh; /* 縮放高度以補償 scale 的影響 */
  }
  
  .content {
    display: flex;
    width: contain;
    height: contain;
  }
  
  .lobby {
    height: 90vh;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: calc(100vw - 400px);
    min-width: 400px;
    /* 菜單寬度為 400px，lobby 初始占用剩餘寬度 */
    transition: transform 0.3s ease, width 0.3s ease;
    transform: translateX(0px);
    /* 初始狀態向右移動 */
  }
  
  /* 當菜單隱藏時，lobby 寬度自動填滿 */
  .lobby.full-width {
    transition: transform 0.3s ease, width 0.3s ease;
    transform: translateX(0px);
    width: 100vw;
  }
  
  /* 會議的排列(時間，名稱) */
  .fc-event-main-frame {
    flex-direction: column;
  }
  
  /* 會議行距 */
  .fc-event {
    line-height: 1;
    z-index: 5;
    cursor: pointer;
  
  }
  
  /* 上面按鈕跟日期位置 */
  .fc-header-toolbar.fc-toolbar.fc-toolbar-ltr .fc-toolbar-chunk:first-child {
    display: flex;
    flex-direction: row;
    margin: 20px 0px;
  }
  
  .fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 0;
  }
  
  .fc-header-toolbar.fc-toolbar.fc-toolbar-ltr .fc-toolbar-chunk:nth-child(2) {
    display: flex;
    flex-direction: row;
    margin-left: -100px;
  }
  
  /* 字體大小 */
  .fc-event-title {
    margin-left: 3px;
  }
  
  /* 月曆每格大小 */
  .fc-daygrid-day-frame {
    position: relative;
    box-sizing: border-box;
    width: auto;
    font-family: "Microsoft JhengHei";
    font-size: 14px;
  }
  
  .fc-daygrid-day-top {
    justify-content: center;
  }

  /* 點選當天看所有事件的popup*/
  .fc-theme-standard .fc-popover{
    font-family: "Microsoft JhengHei";
  }
  :root {
    --fc-today-bg-color: #3C9A8620;
    --fc-button-bg-color: #215D5A;
    /* --fc-button-border-color: #2c3e50; */
    --fc-button-hover-bg-color: #3C9A86;
    /* --fc-button-hover-border-color: #1a252f; */
    --fc-button-active-bg-color: #3C9A86;
    /* --fc-button-active-border-color: #151e27; */
  }
  
  
  
  /* list按鈕 */
  .hamburger-button {
    position: absolute;
    left: 10px;
    width: 40px;
    height: 40px;
    background-image: url('../../public/list.png');
    background-size: 70%;
    align-self: center;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    z-index: 1000;
    /* z-index: 1000; 確保按鈕在其他元素上面 */
  }
  
  .hamburger-button:hover {
    background-color: #38868850;
  }
  
  
  .hamburger-menu {
    width: 400px;
    border-right: 1px solid #d6d5d5;
    /* background-color: #fff3dd; */
    padding: 10px;
    /* 初始狀態顯示 */
    transition: transform 0.3s ease;
    /* 添加過渡效果 */
    flex-direction: column;
    z-index: 10;
  
    position: relative;
    left: 0;
    /* top: 0; */
    background-color: #E2F0D975;
    display: block;
    /* 設定初始顯示狀態 */
  }
  
  .hamburger-menu.active {
    position: absolute;
    margin-right: 100%;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
    /* 菜單隱藏到視窗外 */
  }
  
  .hamburger-title {
    display: flex;
    justify-content: center;
    font: 700 30px/1.2 Inter, Arial, serif;
    color: #388688;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .hamburger-list {
    display: flex;
    flex-direction: column;
    width: 370px;
    height: 65vh;
    padding: 10px;
    /* box-shadow: 1px 1px 5px 5px rgb(220, 220, 220) inset; */
    /* border: 1px double rgb(255, 210, 177); */
    overflow: auto;
  }
  
  .list-title {
    /* margin: 3px; */
    font: 700 25px/1.2 Arial, serif;
    color: #215D5A;
    letter-spacing: -0.2px;
  }
  
  .list-subtitle {
    margin: 10px;
    font: 600 18px/1.2 Arial, serif;
    color: #0D2524;
    letter-spacing: -0.2px;
  }
  
  .list-content_box {
    display: flex;
    flex-direction: column;
    background-color: rgb(247, 247, 247);
    border-radius: 10px;
    /* border-color: black; */
    box-shadow: 1px 1px 3px 1px rgb(220, 220, 220);
    margin: 5px 0px;
  }
  
  .list-content_box:hover {
    background-color: #3C9A8630;
    cursor: pointer;
  }
  
  .hamburger-requestbutton {
    margin-left: 25%;
    margin-top: 20px;
    width: 50%;
    height: 50px;
    background-color: #388688;
    display: flex;
    justify-content: center;
    align-items: normal;
    font: 700 24px/1.2 Inter, Helvetica, Arial, serif;
    border-radius: 15px;
  }
  
  .hamburger-requestbutton:hover {
    background-color: #0D2524;
    cursor: pointer;
  
  }
  .fc-toolbar-title{
    font-family:"Microsoft JhengHei";
  }
  
  /* 申請清單清單 */
  .hamburger-requestpage {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .hamburger-request-title {
    margin-left: 10px;
    font-size: 18px;
    white-space: nowrap;
  }
  
  .hamburger-bottom {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  
  .input-group {
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
    padding: 2px;
    margin-top: 5px;
    margin-right: 5px;
    /* background-color: #e2f0d975; */
  }
  
  input {
    font-size: 1.1em;
    height: 35px;
    width: 70%;
    border-radius: 10px;
  }
  
  select {
    width: 50px;
    height: 35px;
    /* box-sizing: 30px 20px; */
  }
  
  .hamburger-timerequest {
    font-size: 1.1em;
    height: 35px;
    width: 30%;
    border-radius: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }
  
  .hamburger-sendbutton {
    margin-left: 3%;
    margin-right: 3%;
    margin-top: 20px;
    width: 50%;
    height: 50px;
    background-color: #388688;
    display: flex;
    justify-content: center;
    align-items: normal;
    font: 700 24px/1.2 Inter, Helvetica, Arial, serif;
    border-radius: 15px;
  }
  
  .hamburger-sendbutton:hover {
    background-color: #0D2524;
    cursor: pointer;
  
  }
  
  .request-check {
    margin-top: 5px;
    justify-content: center;
    flex-direction: row;
    display: inline-flex;
    align-items: center;
    height: 20px;
  }
  
  
  /* 使用者/管理者按鈕 */
  .useradmin {
    display: flex;
    flex-direction: row;
    border: 1px #215D5A solid;
    border-radius: 5px;
    width: fit-content;
    height: 40px;
    right: 50px;
  }
  
  .useradmin-button {
    width: 30px;
    height: 30px;
    padding: 5px;
  
    background-repeat: no-repeat;
    background-size: cover;
  }
  
  .useradmin-button:hover {
    background-color: #3C9A8650;
    cursor: pointer;
  }
  
  
  /* 響應式調整 */

  @viewport {
    width: device-width;
    initial-scale: 1;
}
  @media screen and (max-width: 830px) {

    .header-text {
      font-size: 4vw !important;
    }

    #hamburger-menu {
      margin-top: '1000px' !important;
    }

    #phone_account_name {
        display: block !important;
    }

    #accountName {
        display: none;
    }

    #fc-dom-1 {
      display: flex;
      margin-bottom: 100%;
      white-space: nowrap;
    }
    
    h3, a {
        white-space: nowrap;
    }

    #accountName {
        margin-top: 20%;
    }

    td {
        white-space: nowrap; /* Prevent text from wrapping to the next line */
        overflow: hidden; /* Hide text that overflows */
        text-overflow: ellipsis; /* Add "..." if text is too long */
    }
    

    body {
      display: block;
      flex-wrap: wrap;
    }
  
    .content {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
    }

    #event-list {
        height:45vh;
        width:95%;
        overflow-y: scroll;
    }
  
    .hamburger-menu {
      width: 100%;
      height: 100vh;
      /* position: absolute; */
      top: 0;
      order: 1;
      /* left: 0; */
      transform: translateY(-10%);
      transition: transform 0.3s ease;
      margin-top: 30%;
    }
  
    .hamburger-menu.active {
      transform: translateY(0%);
    }
  
    .lobby {
      order: 2;
      height: calc(100vh - 60vh);
      padding: 0px 10px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      transition: transform 0.3s ease, height 0.3s ease;
    }
  
    .lobby.full-width {
      height: 100vh;
    }
  }
  
  p {
    text-align: left;
  }
</style>
