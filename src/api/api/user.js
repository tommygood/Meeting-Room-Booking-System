// Required modules
const router = require('express').Router();
const User = require('./../model/user.js');
const jwt = require('./../utilities/jwt.js');

// get all users 
router.get('/', jwt.verifyAdmin, async function(req, res) {
    try {
        const data = await User.get();
        // Convert BigInt to Number prevent the error : "TypeError: Do not know how to serialize a BigInt"
        BigInt.prototype.toJSON = function () {
            const int = Number.parseInt(this.toString());
            return int ?? this.toString();
        };
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// get user self information by identifier in cookies
router.get('/self', jwt.verifyLogin, async function(req, res) {
    try {
        const identifier = req.identifier;
        const data = await User.getSelf(identifier);
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

// update user privileges by identifier
router.put('/privilege', jwt.verifyAdmin, async function(req, res) {
    try {
        const identifier = req.body.identifier;
        const privileges = req.body.privileges;
        const suc = await User.updatePrivilegeLevel(identifier, privileges);
        res.json({suc});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

// update user status by identifier
router.put('/status', jwt.verifyAdmin, async function(req, res) {
    try {
        const identifier = req.body.identifier;
        const status = req.body.status;
        const suc = await User.updateStatus(identifier, status);
        res.json({suc});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

// get user privileges by identifier in cookies
router.get('/privilege', jwt.verifyLogin, async function(req, res) {
    try {
        const identifier = req.identifier;
        const data = await User.getPrivilegeLevel(identifier);
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;