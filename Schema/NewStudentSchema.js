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
            type:String,
            required:true,
        },
        ProfilePictureId:{
            type:String,
            
        }
        
    
    
    
})


module.exports=mongoose.model('child',childSchema)