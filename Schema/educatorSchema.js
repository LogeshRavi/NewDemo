const mongoose = require('mongoose')

const educatorSchema = mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    eUserName:{
        type:String,
        required:true,
    },
    ePassword:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    status:{
        type:String,
    },
    isVerify:{
        type:String
    },
    otp:{
        type:Number
    }
   
})

module.exports=mongoose.model('educator',educatorSchema)