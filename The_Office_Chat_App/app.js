const express = require("express");
const db = require("./pkg/db/index");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");

const app = express();

const authHandler = require("./handlers/authHandler");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

db.init();

app.use(jwt.expressjwt({
  algorithms: ["HS256"],
  secret: process.env.JWT_SECRET,
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    if (req.cookies.jwt) {
      return req.cookies.jwt;
    }
    return null;
  },
})
  .unless({
    path: ["/register-page", "/login-page"],
  })
);

// app.get("/theofficechatapp"/////////);
app.post("/register-page", authHandler.register);
app.post("/login-page", authHandler.login);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log("Server can not start");
  }
  console.log(`Server started successfully on port ${process.env.PORT}`);
});