// entry point
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const server = require('http').Server(app);

//bodyParser: 解析 HTTP 請求的 body
app.use(bodyParser.urlencoded({ extended: false }));
//express.json: 處理 JSON 資料
app.use(express.json());
app.use(cookieParser()); //解析 HTTP 請求的 cookie

// routing
// api
app.use("/api/login", require("./api/login.js"));
app.use("/api/info", require("./api/info.js"));
app.use("/example", require("./example.js"));

server.listen(3000, function () {
    console.log('Node server is running..');
});
