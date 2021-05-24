const mongoose = require('mongoose')

const ReportsSchema = ({
  name: {
    type: String,
    required: true
  },

  studentUserName: {
    type: String,
  },
  AssesmentId: {
    type: String,
    required: true
  }, 
  topicName: {
    type: String,
  },
  GameName: {
    type: String,
  },


  Sub: [{

    Question: {
      type: String,

    },
    CrtAns: {
      type: Number,

    },
    UserAns: {
      type: Number,

    },
    Result: {
      type: String,

    },



  }, { strict: false }],



  Total: {
    type: Number,

  },
  Avg: {
    type: Number,
  }






})

module.exports = mongoose.model('Reports', ReportsSchema)