// Required modules
const router = require('express').Router();
const Reservation = require('./../model/reservation.js');
const User = require('./../model/user.js');
const jwt = require('./../utilities/jwt.js');
const Email = require("./../utilities/email.js");

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
            const identifier = result.data.data;
            const room_id = req.body.room_id;
            const name = req.body.name;
            const start_time = req.body.start_time;
            const end_time = req.body.end_time;
            const show = req.body.show;
            const ext = req.body.ext;
            const suc = await Reservation.insert(identifier, room_id, name, start_time, end_time, show, ext);
            res.json({suc});
            // send email to admin if the reservation is successful
            Email.send(Email.admin_email, "New reservation", `New reservation from ${identifier} at ${start_time} to ${end_time} in room ${room_id} is ${suc ? 'successful' : 'failed'}`);
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

// update all columns except identifer in reservation by reserve_id and identifier
router.put('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const identifer = result.data.data;
            const reserve_id = req.body.reserve_id;
            const room_id = req.body.room_id;
            const name = req.body.name;
            const start_time = req.body.start_time;
            const end_time = req.body.end_time;
            const show = req.body.show;
            const ext = req.body.ext;
            const status = req.body.status;
            const user_priveilege = await User.getPrivilegeLevel(identifer);
            
            // if user privilege is less than 2, then only allow to update the reservation which is created by the user itself
            let suc = false;
            if (user_priveilege > 1) {
                suc = await Reservation.update(reserve_id, room_id, name, start_time, end_time, show, ext, status);
            }
            else {
                suc = await Reservation.updateSelfs(identifer, reserve_id, room_id, name, start_time, end_time, show, ext);
            }
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

// delete reservation by reserve_id
router.delete('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const reserve_id = req.body.reserve_id;
            const suc = await Reservation.delete(reserve_id);
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
