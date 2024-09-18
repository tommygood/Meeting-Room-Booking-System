module.exports = {
    getOperator: {
        Test: {'code' : 0, 'name' : '測試'},
        LoginSuc: {'code' : 1, 'name' : '登入成功'},
        LoginFail: {'code' : 2, 'name' : '登入失敗'}
    },

    get: function (code) {
        for (var key in this.getOperator) {
            if (this.getOperator[key].code == code) {
                return this.getOperator[key].name;
            }
        }
        return null;
    }
}