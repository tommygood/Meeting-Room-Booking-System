// Required modules
const router = require('express').Router();
const Room = require('./../model/room.js');
const jwt = require('./../utilities/jwt.js');

router.get('/', async function(req, res) {
	try {
		// Verify the token
		const result = jwt.verifyJwtToken(req.cookies.token);
		if (result.suc) {
            const data = await Room.get();
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

router.post('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const name = req.body.name;
            const status = req.body.status;
            const suc = await Room.insert(name, status);
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
});

module.exports = router;