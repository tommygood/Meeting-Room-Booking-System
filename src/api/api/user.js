// Required modules
const router = require('express').Router();
const jwt = require('./../utilities/jwt.js');

class User {
    constructor() {
        this.model = require('./../model/user.js');
        this.get = this.get.bind(this);
        this.getSelf = this.getSelf.bind(this);
        this.updatePrivilegeLevel = this.updatePrivilegeLevel.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.getPrivilegeLevel = this.getPrivilegeLevel.bind(this);
        this.getEmail = this.getEmail.bind(this);  
    }

    async get(req, res) {
        try {
            const data = await this.model.get();
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
    }

    async getSelf(req, res) {
        try {
            const identifier = req.identifier;
            const data = await this.model.getSelf(identifier);
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async getEmail(req, res) {
        try {
            const identifier = req.query.identifier;
            const data = await this.model.getSelf(identifier);
            res.json({'email' : data.email});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async updatePrivilegeLevel(req, res) {
        try {
            const identifier = req.body.identifier;
            const privileges = req.body.privileges;
            const suc = await this.model.updatePrivilegeLevel(identifier, privileges);
            res.json({suc});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async updateStatus(req, res) {
        try {
            const identifier = req.body.identifier;
            const status = req.body.status;
            const suc = await this.model.updateStatus(identifier, status);
            res.json({suc});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async getPrivilegeLevel(req, res) {
        try {
            const identifier = req.identifier;
            const data = await this.model.getPrivilegeLevel(identifier);
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }
}

const user = new User();

// get all users 
router.get('/', jwt.verifyAdmin, user.get);

// get user self information by identifier in cookies
router.get('/self', jwt.verifyLogin, user.getSelf);

// get user email by identifier
router.get('/email', jwt.verifyAdmin, user.getEmail);

// update user privileges by identifier
router.put('/privilege', jwt.verifyAdmin, user.updatePrivilegeLevel);

// update user status by identifier
router.put('/status', jwt.verifyAdmin, user.updateStatus);

// get user privileges by identifier in cookies
router.get('/privilege', jwt.verifyLogin, user.getPrivilegeLevel);

module.exports = router;