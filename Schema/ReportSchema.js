const mongoose = require('mongoose')

const ReportSchema = mongoose.Schema({

    // class: {
    //     type: String,
    //     required: true,
    // },
    rollno:{
        type:String,
        required:true
    },
    // gameReport:[{
    //     gameName:[{ type:String,required:true}],
    //     correctAns:[{type:String,required:true}],
    //     wrongAns:[{type:String,required:true}],
    //     timeTaken:[{type:String,required:true}]
    // }]

    gameReport:[{
            gameName:String,
            correctAns:String,
            wrongAns:String,
            timeTaken:String
        }]




})

module.exports=mongoose.model('Reports',ReportSchema)