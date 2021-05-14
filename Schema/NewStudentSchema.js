const mongoose = require('mongoose')

const childSchema = mongoose.Schema({

  

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
        },
        Email:{
            type:String
        },
        UserName:{
            type:String,
            required:true,
        }
    
    
    
})


module.exports=mongoose.model('child',childSchema)