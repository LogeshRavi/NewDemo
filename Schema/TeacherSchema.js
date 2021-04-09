const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    class:[{
        type:String,
        required:true,
        trim:true
    }],

    empid:{
        type:String,
        required:true,
    },

   
    
})

module.exports=mongoose.model('Teacher',UserSchema)

