const mongoose = require('mongoose')

const NewClassSchema = mongoose.Schema({
    topicName:{
        type:String,
        required:true,
    },

    subject: {
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
    studentsList:[{
        type:String,
        required:true,
        trim:true
    }],
    CreatedBy:{
        type:String,
        required:true,
        trim:true
    },
    RemainingTime:{
        type:String,
    },
    Date:{
        type:String
    }


})

module.exports=mongoose.model('Class',NewClassSchema )