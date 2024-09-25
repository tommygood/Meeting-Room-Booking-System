// Required modules
const router = require('express').Router();
const Log = require('./../model/log.js');
const User = require('./../model/user.js');
const jwt = require('./../utilities/jwt.js');

router.get('/', jwt.verifyAdmin, async function(req, res) {
	try {
		const offset = req.query.offset;
		const num = req.query.num;
		const data = await Log.get(offset, num);
		res.json({data});
    }
    catch(e) {
        console.error(e);
		res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
