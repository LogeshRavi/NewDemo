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
    AddStudent:[{

        StudentName :{
            type:String,
            required:true,
        },
        Age:{
            type:String,
            required:true,
        },
        School:{
            type:String,
            required:true,
        },
        ModeofEducation:{
            type:String,
            required:true,
        },
        studentUserName:{
            type:String,
            required:true,
        },
        studentPassword:{
            type:String,
            required:true,
        }

    
    }]
})

module.exports=mongoose.model('educator',educatorSchema)