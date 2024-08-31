const jwt = require('jsonwebtoken');

module.exports = {
    jwt_key: 'secret',

    signJwtToken: function(data) {
        try {
            const result = jwt.sign({ data, exp: Math.floor(Date.now() / 1000) + (600 * 15) }, this.jwt_key);
            return result;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    },

    // verify jwt token
    verifyJwtToken: function(token) {
        try {
            const result = jwt.verify(token, this.jwt_key);
            return {suc : true, data : result};
        }
        catch (e) {
            console.log(e);
            return {suc : false, data : null};
        }
    }
}