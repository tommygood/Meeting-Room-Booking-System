const router = require('express').Router();
const config = require("./../utilities/config.js");
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
const path = require('path');
const User = require('./../model/user.js');

router.get('/main', async function(req, res) {
  try {
    res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Page_welcome.html'));
  }
  catch(e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
})

router.get('/lobby', async function(req, res) {
  try {
    res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/lobby.html'));
  }
  catch(e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
})

router.get('/userlobby', jwt.verifyLogin, async function(req, res) {
  try {
    res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/userlobby.html'));
  }
  catch(e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
})

// get the page for admin to check the user privilege and violation
router.get('/privilege', jwt.verifyAdmin, async function(req, res) {
  try {
    res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerPrivilege.html'));
  }
  catch(e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
})

// get the page for admin to show all the conferences which can be edited
router.get('/conference', jwt.verifyAdmin, async function(req, res) {
  try {
    res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerConference.html'));
  }
  catch(e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
})

// get the page for admin to show all the logs
router.get('/log', jwt.verifyAdmin, async function(req, res) {
  try {
      res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerLog.html'));
  }
  catch(e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
})

module.exports = router;
