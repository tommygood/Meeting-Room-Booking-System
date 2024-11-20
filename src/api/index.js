// entry point
const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const server = require("http").Server(app);
const cors = require("cors");
const util = require("./utilities/main.js");
const templates_path = util.getParentPath(__dirname) + "/templates";
const config = require("./utilities/config.js");

// disable the x-powered-by header
app.disable("x-powered-by");

// session management
const session = require("express-session");

// set X-Content-Type-Options header to prevent MIME sniffing
app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "same-origin");
  res.set("X-Content-Type-Options", "nosniff");
  // Set Content Security Policy (CSP) header
  res.setHeader("Content-Security-Policy", "default-src 'self' https://cdn.jsdelivr.net http://localhost:3000 https://cdnjs.cloudflare.com; img-src 'self' data: http://localhost:3000; style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.quilljs.com https://cdn.jsdelivr.net; script-src 'self' https://cdn.jsdelivr.net http://localhost:3000 https://cdnjs.cloudflare.com https://unpkg.com https://cdn.quilljs.com; font-src 'self' https://cdn.jsdelivr.net data:;");

  next();
});

app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// bodyParser: 解析 HTTP 請求的 body
// set limit size for request, this must be set before the express.json()
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

//express.json: 處理 JSON 資料
app.use(express.json());
app.use(cookieParser()); //解析 HTTP 請求的 cookie
app.set("trust proxy", true); // trust first proxy to get the client IP address

// routing
// api
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/api/login", require("./api/login.js"));
app.use("/api/info", require("./api/info.js"));
app.use("/api/log", require("./api/log.js"));
app.use("/api/reservation", require("./api/reservation.js"));
app.use("/api/violation", require("./api/violation.js"));
app.use("/api/room", require("./api/room.js"));
app.use("/api/user", require("./api/user.js"));
app.use("/api/doc", require("./api/doc.js"));

const history = require("connect-history-api-fallback");
app.use(history());
const path = util.getParentPath(__dirname) + "/MRBS-frontend/dist";
app.use(express.static(path));

server.listen(3000, function () {
  console.log("Node server is running..");
});
