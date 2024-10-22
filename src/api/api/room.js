// Required modules
const router = require('express').Router();
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');

class Room {
    constructor() {
        this.model = require('./../model/room.js');
        this.get = this.get.bind(this);
        this.insert = this.insert.bind(this);
    }

    async get(req, res) {
        try {
            const data = await this.model.get();
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async insert(req, res) {
        try {
            const {name, status} = req.body;
            const suc = await this.model.insert(name, status);
            res.json({suc});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }
}

const room = new Room();

// get all rooms
router.get('/', jwt.verifyLogin, room.get);

router.post('/', jwt.verifyAdmin, room.insert);

module.exports = router;