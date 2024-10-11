<template>
    <div class="menu">
        <h3 id="accountName" class="menu-title" ></h3>
        <div class="page-choose" style="">
            <div id="privilege" class="choice" v-on:click="changePage">
                <h3 class="pagetext">權限管理</h3>
            </div>
            <div id="conference" class="choice" v-on:click="changePage">
                <h3  class="pagetext">會議管理</h3>
            </div>
            <div id="board" class="choice" v-on:click="changePage">
                <h3  class="pagetext">看板管理</h3>
            </div>
            <div id="rule/use" class="choice" v-on:click="changePage">
                <h3 class="pagetext">使用規則</h3>
            </div>
            <div id="rule/equipment" class="choice" v-on:click="changePage">
                <h3 class="pagetext">器材規則</h3>
            </div>
            <div id="log" class="choice" v-on:click="changePage">
                <h3  class="pagetext">登入紀錄</h3>
            </div>
        </div>
    </div>
</template>
<script>
import config from '@/config';
export default {
    name: 'root_menu',
    async mounted() {
        await this.loadCDN(['https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',]);
        //this.setAccountName();
        this.setCurrentPageColor();
    },
    props: {
        setPageName: {
            type: Function,
            default: () => {}
        }
    },
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
        async getinfo(type){
            try {
                const api = config.apiUrl + '/info/' + type;
                const response = await fetch(api, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                return data.data;
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async setAccountName() {
            var account_type = await this.getinfo('chinesename');
            account_type = DOMPurify.sanitize(account_type);
            document.getElementById("accountName").innerHTML += account_type;
        },
        setCurrentPageColor() {
            // Get the current page name from the URL path
            let currentPage;
            if (window.location.pathname.includes('rule')) {
                currentPage = 'rule/' + window.location.pathname.split('/').pop();
            }
            else {
                currentPage = window.location.pathname.split('/').pop();
            }
            document.getElementById(currentPage).style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
            document.getElementById(currentPage).style.color= 'white';
            this.setPageName(document.getElementById(currentPage).childNodes[0].innerHTML);
        },
        changePage(event){
            const button = event.target.parentElement;
            location.href = "/"+button.id;
        },
    }
}
</script>
<style src='@/assets/ManagerBar.css' scoped></style>