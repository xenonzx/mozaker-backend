const express = require('express')
const AdminBro = require('admin-bro')
const env = require('dotenv');
const mongoose = require('mongoose');
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
const session = require('express-session');
var sessParams = require('./my-session-params');
const bcrypt = require('bcrypt')

env.config();
const app = express()
const defaultPort = 3000
let port = process.env.PORT || defaultPort

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
AdminBro.registerAdapter(AdminBroMongoose)

const messageSchema = new mongoose.Schema({ text: {type: String ,required: true} 
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ['admin', 'restricted'], required: true },
});

const User = mongoose.model('User', userSchema)
const Message = mongoose.model('Messsage', messageSchema )

const AdminBroOptions = {
  resources: [Message,User],
}
User.find().exec(function (err, users) {
  if (err) {
    console.error(err);
  }

  if (users.length == 0){
    console.log("no users in the system")
    insertSuperAdmin();
  }
})

function insertSuperAdmin(){
  const email = "superadmin"
  const password = "abcd"
  const encryptedPassword =  bcrypt.hashSync(password, 10) 
  var sAdmin = new User({email: email, encryptedPassword: encryptedPassword,role:'admin'});
  sAdmin.save(function(err, document){
    if (err) {
      console.error(err);
    }
    console.log("added super admin")
  })
}
//

const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
    
      //const matched = password==user.encryptedPassword
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
//TODO remove router 2
//const router2 = AdminBroExpress.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router);
app.use(session(sessParams));

app.get('/', (req, res) => {
  if(req.session.page_views){
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
 } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!!");
 }
})

app.get('/api/v1/messages', (req, res) => {
  var date = parseDateParam(req.query.time)
  
  console.log('time ' + req.query.time);
  console.log('time ' + date);
  
  Message.where('updatedAt').gt(date)
  .exec(function (err, messages) {
    if (err) {
      console.error(err);
      res.status(500).send();
    }
    res.send(messages);
  })
})

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
    console.log(`AdminBro is under localhost:${port}/admin`)
});
  
  
function parseDateParam(time){
  var date
  if (typeof time === 'undefined') {
    var defaultTime='2012-06-10T10:00:00+04:00';
    date = new Date(defaultTime);
  } else {
    date = new Date(time)
  }
  return date
}