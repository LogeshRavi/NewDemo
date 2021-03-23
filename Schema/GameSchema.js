const mongoose = require('mongoose')

const GameSchema = mongoose.Schema({
    subjectName:{
        type:String,
        required:true,
    },
    gamename:{
        type:String,
        required:true,
    }

})

module.exports=mongoose.model('Gamelist',GameSchema)