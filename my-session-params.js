// this file assumes that you have configured env vars
const env = require('dotenv');

env.config();
var sessParams = {
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie:{},
};

if (process.env.ENV_NAME === "prod") {
  console.log("production env");
  //TODO move to app.js
  //app.set('trust proxy', 1) // trust first proxy
  sessParams.cookie.secure = true // serve secure cookies
  var hour = 3600000
  sessParams.cookie.maxAge = hour
} else if (process.env.ENV_NAME === "dev") {
  console.log("developement env");
  sessParams.cookie.secure = false // serve secure cookies
  var hour = 3600000
  sessParams.cookie.maxAge = hour
} else{
  console.error("your ENV_NAME is not set");
}

module.exports = sessParams;
