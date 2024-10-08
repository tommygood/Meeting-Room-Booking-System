// Required modules
const router = require('express').Router();
const Reservation = require('./../model/reservation.js');
const User = require('./../model/user.js');
const Log = require('./../model/log.js');
const jwt = require('./../utilities/jwt.js');
const Email = require("./../utilities/email.js");
const Operator = require("./../model/operator.js");

// get reservations which are between start_time and end_time 
router.get('/', jwt.verifyLogin, async function(req, res) {
	try {
        const start_time = req.query.start_time;
        const end_time = req.query.end_time;
        const data = await Reservation.get(start_time, end_time);
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// insert a reservation if not conflict with other reservations
router.post('/', jwt.verifyAdmin, async function(req, res) {
    try {
        const identifier = req.identifier;
        const room_id = req.body.room_id;
        const name = req.body.name;
        const start_time = req.body.start_time;
        const end_time = req.body.end_time;
        const show = req.body.show;
        const ext = req.body.ext;
        if (start_time >= end_time) {
            // invlid time, start_time should be less than end_time
            // log the action
            Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
            res.json({result : "開始時間應該小於結束時間，請再次確認"});
        }
        else if (await Reservation.checkOverlap(start_time, end_time)) {
            // log the action
            // invlid time, there is a confliction with other reservations
            Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
            res.json({result : "與其他預約有衝突，請再次確認"});
        }
        else {
            const suc = await Reservation.insert(identifier, room_id, name, start_time, end_time, show, ext);
            // send email to admin if the reservation is successful
            Email.sendUser(req.identifier, Email.subject.succeessful_reservation, Email.text.succeessful_reservation(req.identifier, start_time, end_time, room_id));
            // log the action
            Log.insert(req.ip, Operator.getOperator.reservationSuccess.code, identifier);
            res.json({suc});
        }        
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// get reservations which `show` is true and between the start_time and end_time
// this is for showing the reservations in the TV screen
router.get('/show', jwt.verifyLogin, async function(req, res) {
    try {
        const start_time = req.query.start_time;
        const end_time = req.query.end_time;
        const data = await Reservation.getShow(start_time, end_time);
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// update all columns except identifier in reservation by reserve_id and identifier
router.put('/', jwt.verifyLogin, async function(req, res) {
    try {
        const identifier = req.identifier;
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
            // log the action
            Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
            res.json({result : "開始時間應小於結束時間，請再次確認"});
        }
        else {
            // delete the reservation first and then check if there is a confliction with other reservations
            await Reservation.delete(reserve_id);
            if (await Reservation.checkOverlap(start_time, end_time)) {
                res.json({result : "與其他預約有衝突，請再次確認"});
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
                // log the action
                Log.insert(req.ip, Operator.getOperator.reservationPut.code, identifier);
                res.json({suc});
            }
        }
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

// delete reservation by reserve_id
router.delete('/', jwt.verifyLogin, async function(req, res) {
    try {
        const identifier = req.identifier;
        const reserve_id = req.body.reserve_id;
        const user_priveilege = await User.getPrivilegeLevel(identifier);
        // if user privilege is less than 2, then only allow to delete the reservation which is created by the user itself
        let suc;
        if (user_priveilege >= 1) {
            suc = await Reservation.delete(reserve_id);
        }
        else {
            suc = await Reservation.deleteSelf(reserve_id, identifier);
        }
        // send email to user who reserved the room when the reservation is deleted
        const reservation = await Reservation.getById(reserve_id);
        // format the start_time and end_time from mysql
        Email.sendUser(identifier, Email.subject.cancel_reservation, Email.text.cancel_reservation(identifier, reservation.start_time, reservation.end_time, reservation.room_id));
        // log the action
        Log.insert(req.ip, Operator.getOperator.reservationDelete.code, identifier);
        res.json({suc}); 
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
