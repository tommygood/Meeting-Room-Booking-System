// Required modules
const router = require('express').Router();
const util = require("./utilities/main.js");

router.get('/', async function(req, res) {
    try {
		console.log("example", util.getParentPath(__dirname));
		//res.sendFile("example.html");
		res.sendFile(util.getParentPath(__dirname) + '/api/example.html');
    }
    catch(e) {
        console.log(e);
    }
})

module.exports = router;
