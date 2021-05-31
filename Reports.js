const router = require('express').Router();
const User=require('./Schema/userSchema');
const Schedule=require('./Schema/ScheduleSchema');
const Assesment=require('./Schema/AssesmentSchema')
const Students=require('./Schema/StudentsSchema');
const Gamelist=require('./Schema/GameSchema')
const Teacher=require('./Schema/TeacherSchema')
//const Dummy=require('./Schema/dummySchema')





router.post("/create/report",async(req,res)=>{

   
   const result=req.body.Sub[0].Result
  // console.log(result)
    
   var total=0
   for (var j = 0; j <3; j++){
    var bool=await req.body.Sub[j].Result
    if(bool=='True'){
        total=total+1
    }
  
    }
    var data4=[]

    sub_array = req.body.Sub


for (var j = 0; j <sub_array.length; j++){

  var  obj={

        
        Question:req.body.Sub[j].Question,
        CrtAns:req.body.Sub[j].CrtAns,
        UserAns:req.body.Sub[j].UserAns,
        Result:req.body.Sub[j].Result
    }
    data4[j]=obj

}


   const  data= await new Reports({
         name:req.body.name,
         AssesmentId:req.body.AssesmentId,
         studentUserName:req.body.studentUserName,
       //  topicName:req.body.topicName,
         GameName:req.body.GameName,
        Sub:
            data4
        ,


            Total:total
        
    }) 
    var data1= await data.save();

    res.json({StatusCode:200,StatusMessage:"Success",Response:"Report Add Successfully",schedule:data1})

})



module.exports=router;