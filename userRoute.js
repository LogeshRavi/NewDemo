const router = require('express').Router();
const User=require('./Schema/userSchema');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const Schedule=require('./Schema/ScheduleSchema');
const Assesment=require('./Schema/AssesmentSchema')
const Students=require('./Schema/StudentsSchema');
const Gamelist=require('./Schema/GameSchema')
const Teacher=require('./Schema/TeacherSchema');
const { duration } = require('moment');


//teacher register
router.post('/teacher/register', async(req,res)=>{
    try {
        var empidExist=  await User.findOne({empid:req.body.empid})
        if(empidExist){
            return res.json({StatusCode:400,StatusMessage:"Failure",Response:"Employee ID Already Exist"})
        }
        // var schoolExist=await User.findOne({schoolName:req.body.schoolName})

        // if(schoolExist){
           
        //   var validCode = await User.compare(req.body.code,schoolExist.code)
        //   console.log('not success')
        //       if(validCode){
                  
        //         return res.status(200).json({status:200,message:"successfully register"})
        //       }
        //     //   else{
        //     //     return res.status(400).json({status:400,message:"code not valid"})
        //     //   }
        // }
       


      //  var hash= await bcrypt.hash(req.body.password,10)

      var teacher=new Teacher({
        name:req.body.name,
        class:req.body.class,
        empid:req.body.empid
    })
     var data=await teacher.save()

        const user=new User({
                       name:req.body.name,
                       class:req.body.class,
                       schoolName:req.body.schoolName,
                       empid:req.body.empid,
                     //  code:req.body.code,
                       rollno:01,
                       password:req.body.password,
                   })

        var data= await user.save();
        res.json({StatusCode:200,StatusMessage:"Success",Response:"Register Successfully",user:data})
      
        
    } catch (error) {
        res.status(400).json(error)
    }
})


//student register
router.post('/student/register', async(req,res)=>{
    
    try {
        var rollnoExist=  await User.findOne({rollno:req.body.rollno})

        if(rollnoExist){
         
            return res.json({StatusCode:400,StatusMessage:"Failure",Response:"Roll Number Already Exist"})
        }

            var student=new Students({
                name:req.body.name,
                class:req.body.class,
                rollno:req.body.rollno
            })
             var data=await student.save()
           
       // var hash= await bcrypt.hash(req.body.password,10)
        const user=new User({
                       name:req.body.name,
                       class:req.body.class,
                        schoolName:req.body.schoolName,
                       empid:1,
                       rollno:req.body.rollno,
                       password:req.body.password,
                   })

       

        var data= await user.save();
        // res.json(data);
        res.json({StatusCode:200,StatusMessage:"Success",Response:"Register Successfully",user:data})
        
    } catch (error) {
        res.status(400).json(error)
    }
})

//login
router.post('/login',async(req,res)=>{
    try {
    if(req.body.name && !data){
        var data = await User.findOne({empid: req.body.name})  
    }
    if(req.body.name && !data){
       var data = await User.findOne({rollno: req.body.name})  
   }
    if(!data){
      return res.json({StatusCode:400,StatusMessage:"Failure",Response:"User Not Found"})
    }
    else{
       
       // var validpassword = await User.compare(req.body.password,data.password);
        
        if(req.body.password==data.password){
         
           var userToken=await jwt.sign({_id:data.id}||{ _id:data.id},'secretkey')
           res.header('auth',userToken).send({StatusCode:200,StatusMessage:"Success",Response:"Login Successfully",token:userToken,user:data})
        
        }
        else{
           
            return res.json({StatusCode:400,StatusMessage:"Failure",Response:"Password Not Valid"})
        }
    }
        
    } catch (error) {
        res.status(400).json(error)
    }
})

const ValidUser = (req,res,next)=>{
    var token=req.header('auth');

    jwt.verify(token,'secretkey',(err,payload)=>{
        if(err){

        }
      //  console.log(payload)
        const id=payload
            User.findById(id).then(data=>{
                req.user=data
                next()
            })
    })
}


//teacher Update
router.post("/teacher/update",ValidUser,async(req,res)=>{
    const eid=req.user.id
    
      
            var update=await User.updateMany({empid:req.body.empid},{$set:{
                name:req.body.name,
                 class:req.body.class,
                 schoolName:req.body.schoolName,
                empid:req.body.empid,
                password:req.body.password
            }})
            //return res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!",User:update})
      
            var result= await User.findById(eid,function (req,rest) {
               
                return res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!",User:rest})
            })
            
})

//student Update
router.post("/student/update",ValidUser,async(req,res)=>{
    const eid=req.user.id
    
           // var hash1= await bcrypt.hash(req.body.password,10)
            var update=await User.updateMany({rollno:req.body.rollno},{$set:{
                name:req.body.name,
                 class:req.body.class,
                 schoolName:req.body.schoolName,
                 rollno:req.body.rollno,
                password:req.body.password
            }})

            var update=await Students.updateMany({rollno:req.body.rollno},{$set:{
                name:req.body.name,
                 class:req.body.class,
                 rollno:req.body.rollno,
                
            }})





            var result= await User.findById(eid,function (req,rest) {
               
                return res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!",User:rest})
            })
         
       
})


//new class schedule
router.post("/scheduleclass/kg",ValidUser,async(req,res)=>{
    

    var createTime = new Date();
    var endtime = new Date();
    endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
    var CurrentTime=new Date()
    if(endtime.getTime()<CurrentTime){
        isCompleted="Y"
    }
    else{
        isCompleted="N"
    }

    const noofstudents=req.body.StudentsList.length
  const schedule=new Schedule({
      className:req.body.className,
      subject:req.body.subject,
      GameName:req.body.GameName,
      class:req.body.class,
      duration:req.body.duration,
      NoOfStudents:noofstudents,
      StudentsList:req.body.StudentsList,
      CreatedTime:createTime,
      endTime:endtime,
      isCompleted:isCompleted,
      RemainingTime:req.body.duration,
      CreatedBy:req.user.name,
      empid:req.user.empid
  })



var data= await schedule.save();
    res.json({StatusCode:200,StatusMessage:"Success",Response:"Schedule Successfully",schedule:data})
  
  
    
}) 




//fetch schedule data

    router.get("/schedule/alldata",ValidUser,async(req,res)=>{
        const username =req.user.empid
    Schedule.find({empid:username},{}, { sort: { 'CreatedTime' : -1 } }, async function(err, result) {

       
     if (result) {
    for  (var {id: id,  CreatedTime: Ct,duration:d} of result) {
        var endtime = new Date();
      await  endtime.setTime(Ct.getTime() + (d * 60 * 1000));
        var CurrentTime=new Date()
        
        if(endtime.getTime()<CurrentTime.getTime()){
            isCompleted="Y"
           }
            else{
            isCompleted="N"
         }
         if(isCompleted=="N"){
             Rt= endtime.getTime()-CurrentTime.getTime()
        }else{
            Rt=0     
        }
            
        await Schedule.findByIdAndUpdate( id, {$set: {
            isCompleted:isCompleted,
            RemainingTime:Rt
        }}), 
         {new: true},
         
        function(err,user){
            if(err){
               console.log("Error")
            } else{ 

            }
        };
      
      }   

             const data=  Schedule.find({empid:username},{}, { sort: { 'CreatedTime' : -1 } },function (req,results) {
                res.send({StatusCode:200,StatusMessage:"Success",Schedule_Class:results});
         })

     
 } else {
        res.send(err);
      }
    });
  });
      
//Assesment 
  router.post("/assesment/kg",ValidUser,async(req,res)=>{
    var createTime = new Date();
    var endtime = new Date();
    
    endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
    var CurrentTime=new Date()
    if(endtime.getTime()<CurrentTime){
        isCompleted="Y"
    }
    else{
        isCompleted="N"
    }

    const noofstudents=req.body.StudentsList.length
  

  const assesment=new Assesment({
    AssessmentName:req.body.AssessmentName,
      subject:req.body.subject,
      GameName:req.body.GameName,
      class:req.body.class,
      duration:req.body.duration,
      NoOfStudents:noofstudents,
      StudentsList:req.body.StudentsList,
      CreatedTime:createTime,
      endTime:endtime,
      isCompleted:isCompleted,
      CreatedBy:req.user.name,
      RemainingTime:req.body.duration,
      empid:req.user.empid
  })

 

  var data= await assesment.save();
  res.json({StatusCode:200,StatusMessage:"Success",Response:"Schedule Successfully",Assesment:data})
   
  })

//get assesment data
//router.route("/assesment/alldata").get(function(req, res) {
    router.get("/assesment/alldata",ValidUser,async(req,res)=>{
        const username =req.user.empid
    Assesment.find({CreatedBy:username},{}, { sort: { 'CreatedTime' : -1 } }, function(err, result) {
      if (result) {
    for (var {id: id,  CreatedTime: Ct,duration:d} of result) {
        var endtime = new Date();
        endtime.setTime(Ct.getTime() + (d * 60 * 1000));
        var CurrentTime=new Date()
        console.log(id)
        console.log(CurrentTime.getTime())
        console.log(endtime.getTime())
        if(endtime.getTime()<CurrentTime.getTime()){
            isCompleted="Y"
           }
            else{
            isCompleted="N"
         }

         if(isCompleted=="N"){
            Rt= endtime.getTime()-CurrentTime.getTime()
       }else{
           Rt=0     
       }
         Assesment.findByIdAndUpdate( id, {$set: {
            isCompleted:isCompleted,
            RemainingTime:Rt
        }}, 
         {new: true},
        function(err,user){
            if(err){
               console.log("Error")
            } else{
                
            }
        });
      }
      const data=  Schedule.find({CreatedBy:username},{}, { sort: { 'CreatedTime' : -1 } },function (req,results) {
        res.send({StatusCode:200,StatusMessage:"Success",Schedule_Class:results});
 })
    } else {
           res.send(err);
         }
       });
     });

 //get student name
     router.route("/classstudent").post(function(req, res) {
        const cursor = Students.find({"class":req.body.class},(function(err, results){    
               res.json(results)
        }) );
     })

     //GET GAME
       router.route("/gameselection").post(function(req, res) {
        const cursor = Gamelist.find({subjectName:req.body.subjectName},(function(err, results){
              res.json(results)
        }) );
     })


     //delete student details
     router.route("/deleteStudents").delete(function(req,res){
         var id=req.query.id;
         const data=Students.findByIdAndDelete(id,function(err,results){
             res.json(results)
         })
     })

     
     //Get Student Class
     router.get("/getStudentClass1",ValidUser,async(req,res)=>{
        const user=req.user.name
        console.log(user)
        const Class=Schedule.find({ StudentsList:user },function(req,results) {
            console.log(results) 
            res.json(results)     
        }
    )
     })

     //get Student Class
     router.get("/getStudentAssessment1",ValidUser,async(req,res)=>{
        const user=req.user.name
        console.log(user)
        const Class=Assesment.find({ StudentsList:user },function(req,results) {
            console.log(results)
            res.json(results)     
        }
    )
     })

    router.get("/getTeacherClass",ValidUser,async(req,res)=>{
        const ClassName=req.user.class
        res.json({StatusCode:200,StatusMessage:"Success",Response:"Schedule Successfully",ClassName:ClassName})
    })


    router.get("/getStudentClass",ValidUser,async(req,res)=>{
        const username =req.user.rollno
        console.log(username)
    Schedule.find({StudentsList:username},{}, { sort: { 'CreatedTime' : -1 } }, async function(err, result) {
       console.log(result)
       
     if (result) {
    for  (var {id: id,  CreatedTime: Ct,duration:d} of result) {
        var endtime = new Date();
      await  endtime.setTime(Ct.getTime() + (d * 60 * 1000));
        var CurrentTime=new Date()
        
        if(endtime.getTime()<CurrentTime.getTime()){
            isCompleted="Y"
           }
            else{
            isCompleted="N"
         }
         if(isCompleted=="N"){
             Rt= endtime.getTime()-CurrentTime.getTime()
        }else{
            Rt=0     
        }
            
        await Schedule.findByIdAndUpdate( id, {$set: {
            isCompleted:isCompleted,
            RemainingTime:Rt/60000
        }}), 
         {new: true},
         
        function(err,user){
            if(err){
               console.log("Error")
            } else{ 

            }
        };
      
      }   

             const data=  Schedule.find({StudentsList:username},{}, { sort: { 'CreatedTime' : -1 } },function (req,results) {
                res.send({StatusCode:200,StatusMessage:"Success",Schedule_Class:results});
         })

     
 } else {
        res.send(err);
      }
    });
  });


  router.get("/getStudentAssessment",ValidUser,async(req,res)=>{
    const username =req.user.rollno
    console.log(username)
Assesment.find({StudentsList:username},{}, { sort: { 'CreatedTime' : -1 } }, async function(err, result) {
   console.log(result)
   
 if (result) {
for  (var {id: id,  CreatedTime: Ct,duration:d} of result) {
    var endtime = new Date();
  await  endtime.setTime(Ct.getTime() + (d * 60 * 1000));

    var CurrentTime=new Date()
    
    if(endtime.getTime()<CurrentTime.getTime()){
        isCompleted="Y"
       }
        else{
        isCompleted="N"
     }
     if(isCompleted=="N"){
         Rt= endtime.getTime()-CurrentTime.getTime()
    }else{
        Rt=0     
    }
        
    await Assesment.findByIdAndUpdate( id, {$set: {
        isCompleted:isCompleted,
        RemainingTime:Rt
    }}), 
     {new: true},
     
    function(err,user){
        if(err){
           console.log("Error")
        } else{ 
        }
    };
  }   
         const data=  Assesment.find({StudentsList:username},{}, { sort: { 'CreatedTime' : -1 } },function (req,results) {
            res.send({StatusCode:200,StatusMessage:"Success",Schedule_Class:results});
     })

} else {
    res.send(err);
  }
});
});
      

    




       

     


    



module.exports=router;