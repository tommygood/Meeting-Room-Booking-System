const violation = require("./violation");

module.exports = {
    getOperator: {
        Test: {'code' : 0, 'name' : '測試'},
        LoginSuc: {'code' : 1, 'name' : '登入成功'},
        LoginFail: {'code' : 2, 'name' : '登入失敗'},
        reservationFailed: {'code' : 3, 'name' : '預約失敗'},
        reservationSuccess: {'code' : 4, 'name' : '預約成功'},
        reservationPut: {'code' : 5, 'name' : '修改預約'},
        reservationDelete: {'code' : 6, 'name' : '取消預約'},
        violationInsert: {'code' : 7, 'name' : '新增違規'},
        violationDelete: {'code' : 8, 'name' : '刪除違規'},
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