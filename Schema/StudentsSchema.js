const mongoose = require('mongoose')

const StudentsSchema = mongoose.Schema({

    class: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rollno:{
        type:String,
        required:true
    }


})

module.exports=mongoose.model('Students',StudentsSchema)