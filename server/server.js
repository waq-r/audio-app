require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const userRoutes = require('./routes/user')
const fileRoutes = require('./routes/file')
const videoRoutes = require('./routes/video')
const audioRoutes = require('./routes/audio')
const notificationRoutes = require('./routes/notification')

// express app
const app = express()

// middleware
app.use(express.json())
app.use(fileUpload());


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/audio', audioRoutes)
app.use('/api/file', fileRoutes)
app.use('/api/user', userRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/video', videoRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI).then(() => {
// listen for requests
app.listen(process.env.PORT, () => {
    console.log('Connected to db, listening to port ', process.env.PORT)
})
}).catch((err) => {
    console.log(err)
})


// app.get('/stream', (req, res) => {

//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders(); // flush the headers to establish SSE with client

//     let counter = 0;
//     let interValID = setInterval(() => {
//         counter++;
//         if (counter >= 10) {
//             clearInterval(interValID);
//             res.end(); // terminates SSE session
//             return;
//         }
//         res.write(`data: ${JSON.stringify({admin: 1})}\n\n`); // res.write() instead of res.send()
//     }, 10000);

//     // If client closes connection, stop sending events
//     res.on('close', () => {
//         console.log('client dropped me');
//         //clearInterval(interValID);
//         res.end();
//     });
// });

app.get('/', (req, res) => {
    res.send('Hello World!')
}
)