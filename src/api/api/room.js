// Required modules
const router = require('express').Router();
const Room = require('./../model/room.js');
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');

// get all rooms
router.get('/', jwt.verifyLogin, async function(req, res) {
	try {
        const data = await Room.get();
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', jwt.verifyAdmin, async function(req, res) {
    try {
        const name = req.body.name;
        const status = req.body.status;
        const suc = await Room.insert(name, status);
        res.json({suc});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;