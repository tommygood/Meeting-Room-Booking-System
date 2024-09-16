const router = require('express').Router();
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
const path = require('path');
const User = require('./../model/user.js');

router.get('/', async function(req, res) {
    try {
      const result = jwt.verifyJwtToken(req.cookies.token);
      if (result.suc && await User.isAdmin(result.data.data)) {
        // use path.resolve to get the absolute path
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerBoard.html'));
      }
      else {
        res.redirect('/page/main');
      }
    }
    catch(e) {
      console.log(e);
      res.redirect('/page/main');
    }
})

router.get('/preview', async function (req, res) {
    try {
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc && await User.isAdmin(result.data.data)) {
            // use path.resolve to get the absolute path
            res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Board_preview.html'));
        }
        else {
            res.redirect('/page/main');
        }
    }
    catch (e) {
        console.log(e);
        res.redirect('/page/main');
    }
})

router.get('/demo', async function (req, res) {
    try {
        // use path.resolve to get the absolute path
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Board_show.html'));
    }
    catch (e) {
        console.log(e);
        res.redirect('/page/main');
    }
})

module.exports = router;