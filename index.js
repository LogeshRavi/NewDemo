const express = require('express')
const app=express();
const mongoose=require('mongoose');
const userRouter=require('./userRoute')
const morgan = require('morgan')
const cors=require('cors')

app.use(express.json());
app.use(morgan('dev'))

app.use(cors())

app.use('/api',userRouter);




// mongoose.connect('mongodb+srv://demo:hBjdsP9rTQaau7X@cluster0.jrdfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
//                  {useNewUrlParser: true,
//                      useUnifiedTopology: true});

app.listen(4000,()=>{
    console.log("localhost connected");
})