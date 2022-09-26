require('dotenv').config()
const mongoose = require('mongoose')


const app = require('./app');

// connect to db
mongoose.connect(process.env.MONGO_URI).then(() => {
// listen for requests
app.listen(process.env.PORT, () => {
    console.log('Connected to db, listening to port ', process.env.PORT)
})
}).catch((err) => {
    console.log(err)
})