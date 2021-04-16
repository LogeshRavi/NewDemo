const mongoose = require('mongoose')

const asc =    mongoose.Schema({
    GameName: {
        type: String,
        required:true
    },
    Question:{
      type: String,
      required:true
    },
  CrtAns:{
      type: Number,
      required:true
  },
  userAns:{
    type: Number,
    required:true
},

})
const Author= mongoose.model('Author', asc);

  const Book = mongoose.model('Book', 
  new mongoose.Schema({
      name: {
          type: String,
          required:true
      },
      description:{
        type: String,
        required:true
    },
    author:[asc]
   
  })
  );
    





//module.exports=mongoose.model('Reports',ReportSchema)