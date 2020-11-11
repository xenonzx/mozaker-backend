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
const Message = mongoose.model('Messsage', { text: String })

const AdminBroOptions = {
  resources: [Message],
}

const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

app.get('/', (req, res) => {
  res.send('Hello Worldd!')
})

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
    console.log(`AdminBro is under localhost:${port}/admin`)
});
  
  