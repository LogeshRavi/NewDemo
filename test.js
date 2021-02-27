const router = require('express').Router();
const User=require('./userSchema');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken')



router.post('/teacher/register', async(req,res)=>{
    
    try {
        var empidExist=  await User.findOne({empid:req.body.empid})

        if(empidExist){
            return res.status(400).json("employee id already exist")
        }
        var hash= await bcrypt.hash(req.body.password,10)

        const user=new User({
                       name:req.body.name,
                       class:req.body.class,
                       schoolName:req.body.schoolName,
                       empid:req.body.empid,
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
            return res.status(400).json("student already exist")
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
    
    if(req.body.name){
        //  console.log(req.body.name)
        var data1 = await User.findOne({name: req.body.name})
       
        if(!data1){
            var data2 = await User.findOne({empid: req.body.name})
        }

        if(!data1 && !data2){
            var value = 0
            console.log("No data")
            return res.status(400).json("failure")
        }
        else{
            var value = 1
            console.log("Found")
            return res.status(200).json("success")
        }
            // if(data1){
            //     // console.log(data1.name)
            //     // var name = data1
            //     return res.status(200).json("success")
            // }
            // else if(data2){
            //     // console.log(data2.name)
            //     // var name = data2
            //     return res.status(200).json("success")
            // }
            // else{
            //     // console.log("No data found")
            //     return res.status(400).json("failure")

            // }
            // {
            //     var a =  data1 ? data1 : data2 ? data2 : ""
            //   }
            // console.log(a)
            
            // return  res.status(400).json({status:400,message:"user not found"})
        
        // console.log(userData)
        }
    // else if(req.body.empid){
    //      console.log(req.body.name)
    //     var data = await User.findOne({empid: req.body.empid})
    //      console.log(data)
    // }
    
    if(value == 1){
        // console.log("No data")
        {
          var a=  data1 ? data1 : data2 ? data2 : ""
        }
        console.log(a)
        var validpassword = await bcrypt.compare(req.body.password,a.password);
        // console.log(validpassword)
        if(validpassword){
            return res.status(200).json({status:200,message:"successfully login"})
        }
        else{
            return res.status(400).json({status:400,message:"password not valid"})
        }
    }
    else{
        // console.log("Found")
        // return res.status(200).json("success")
        // return res.status(400).json("failure")

    }
    // else{
        // var validpassword = await bcrypt.compare(req.body.password,data.password);
        // console.log(validpassword)
        // if(validpassword){
        //     return res.status(200).json({status:200,message:"successfully login"})
        // }
        // else{
        //     return res.status(400).json({status:400,message:"password not valid"})
        // }
    // }
    // console.log(data.password)
        
        
    } catch (error) {
        res.status(400).json(error)
    }
})





module.exports=router;