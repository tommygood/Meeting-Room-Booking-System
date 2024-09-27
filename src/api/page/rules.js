const router = require('express').Router();
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
const path = require('path');
const User = require('./../model/user.js');

// get the page for admin to edit the rules
router.get('/', jwt.pageVerifyAdmin, async function(req, res) {
    try {
        // use path.resolve to get the absolute path
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerTextedit.html'));
    }
    catch(e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
})

// get the page for anyone to check the rules
router.get('/demo', function(req, res) {
    try {
        // use path.resolve to get the absolute path
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/RulesDemo.html'));
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;