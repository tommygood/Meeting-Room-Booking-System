const jwt = require('jsonwebtoken');

const jwt_key = 'secret';

// verify jwt token
function verifyJwtToken(token) {
    try {
        const result = jwt.verify(token, jwt_key);
        return {suc : true, data : result};
    }
    catch (e) {
        console.log(e);
        return {suc : false, data : null};
    }
}

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
    },

    // middleware for verify jwt token to identify user is logged in or not
    verifyLogin: function(req, res, next) {
        const token = req.cookies.token;
        const result = verifyJwtToken(token);
        if (result.suc) {
            // set identifier in req
            req.identifier = result.data.data;
            next();
        }
        else {
            res.status(401).send('Unauthorized');
        }
    },

    // middleware for verify jwt token to identify user is admin or not
    verifyAdmin: async function(req, res, next) {
        const token = req.cookies.token;
        const result = verifyJwtToken(token);
        if (result.suc) {
            // set identifier in req
            req.identifier = result.data.data;
            // check whether user have admin privilege
            const User = require('./../model/user.js');
            if (await User.isAdmin(result.data.data)) {
                next();
            }
            else {
                res.status(403).send('Forbidden');
            }
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
}