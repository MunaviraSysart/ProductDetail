const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRoute = require('./routes/router');

//config env
dotenv.config()

//connecting to mongodb
mongoose.connect(process.env.DB_CONNECTION, () =>{
    console.log('db connected')
})

//json
app.use(express.json());

//image path
app.use(express.static('productimg'));

//initializing path
app.use('/api', productRoute)

//listening port
app.listen(process.env.PORT, () =>{
    console.log('app is running on port 8000')
})