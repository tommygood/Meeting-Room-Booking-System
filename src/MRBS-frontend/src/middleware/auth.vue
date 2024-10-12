<script>
import config from '@/config';

export default {
    name: 'Auth',
    methods: {
        async login() {
            try {
                const res = await fetch(config.apiUrl + '/user/self', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                //const data = await res.json();
                let result = {suc : false, reason : 'test'};
                // res status 200 means the user is already logged in, then call the next middleware
                if (res.status === 200) {
                    result.suc = true;
                }
                else {
                    //result.reason = data.reason;
                    result.reason = "錯誤的使用者資訊";
                }
                return result;
            } catch (err) {
                this.error = err.message;
                return {suc : false, reason : err.message};
            }
        }
    }
}
</script>