const router = require('express').Router();
const User=require('./Schema/userSchema');
const Schedule=require('./Schema/ScheduleSchema');
const Assesment=require('./Schema/AssesmentSchema')
const Students=require('./Schema/StudentsSchema');
const Gamelist=require('./Schema/GameSchema')
const Teacher=require('./Schema/TeacherSchema')
const Reports=require('./Schema/ReportSchema')


router.post("/gamewise/report",async(req,res)=>{
  
     const report=new Reports({
         rollno:req.body.rollno,
         gameReport:[{
         gameName:req.body.gameName,
         correctAns:req.body.correctAns,
         wrongAns:req.body.wrongAns,
         timeTaken:req.body.timeTaken
         }]
     })
     var data= await report.save();
     res.json({StatusCode:200,StatusMessage:"Success",Response:"Update Successfully",user:data})


})
















module.exports=router;