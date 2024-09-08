// Required modules
const router = require('express').Router();
const User = require('./../model/user.js');
const jwt = require('./../utilities/jwt.js');

// get all users 
router.get('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const data = await User.get();
            // Convert BigInt to Number prevent the error : "TypeError: Do not know how to serialize a BigInt"
            BigInt.prototype.toJSON = function () {
                const int = Number.parseInt(this.toString());
                return int ?? this.toString();
            };
            res.json({data});
        }
        else {
            res.json({result : 'Invalid token'});
        }
    }
    catch(e) {
        console.log(e);
        res.json({result : 'error'});
    }
});

// update user privileges by identifier
router.put('/privilege', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const identifier = req.body.identifier;
            const privileges = req.body.privileges;
            const suc = await User.updatePrivilegeLevel(identifier, privileges);
            res.json({suc});
        }
        else {
            res.json({result : 'Invalid token'});
        }
    }
    catch(e) {
        console.log(e);
        res.json({result : 'error'});
    }
})

// update user status by identifier
router.put('/status', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const identifier = req.body.identifier;
            const status = req.body.status;
            const suc = await User.updateStatus(identifier, status);
            res.json({suc});
        }
        else {
            res.json({result : 'Invalid token'});
        }
    }
    catch(e) {
        console.log(e);
        res.json({result : 'error'});
    }
})

// get user privileges by identifier in cookies
router.get('/privilege', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const identifier = result.data.data;
            const data = await User.getPrivilegeLevel(identifier);
            res.json({data});
        }
        else {
            res.json({result : 'Invalid token'});
        }
    }
    catch(e) {
        console.log(e);
        res.json({result : 'error'});
    }
})

module.exports = router;