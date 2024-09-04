// Required modules
const router = require('express').Router();
const Reservation = require('./../model/reservation.js');
const jwt = require('./../utilities/jwt.js');

// get reservations which are between start_time and end_time 
router.get('/', async function(req, res) {
	try {
		// Verify the token
		const result = jwt.verifyJwtToken(req.cookies.token);
		if (result.suc) {
            const start_time = req.query.start_time;
            const end_time = req.query.end_time;
            const data = await Reservation.get(start_time, end_time);
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
            const identifier = req.body.identifier;
            const room_id = req.body.room_id;
            const name = req.body.name;
            const start_time = req.body.start_time;
            const end_time = req.body.end_time;
            const show = req.body.show;
            const ext = req.body.ext;
            const suc = await Reservation.insert(identifier, room_id, name, start_time, end_time, show, ext);
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

// get reservations which `show` is true and between the start_time and end_time
router.get('/show', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const start_time = req.query.start_time;
            const end_time = req.query.end_time;
            const data = await Reservation.getShow(start_time, end_time);
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

module.exports = router;
