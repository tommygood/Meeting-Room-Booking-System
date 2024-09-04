// entry point
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const server = require('http').Server(app);
const cors = require('cors');
const util = require("./utilities/main.js");
const templates_path = util.getParentPath(__dirname) + "/templates";

//bodyParser: 解析 HTTP 請求的 body
app.use(bodyParser.urlencoded({ extended: false }));
//express.json: 處理 JSON 資料
app.use(express.json());
app.use(cookieParser()); //解析 HTTP 請求的 cookie
app.set('trust proxy', true); // trust first proxy to get the client IP address


// routing
// api
// 有改
app.use('/api',cors({
    origin:[ 'http://localhost']
}));

app.use("/api/login", require("./api/login.js"));
app.use("/api/info", require("./api/info.js"));
app.use("/api/log", require("./api/log.js"));
app.use("/api/reservation", require("./api/reservation.js"));
app.use("/api/violation", require("./api/violation.js"));
app.use("/api/room", require("./api/room.js"));
app.use("/api/user", require("./api/user.js"));
app.use("/page", require("./page/main.js"));
app.use("/example", require("./example.js"));
app.use("/css", express.static(templates_path + '/css'));
app.use("/image", express.static(templates_path + '/image'));
app.use("/js", express.static(templates_path + '/js'));


server.listen(3000, function () {
    console.log('Node server is running..');
});
