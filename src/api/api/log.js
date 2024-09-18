// Required modules
const router = require('express').Router();
const Log = require('./../model/log.js');
const User = require('./../model/user.js');
const jwt = require('./../utilities/jwt.js');

router.get('/', async function(req, res) {
	try {
		// Verify the token
		const result = jwt.verifyJwtToken(req.cookies.token);
		if (result.suc && await User.isAdmin(result.data.data)) {
            const offset = req.query.offset;
            const num = req.query.num;
			const data = await Log.get(offset, num);
			res.json({data});
		}
		else {
			res.status(403);
			res.json({result : 'Invalid token'});
		}
    }
    catch(e) {
        console.error(e);
		res.status(500);
        res.json({result : 'error'});
    }
})

module.exports = router;
