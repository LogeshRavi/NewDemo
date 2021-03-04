const express = require('express')
const app=express();
const mongoose=require('mongoose');
const userRouter=require('./userRoute')
const morgan = require('morgan')
const cors=require('cors')
const formData = require('express-form-data')
var bodyParser = require('body-parser')
const formidableMiddleware = require('express-formidable');

//app.use(formData.parse());
app.use(express.json());
//app.use(bodyParser.urlencoded({  extended: true }))
//app.use(formidableMiddleware());
app.use(morgan('dev'))

app.use(cors())

app.use('/api',userRouter);

mongoose.connect('mongodb+srv://demo:hBjdsP9rTQaau7X@cluster0.jrdfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                 {useNewUrlParser: true,
                     useUnifiedTopology: true});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});