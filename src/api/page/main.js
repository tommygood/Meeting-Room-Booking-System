const router = require('express').Router();
const config = require("./../utilities/config.js");
const util = require("./../utilities/main.js");
const path = require('path');

router.get('/main', async function(req, res) {
    try {
      // use path.resolve to get the absolute path
      res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Page_welcome.html'));
    }
    catch(e) {
        console.log(e);
    }
})

router.get('/lobby', async function(req, res) {
    try {
		// use path.resolve to get the absolute path
		res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/lobby.html'));
    }
    catch(e) {
        console.log(e);
    }
})

module.exports = router;
