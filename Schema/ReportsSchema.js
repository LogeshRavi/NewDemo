const mongoose = require('mongoose')

const ReportsSchema = ({
  name: {
    type: String,
    required:true
 },
  class: {
    type: String,
    required:true
 },
    rollno: {
    type: String,
    required:true
 },
    AssesmentId: {
    type: String,
    required:true
},
GameName: {
  type: String,
  
},

 
Sub:[{
 
    Question:{
      type: String,
      
    },
    CrtAns:{
      type: Number,
     
    },
    UserAns:{
    type: Number,
    
    },
    Result:{
      type: String,
      
      },
  
    

},{strict: false}],

        

Total:{
  type: Number,
 
  },
  Avg:{
    type: Number,
  }

        
    
    


})

module.exports=mongoose.model('Reports',ReportsSchema)