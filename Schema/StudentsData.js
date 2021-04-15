const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema({
    // name:{
    //     type:String,
    //     required:true,

    // },
    // class:[{
    //     type:String,
    //     required:true,
    //     trim:true
    // }],

    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }

   
    
})

module.exports=mongoose.model('StudentsData',StudentSchema)

