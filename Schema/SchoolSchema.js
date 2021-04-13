const mongoose = require('mongoose')

const SchoolSchema = mongoose.Schema({
    
    school:{
        type:String,
        required:true
    },
    class:[{
        type:String,
        required:true
    }],
    expiryDate:{
        type:Date,
    }

})

module.exports=mongoose.model('School',SchoolSchema)