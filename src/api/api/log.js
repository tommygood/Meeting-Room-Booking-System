// Required modules
const router = require('express').Router();
const Log = require('./../model/log.js');
const jwt = require('./../utilities/jwt.js');

router.get('/', async function(req, res) {
	try {
		// Verify the token
		const result = jwt.verifyJwtToken(req.cookies.token);
		if (result.suc) {
            const offset = req.query.offset;
            const num = req.query.num;
			const data = await Log.get(offset, num);
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
})

module.exports = router;
