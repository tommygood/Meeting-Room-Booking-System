// Required modules
const router = require('express').Router();
const util = require("./../utilities/utilities.js");
const jwt = require('jsonwebtoken');

router.post("/", async function(req, res) {
    try {
        const account = req.body.account;
        const password = req.body.password;
        res.json({suc : false});
    }
    catch(e) {
        console.log(e);
    }
})

module.exports = router;