const jwt = require('jsonwebtoken');
const jwt_key = 'secret';
const User = require('./../model/user.js');

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

    // middleware for verify jwt token to identify user is logged in or not
    verifyLogin: async function(req, res, next) {
        const token = req.cookies.token;
        const result = verifyJwtToken(token);
        if (result.suc) {
            // set identifier in req
            req.identifier = result.data.data;
            // check user still valid
            if (await User.isValid(req.identifier)) {
                next();
            }
            else {
                res.status(403).send('Forbidden');
            }
        }
        else {
            res.status(401).send('Unauthorized');
        }
    },

    // page middleware for verify jwt token to identify user is logged in or not
    // redirect to main page if not authenicated
    pageVerifyLogin: async function(req, res, next) {
        const token = req.cookies.token;
        const result = verifyJwtToken(token);
        if (result.suc) {
            // set identifier in req
            req.identifier = result.data.data;
            // check user still valid
            if (await User.isValid(req.identifier)) {
                next();
            }
            else {
                res.status(403).send('<script>alert("您已被停權");location.href="/page/main";</script>');
            }
        }
        else {
            res.status(401).send('<script>alert("您尚未登入");location.href="/page/main";</script>');
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
            if (await User.isAdmin(req.identifier)) {
                next();
            }
            else {
                res.status(403).send('Forbidden');
            }
        }
        else {
            res.status(401).send('Unauthorized');
        }
    },

    // page middleware for verify jwt token to identify user is admin or not
    // redirect to main page if not authenicated
    pageVerifyAdmin: async function(req, res, next) {
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
                res.status(403).send('<script>alert("您已被停權或是權限不足");location.href="/page/main";</script>');
            }
        }
        else {
            res.status(401).send('<script>alert("您尚未登入");location.href="/page/main";</script>');
        }
    }
}