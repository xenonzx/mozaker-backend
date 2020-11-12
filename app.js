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

const messageSchema = new mongoose.Schema({ text: {type: String ,required: true} ,
  created_at    : { type: Date, required: true, default: Date.now },
  updated_at    : { type: Date }
});

const Message = mongoose.model('Messsage', messageSchema )

messageSchema.post('save', function(next){
  console.error("save post");
  now = new Date();
  this.updated_at = now;
  next();
});

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
  Message.find(function (err, messages) {
    if (err) return console.error(err);
    res.send(messages);
  })
})
app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
    console.log(`AdminBro is under localhost:${port}/admin`)
});
  
  