// Required modules
const router = require('express').Router();
const Violation = require('./../model/violation.js');
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');
const Log = require('./../model/log.js');
const Operator = require('./../model/operator.js');

// get all violation records which status is 0
router.get('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const data = await Violation.get();
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

// insert violation record by identifier
router.post('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const reserve_id = req.body.reserve_id;
            const reason = req.body.reason;
            const remark = req.body.remark;
            const suc = await Violation.insert(reserve_id, reason, remark);
            res.json({suc});
            // log the action
            Log.insert(req.ip, Operator.getOperator.violationInsert.code, result.data.data);
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

// delete violation record by violation id
router.delete('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            const violation_id = req.body.violation_id;
            const suc = await Violation.delete(violation_id);
            res.json({suc});
            // log the action
            Log.insert(req.ip, Operator.getOperator.violationDelete.code, result.data.data);
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