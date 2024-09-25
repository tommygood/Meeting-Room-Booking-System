const router = require('express').Router();
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
const path = require('path');
const User = require('./../model/user.js');

router.get('/', jwt.verifyAdmin, async function(req, res) {
    try {
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerBoard.html'));
    }
    catch(e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
})

router.get('/preview', jwt.verifyAdmin, async function (req, res) {
    try {
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Board_preview.html'));
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/demo', async function (req, res) {
    try {
        // use path.resolve to get the absolute path
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Board_show.html'));
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;