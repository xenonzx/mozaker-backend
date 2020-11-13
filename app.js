const express = require('express')
const AdminBro = require('admin-bro')
const env = require('dotenv');
const mongoose = require('mongoose');
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')

env.config();
const app = express()
const defaultPort = 3000
let port = process.env.PORT || defaultPort

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
AdminBro.registerAdapter(AdminBroMongoose)

const messageSchema = new mongoose.Schema({ text: {type: String ,required: true} 
}, { timestamps: true });

const Message = mongoose.model('Messsage', messageSchema )

const AdminBroOptions = {
  resources: [Message],
}

const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

app.get('/', (req, res) => {
  res.send('Hello Worldd!')
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