// Required modules
const router = require('express').Router();
const User = require('./../model/user.js');
const jwt = require('./../utilities/jwt.js');
class Log {
	constructor() {
		this.model = require('./../model/log.js');
		this.get = this.get.bind(this);
	}

	async get(req, res) {
		try {
			const {offset, num, day_limit} = req.query;
			const data = await this.model.get(offset, num, day_limit);
			res.json({data});
		}
		catch(e) {
			console.error(e);
			res.status(500).send('Internal Server Error');
		}
	}
}

const log = new Log();

router.get('/', jwt.verifyAdmin, log.get);

module.exports = router;
