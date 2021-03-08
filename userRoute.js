const router = require('express').Router();
const User=require('./userSchema');
const bcrypt=require('bcryptjs');




router.post('/teacher/register', async(req,res)=>{
    
    try {
        
        var empidExist=  await User.findOne({empid:req.body.empid})

        if(empidExist){
            return res.json({message:"Employee ID already exist"})
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
       


        var hash= await bcrypt.hash(req.body.password,10)

        const user=new User({
                       name:req.body.name,
                       class:req.body.class,
                       schoolName:req.body.schoolName,
                       empid:req.body.empid,
                     //  code:req.body.code,
                       rollno:01,
                       password:hash,
                   })

                   
            

        var data= await user.save();
        res.json(data);
      
        
    } catch (error) {
        res.status(400).json(error)
    }
})



router.post('/student/register', async(req,res)=>{
    
    try {
        var rollnoExist=  await User.findOne({rollno:req.body.rollno})

        if(rollnoExist){
            return res.json({message:"Roll Number already exist"})
        }

        
        var hash= await bcrypt.hash(req.body.password,10)

       

        const user=new User({
                       name:req.body.name,
                       class:req.body.class,
                       schoolName:req.body.schoolName,
                       empid:1,
                       rollno:req.body.rollno,
                       password:hash,
                   })
            

        var data= await user.save();
        res.json(data);
        
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post('/login',async(req,res)=>{
    try {
    
    // if(req.body.name){
    //      console.log(req.body.name)
    //     var data = await User.findOne({name: req.body.name})
    //      console.log(data)
   // }
    if(req.body.name && !data){
         console.log(req.body.name)
        var data = await User.findOne({empid: req.body.name})  
         console.log(data)
    }
    if(req.body.name && !data){
        console.log(req.body.name)
       var data = await User.findOne({rollno: req.body.name})  
        console.log(data)
   }
    if(!data){
        return res.json({message:"User Not Found"})
    }
    else{
        var validpassword = await bcrypt.compare(req.body.password,data.password);
        // console.log(validpassword)
        if(validpassword){
           // return res.status(200).json({status:200,message:"successfully login"})
           return res.json(data)
            
        }
        else{
            return res.json({message:"Password Not Valid"})
        }
    }
    // console.log(data.password)
        
        
    } catch (error) {
        res.status(400).json(error)
    }
})





module.exports=router;