// Required modules
const router = require('express').Router();
const User = require('./../model/user.js');
const Log = require('./../model/log.js');
const jwt = require('./../utilities/jwt.js');
const Email = require("./../utilities/email.js");
const Operator = require("./../model/operator.js");

class Reservation {
    constructor() {
        this.model = require('./../model/reservation.js');
        // bind the function to the class
        this.get = this.get.bind(this);
        this.getShow = this.getShow.bind(this);
        this.post = this.post.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async get(req, res) {
        try {
            const start_time = req.query.start_time;
            const end_time = req.query.end_time;
            const data = await this.model.get(start_time, end_time);
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async getShow(req, res) {
        try {
            const start_time = req.query.start_time;
            const end_time = req.query.end_time;
            const data = await this.model.getShow(start_time, end_time);
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async post(req, res) {
        try {
            const {room_id, name, start_time, end_time, show, ext} = req.body;
            const identifier = req.identifier;
            if (start_time >= end_time) {
                // invlid time, start_time should be less than end_time
                // log the action
                Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
                res.json({result : "開始時間應該小於結束時間，請再次確認"});
            }
            else if (await this.model.checkOverlap(start_time, end_time)) {
                // log the action
                // invlid time, there is a confliction with other reservations
                Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
                res.json({result : "與其他預約有衝突，請再次確認"});
            }
            else {
                const suc = await this.model.insert(identifier, room_id, name, start_time, end_time, show, ext);
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
    }

    async update(req, res) {
        try {
            const {reserve_id, room_id, name, start_time, end_time, show, ext, status} = req.body;
            const identifier = req.identifier;
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
                await this.model.delete(reserve_id);
                if (await this.model.checkOverlap(start_time, end_time)) {
                    res.json({result : "與其他預約有衝突，請再次確認"});
                    // set the reservation back to the original status
                    this.model.setAvailable(reserve_id);
                    // log the action
                    Log.insert(req.ip, Operator.getOperator.reservationFailed.code, identifier);
                }
                else {
                    // if user privilege is less than 2, then only allow to update the reservation which is created by the user itself
                    if (user_priveilege >= 1) {
                        suc = await this.model.update(reserve_id, room_id, name, start_time, end_time, show, ext, status);
                    }  
                    else {
                        suc = await this.model.updateSelfs(identifier, reserve_id, room_id, name, start_time, end_time, show, ext);
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
    }

    async delete(req, res) {
        try {
            const identifier = req.identifier;
            const reserve_id = req.body.reserve_id;
            const user_priveilege = await User.getPrivilegeLevel(identifier);
            // if user privilege is less than 2, then only allow to delete the reservation which is created by the user itself
            let suc;
            if (user_priveilege >= 1) {
                suc = await this.model.delete(reserve_id);
            }
            else {
                suc = await this.model.deleteSelf(reserve_id, identifier);
            }
            // send email to user who reserved the room when the reservation is deleted
            const reservation = await this.model.getById(reserve_id);
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
    }
}

const reservation = new Reservation();

// routes

// get reservations which are between start_time and end_time 
router.get('/', jwt.verifyLogin, reservation.get);

// insert a reservation if not conflict with other reservations
router.post('/', jwt.verifyAdmin, reservation.post);

// get reservations which `show` is true and between the start_time and end_time
// this is for showing the reservations in the TV screen
router.get('/show', jwt.verifyLogin, reservation.getShow);

// update all columns except identifier in reservation by reserve_id and identifier
router.put('/', jwt.verifyLogin, reservation.update);

// delete reservation by reserve_id
router.delete('/', jwt.verifyLogin, reservation.delete);

module.exports = router;
module.exports.Reservation = Reservation;
