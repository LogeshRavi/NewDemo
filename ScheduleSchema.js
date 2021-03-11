const mongoose = require('mongoose')

const ScheduleSchema = mongoose.Schema({
    className:{
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
    }


})

module.exports=mongoose.model('Schedule',ScheduleSchema)