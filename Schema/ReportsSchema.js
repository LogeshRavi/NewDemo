const mongoose = require('mongoose')

const ReportsSchema = ({

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
    userAns:{
    type: Number,
    
    },
    Result:{
      type: String,
      
      },
  
    

},{strict: false}],

        

Total:{
  type: Number,
 
  }

        
    
    


})

module.exports=mongoose.model('Reports',ReportsSchema)