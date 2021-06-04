const express = require('express')
const app=express();
const mongoose=require('mongoose');
const userRouter=require('./userRoute')
const morgan = require('morgan')
const cors=require('cors')
const formData = require('express-form-data')
var bodyParser = require('body-parser')
const Reports=require('./Reports')
const Schools=require('./School')

//app.use(formData.parse());
app.use(express.json());
app.use(bodyParser.urlencoded({  extended: true }))
app.set('view engine', 'ejs')
//app.use(formidableMiddleware());
app.use(morgan('dev'))

app.use(cors())

app.use('/api',userRouter);
app.use('/api',Reports);
app.use('/api',Schools)

mongoose.connect('go db link',
                 {useNewUrlParser: true,
                     useUnifiedTopology: true});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);

});

