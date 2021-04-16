const router = require('express').Router();
const User=require('./Schema/userSchema');
const Schedule=require('./Schema/ScheduleSchema');
const Assesment=require('./Schema/AssesmentSchema')
const Students=require('./Schema/StudentsSchema');
const Gamelist=require('./Schema/GameSchema')
const Teacher=require('./Schema/TeacherSchema')
// const {Reports}=require('./Schema/ReportSchema')
// const {Book} = require('./Schema/ReportSchema')

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

  const Book = mongoose.model('Reports', 
  new mongoose.Schema({
      userId: {
          type: String,
          required:true
      },
      Rollno:{
        type: String,
        required:true
    },
    author:[asc]
   
  })
  );
    


router.post("/classwise/report",async(req,res)=>{

    async function createReport(Rollno ,userId , author) {
        const book = Book({
            Rollno ,userId, author
        })
        const result = await book.save();
        console.log(result);
        res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!",User:result})
    }

    createReport('01' ,'677777' , 
[new Author({GameName: 'Fahad Taha',
Question:'Python developer',CrtAns:23, userAns:23}),
{GameName: 'Fahad Taha',
Question:'Python developer',CrtAns:23, userAns:23},
{GameName: 'Fahad Taha',
Question:'Python developer',CrtAns:23, userAns:23},
]
    )

})
















module.exports=router;