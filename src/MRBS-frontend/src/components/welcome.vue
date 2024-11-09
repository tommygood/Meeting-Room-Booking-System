<template>
    <body>
        <header>
            <a id="ncu-logo" href="https://ncusec.ncu.edu.tw/secretariat/">
                <img class="logo" src="../../public/ncu_logo.png" alt="國立中央大學">
                <img class="logo_min" src="../../public/ncu_logo_min.png" alt="國立中央大學">
            </a>
            <h1 style="margin-left:2%">行政大樓二樓會議室<div style='margin-right:55%;'>借用系統</div></h1>
        </header>

        <div class="background-container">
            <div class="content-card" style="margin-top: 7%;">
                <button class="login-btn" v-on:click="redirectBackend('/login/sso')">登入</button>
                <div class="footer-links">
                    <a href="#" v-on:click="showRules('use')">使用規則</a>
                    <a href="#" v-on:click="showRules('equipment')">設備介紹</a>
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
    async mounted() {
        const cdn = [
                'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js'
        ];
        await this.loadCDN(cdn);
    },
    name: 'Welcome',
    methods: {
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
        redirectBackend(path) {
            const api = config.apiUrl; 
            window.location.href = api + path;
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
        async showRules(doc_name) {
            const text = await this.getDoc(doc_name);
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
            const title = (doc_name=='use')?'會議室使用規則': '器材規則';
            Swal.fire({
                width:'fit-content',
                'max-width':'55%',
                title: title,
                html: htmlContent, // 顯示會議室規則，目前排版置中(需修改)
            });
        },
    }
}
</script>

<style src="../assets/style.css" scoped></style>
<style>
header {
    height: 13vh !important;
}
</style>