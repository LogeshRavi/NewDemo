const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    class:[{
        type:String,
        required:true
    }],

    schoolName:{
        type:String,
        required:true,

    },
    rollno:{
        type:String,
        required:true,
    },

    empid:{
        type:String,
        required:true,
    },

    // code:{
    //     type:String,
    //     required:true,
    // },


    password:{
        type:String,
        required:true,
    },
    
})

module.exports=mongoose.model('User',UserSchema)

