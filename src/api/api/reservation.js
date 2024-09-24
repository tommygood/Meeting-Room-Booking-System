// Required modules
const router = require('express').Router();
const Reservation = require('./../model/reservation.js');
const User = require('./../model/user.js');
const Log = require('./../model/log.js');
const jwt = require('./../utilities/jwt.js');
const Email = require("./../utilities/email.js");
const Operator = require("./../model/operator.js");

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
            res.status(403).send('Forbidden');
		}
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// insert a reservation if not conflict with other reservations
router.post('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const identifier = result.data.data;
            const room_id = req.body.room_id;
            const name = req.body.name;
            const start_time = req.body.start_time;
            const end_time = req.body.end_time;
            const show = req.body.show;
            const ext = req.body.ext;
            if (start_time >= end_time) {
                res.json({result : "Invalid time, start_time should be less than end_time"});
                // log the action
                Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
            }
            else if (await Reservation.checkOverlap(start_time, end_time)) {
                res.json({result : "Invalid time, there is a confliction with other reservations"});
                // log the action
                Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
            }
            else {
                const suc = await Reservation.insert(identifier, room_id, name, start_time, end_time, show, ext);
                res.json({suc});
                // send email to admin if the reservation is successful
                Email.sendUser(result.data.data, Email.subject.succeessful_reservation, Email.text.succeessful_reservation(result.data.data, start_time, end_time, room_id));
                // log the action
                Log.insert(req.ip, Operator.getOperator.reservationSuccess.code, identifier);
            }        
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

// get reservations which `show` is true and between the start_time and end_time
// this is for showing the reservations in the TV screen
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
            res.status(403).send('Forbidden');
        }
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// update all columns except identifier in reservation by reserve_id and identifier
router.put('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const identifier = result.data.data;
            const reserve_id = req.body.reserve_id;
            const room_id = req.body.room_id;
            const name = req.body.name;
            const start_time = req.body.start_time;
            const end_time = req.body.end_time;
            const show = req.body.show;
            const ext = req.body.ext;
            const status = req.body.status;
            const user_priveilege = await User.getPrivilegeLevel(identifier);
            
            let suc = false;
            // check if start_time is less than end_time and there is no confliction with other reservations
            if (start_time >= end_time) {
                res.json({result : "Invalid time, start_time should be less than end_time"});
                // log the action
                Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
            }
            else {
                // delete the reservation first and then check if there is a confliction with other reservations
                await Reservation.delete(reserve_id);
                if (await Reservation.checkOverlap(start_time, end_time)) {
                    res.json({result : "Invalid time, there is a confliction with other reservations"});
                    // set the reservation back to the original status
                    Reservation.setAvailable(reserve_id);
                    // log the action
                    Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
                }
                else {
                    // if user privilege is less than 2, then only allow to update the reservation which is created by the user itself
                    if (user_priveilege >= 1) {
                        suc = await Reservation.update(reserve_id, room_id, name, start_time, end_time, show, ext, status);
                    }  
                    else {
                        suc = await Reservation.updateSelfs(identifier, reserve_id, room_id, name, start_time, end_time, show, ext);
                    }
                    res.json({suc});
                    // log the action
                    Log.insert(req.ip, Operator.getOperator.reservationPut.code, identifier);
                }
            }
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

// delete reservation by reserve_id
router.delete('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const identifier = result.data.data;
            const reserve_id = req.body.reserve_id;
            const suc = await Reservation.delete(reserve_id);
            // send email to user who reserved the room if the reservation is deleted
            const reservation = await Reservation.getById(reserve_id);
            Email.sendUser(result.data.data, Email.subject.cancel_reservation, Email.text.cancel_reservation(result.data.data, reservation.start_time, reservation.end_time, reservation.room_id));
            res.json({suc}); 
            // log the action
            Log.insert(req.ip, Operator.getOperator.reservationDelete.code, identifier);
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
