// Required modules
const router = require('express').Router();
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');
const Log = require('./../model/log.js');
const Operator = require('./../model/operator.js');

class Violation {
    constructor() {
        this.model = require('./../model/violation.js');
        this.get = this.get.bind(this);
        this.insert = this.insert.bind(this);
        this.delete = this.delete.bind(this);
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
            const {reserve_id, reason, remark} = req.body;
            const suc = await this.model.insert(reserve_id, reason, remark);
            res.json({suc});
            // log the action
            Log.insert(req.ip, Operator.getOperator.violationInsert.code, req.identifier);
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const violation_id = req.body.violation_id;
            const suc = await this.model.delete(violation_id);
            res.json({suc});
            // log the action
            Log.insert(req.ip, Operator.getOperator.violationDelete.code, req.identifier);
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }
}

const violation = new Violation();

// get all violation records which status is 0
router.get('/', jwt.verifyAdmin, violation.get);

// insert violation record by identifier
router.post('/', jwt.verifyAdmin, violation.insert);

// delete violation record by violation id
router.delete('/', jwt.verifyAdmin, violation.delete);

module.exports = router;
module.exports.Violation = Violation;