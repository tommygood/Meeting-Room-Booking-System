// Required modules
const router = require('express').Router();
const Room = require('./../model/room.js');
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');

// get all rooms
router.get('/', async function(req, res) {
	try {
		// Verify the token
		const result = jwt.verifyJwtToken(req.cookies.token);
		if (result.suc) {
            const data = await Room.get();
            res.json({data});
		}
		else {
            res.status(403).send('Forbidden');
		}
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const name = req.body.name;
            const status = req.body.status;
            const suc = await Room.insert(name, status);
            res.json({suc});
        }
        else {
            res.status(403).send('Forbidden');
        }
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;