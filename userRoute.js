const router = require('express').Router();
const User=require('./userSchema');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const Schedule=require('./ScheduleSchema')



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

        const user=new User({
                       name:req.body.name,
                    //    class:req.body.class,
                    //    schoolName:req.body.schoolName,
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

        
       // var hash= await bcrypt.hash(req.body.password,10)
        const user=new User({
                       name:req.body.name,
                     //    class:req.body.class,
                    //    schoolName:req.body.schoolName,
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
         
           var userToken=await jwt.sign({empid:req.body.empid }||{ rollno:req.body.rollno},'secretkey')
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
    req.token=token
    next();
}

//teacher Update
router.put("/teacher/update",ValidUser,async(req,res)=>{
    jwt.verify(req.token,'secretkey',async(err,update)=>{
        if(err){
            res.json({StatusCode:403,StatusMessage:"Failure",Response:"Token Error"})
        }
        var empidExist1=await User.findOne({empid:req.body.empid})
        if(!empidExist1){
            return res.json({StatusCode:400,StatusMessage:"Failure",Response:"Employee ID Not Exist",empid:req.body.empid})
        }
        else{
           // var hash1= await bcrypt.hash(req.body.password,10)
            var update=await User.updateMany({empid:req.body.empid},{$set:{
                name:req.body.name,
                // class:req.body.class,
                // schoolName:req.body.schoolName,
                password:req.body.password
            }})
            return res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!",update,empid:req.body.empid})
        }
    }) 
})

//student Update
router.put("/student/update",ValidUser,async(req,res)=>{
    jwt.verify(req.token,'secretkey',async(err,update)=>{
        if(err){
            res.json({StatusCode:403,StatusMessage:"Failure",Response:"Token Error"})
        }
        else{
           // var hash1= await bcrypt.hash(req.body.password,10)
            var update=await User.updateMany({rollno:req.body.rollno},{$set:{
                name:req.body.name,
                // class:req.body.class,
                // schoolName:req.body.schoolName,
                password:req.body.password
            }})
            
            return res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!"})
        }
    }) 
})

//new class schedule
router.post("/scheduleclass/kg",async(req,res)=>{

    var createTime = new Date();
    var endtime = new Date();
    endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
    var CurrentTime=new Date()
    if(endtime.getTime()<CurrentTime){
        isCompleted="completed"
    }
    else{
        isCompleted="live"
    }

  const schedule=new Schedule({
      className:req.body.className,
      subject:req.body.subject,
      class:req.body.class,
      duration:req.body.duration,
      NoOfStudents:req.body.NoOfStudents,
      CreatedTime:createTime,
      endTime:endtime,
      isCompleted:isCompleted
  })
  var data= await schedule.save();
  res.json({StatusCode:200,StatusMessage:"Success",Response:"Schedule Successfully",schedule:data})

}) 

// complete and live status
router.route("/isCompleted/:id").get(function(req, res) {
    Schedule.findById(req.params.id, function(err, result) {
      if (result) {
        var endtime1=result.endTime
        var CurrentTime1=new Date()
        if(endtime1.getTime()<CurrentTime1){
            isCompleted="Completed"
        }
        else{
            isCompleted="Live"
        }
        return res.json({StatusCode:200,Response:isCompleted})
      } else {
        res.json(err);
      }
    });
  });




module.exports=router;