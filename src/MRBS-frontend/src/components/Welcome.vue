<template>
    <body>
        <header>
            <a id="ncu-logo" href="https://ncusec.ncu.edu.tw/secretariat/">
                <img class="logo" src="../../public/ncu_logo.png" alt="國立中央大學">
                <img class="logo_min" src="../../public/ncu_logo_min.png" alt="國立中央大學">
            </a>
            <h1>行政大樓&emsp;二樓會議室<br>借用系統</h1>
        </header>

        <div class="background-container">
            <div class="content-card">
                <button class="login-btn" v-on:click="redirectBackend('/login/sso')">登入</button>
                <div class="footer-links">
                    <a href="/rule/demo?doc_name=use">使用規則</a>
                    <a href="/rule/demo?doc_name=equipment">設備介紹</a>
                </div>
            </div>
        </div>

        <footer>
            ©copyright
        </footer>
    </body>
</template>

<script>
import config from '@/config';
export default {
    name: 'Welcome',
    methods: {
        redirectBackend(path) {
            const api = config.apiUrl; 
            window.location.href = api + path;
        }
    }
}
</script>

<style src="../assets/style.css" scoped></style>