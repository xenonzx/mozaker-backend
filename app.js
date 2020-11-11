const express = require('express')
const AdminBro = require('admin-bro')
const env = require('dotenv');
const AdminBroExpress = require('@admin-bro/express')

env.config();
const app = express()
const defaultPort = 3000
let port = process.env.PORT || defaultPort

const adminBro = new AdminBro ({
    Databases: [],
    rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter (adminBro)
app.use(adminBro.options.rootPath, router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// todo  remove mongoose
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian2' });
kitty.save().then(() => console.log('meow2'));

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
    console.log(`AdminBro is under localhost:${port}/admin`)
});
  
  