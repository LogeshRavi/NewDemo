const mongoose = require('mongoose')

const AssesmentSchema = mongoose.Schema({
    AssessmentName:{
        type:String,
        required:true,
    },

    subject: {
        type:String,
        required:true,
    },

    class:{
        type:String,
        required:true,
    },

    duration:{
        type:String,
        required:true,
    },

    NoOfStudents:{
        type:String,
        required:true,
    },
    CreatedTime:{
      type:Date,
      required:true
    },

    endTime:{
        type:Date,
        required:true
    },
    isCompleted:{
        type:String,
        required:true
    },
    GameName: [{
        type: String, 
        required: false, 
        trim: true
    }],

    StudentsList:[{
        type:String,
        required:true,
        trime:true
    }],
    CreatedBy:{
        type:String,
        required:true,
        trim:true
    },
    RemainingTime:{
        type:String,
    },
    empid:{
        type:String
    }

})

module.exports=mongoose.model('Assesment',AssesmentSchema)