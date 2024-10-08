<template>
    <body>
        <header>
            <div class="navbar">
                <div id="hamburger-button" class="hamburger-button" v-on:click="toggleMenu"> </div>
                <h1>行政大樓二樓<br>會議室預約系統</h1>
                <h3 class="account-title" id="accountName">歡迎登入,&nbsp; </h3>
                <a onclick="location.href='/main'">［登出］</a>
                <!-- 切換 使用者/管理者 -->
                <div class="useradmin" id='useradmin' onclick="">
                    <img src="../../public/user.png" class="useradmin-button" onclick="location.href ='/userlobby'">
                    <hr style="margin: 0; height: 100%;" />
                    <img src="../../public/admin.png" class="useradmin-button" onclick="location.href ='/privilege'">
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
        setInfo: Function
    },
    mounted() {
        // load required cdn
        const cdn = ['https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js',
            'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
            'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js'
        ];
        this.loadCDN(cdn);
        this.setUserInfo();
    },
    methods: {
        loadCDN(cdn) {
            // load required cdn
            cdn.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                document.head.appendChild(script);
            });
        },
        // toggle the menu
        toggleMenu() {
            console.log('toggleMenu');
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
                document.getElementById("accountName").innerHTML += name;
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
<style src="../assets/lobby.css"></style>
