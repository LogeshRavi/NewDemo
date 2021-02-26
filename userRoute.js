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
        var nameExist=  await User.findOne({name:req.body.name})

        if(!nameExist){
            return res.status(400).json("name not exist")
        }

        var validpassword = await bcrypt.compare(req.body.password,nameExist.password);

        if(!validpassword){
            return res.status(400).json("Password not valid");
        }

        var Userid=await User.findOne({empid:req.body.empid})

        

        

        return res.status(200).json("successfully login")

        
        
    } catch (error) {
        res.status(400).json(error)
    }
})





module.exports=router;