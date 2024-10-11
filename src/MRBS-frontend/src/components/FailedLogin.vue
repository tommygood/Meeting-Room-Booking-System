<script>
export default {
    name: 'FailedLogin',
    data() {
        return {
            error: ''
        }
    },
    mounted() {
        const based_login = "登入失敗：";
        // fetch error message from query string
        const urlParams = new URLSearchParams(window.location.search);
        this.error = urlParams.get('error');
        alert(based_login + this.error);
        location.href = '/';
    }
}
</script>