const router = require('express').Router();
const config = require("./../utilities/config.js");
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
const path = require('path');
const User = require('./../model/user.js');

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

router.get('/userlobby', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc) {
      // use path.resolve to get the absolute path
      res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/userlobby.html'));
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

// get the page for admin to check the user privilege and violation
router.get('/privilege', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc && await User.isAdmin(result.data.data)) {
      // use path.resolve to get the absolute path
      res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerPrivilege.html'));
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

// get the page for admin to show all the conferences which can be edited
router.get('/conference', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc && await User.isAdmin(result.data.data)) {
      // use path.resolve to get the absolute path
      res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerConference.html'));
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

// get the page for admin to show all the logs
router.get('/log', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc && await User.isAdmin(result.data.data)) {
      // use path.resolve to get the absolute path
      res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerLog.html'));
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

module.exports = router;
