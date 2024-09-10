const router = require('express').Router();
const config = require("./../utilities/config.js");
const util = require("./../utilities/main.js");
const jwt = require('./../utilities/jwt.js');
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

// 跳轉到看板預覽
router.get('/board_preview', async function (req, res) {
    try {
        // 要再加上：根據「預覽設定」的日期時間，設定預覽看板的時間點
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

// 跳轉到看板播放
router.get('/board_show', async function (req, res) {
    try {
        // 要再加上：根據「目前」的日期時間，設定看板的資訊
        // 每間隔5分鐘，重新載入資訊(同步更新管理者的修改)
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
