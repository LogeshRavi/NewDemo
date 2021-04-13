const Schools=require('./Schema/SchoolSchema');
const router = require('./userRoute');


router.get("/findSchool",async(req,res)=>{

    Schools.find({},function (req,result) {
        res.json({StatusCode:200,StatusMessage:"Success",Response:"Schedule Successfully",Schools:result})
    })
 
    


})


module.exports=router;