const router = require('express').Router();
const config = require("./../utilities/config.js");
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
const path = require('path');

router.get('/main', async function(req, res) {
    try {
      console.log("test");
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

router.get('/rules', async function(req, res) {
    try {
      const result = jwt.verifyJwtToken(req.cookies.token);
      if (result.suc) {
        // use path.resolve to get the absolute path
        res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/ManagerTextedit.html'));
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

router.get('/privilege', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc) {
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

router.get('/conference', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc) {
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

router.get('/log', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc) {
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

router.get('/board', async function(req, res) {
  try {
    const result = jwt.verifyJwtToken(req.cookies.token);
    if (result.suc) {
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

// �����ݪO�w��
router.get('/board_preview', async function (req, res) {
    try {
        // �n�A�[�W�G�ھڡu�w���]�w�v������ɶ��A�]�w�w���ݪO���ɶ��I
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
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

// �����ݪO����
router.get('/board_show', async function (req, res) {
    try {
        // �n�A�[�W�G�ھڡu�ثe�v������ɶ��A�]�w�ݪO����T
        // �C���j5�����A���s���J��T(�P�B��s�޲z�̪��ק�)
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            // use path.resolve to get the absolute path
            res.sendFile(path.resolve(util.getParentPath(__dirname) + '../../templates/Board_show.html'));
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

module.exports = router;
