const mongoose = require('mongoose')

const dummySchema = ({

    Rollno: {
    type: String,
    required:true
 },
    ClassId: {
    type: String,
    required:true
},
 
Sub:[{
  GameName: {
    type: String,
    required:true
  },
  Reports:[]
    // Question:{
    //   type: String,
    //   required:true
    // },
    // CrtAns:{
    //   type: Number,
    //   required:true
    // },
    // userAns:{
    // type: Number,
    // required:true
    // }
  

},{strict: false}]
        



        
    
    


})

module.exports=mongoose.model('Reports',dummySchema)