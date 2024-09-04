// Required modules
const router = require('express').Router();
const Violation = require('./../model/violation.js');
const jwt = require('./../utilities/jwt.js');

// get violation details by identifier
router.get('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const identifier = req.query.identifier;
            const data = await Violation.getByIdentifier(identifier);
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

// insert violation record by identifier
router.post('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const identifier = req.body.identifier;
            const reason = req.body.reason;
            const remark = req.body.remark;
            const suc = await Violation.insert(identifier, reason, remark);
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