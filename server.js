const fs = require("fs");
const path = require("path");
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const multer = require('multer')
const morgan = require('morgan')
// const fileUpload = require('express-fileupload');


// const fillUpload = require('express-fileupload');


const app = express();
// app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('tiny'))
// app.use(fileUpload());

// app.use(fillUpload({
//     useTempFiles: true
// }))

// static file url ⚠️ npde js can't read static file path
app.use('/upload', express.static(__dirname + '/upload'));
// fs.readFileSync(path.join(__dirname + '/upload/' + req.file.filename))

// Routers
app.use('/user', require('./routes/userRouter'))
app.use('/api/v1', require('./routes/proRouter'))
app.use('/api', require('./routes/upload'))


// Connect on port mongoose database
const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
    useNewUrlParser : true,
}, err => {
    if(err) throw err;
    console.log(`connect to mongodb`)
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);


const PORT = process.env.PORT || 4000;
app.listen(PORT , () => {
    console.log(`server start on port: ${PORT} `)
})