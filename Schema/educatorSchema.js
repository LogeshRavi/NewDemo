const mongoose = require('mongoose')

const educatorSchema = mongoose.Schema({
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
   
})

module.exports=mongoose.model('educator',educatorSchema)