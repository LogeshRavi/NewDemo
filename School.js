const { find } = require('./Schema/SchoolSchema');
const Schools=require('./Schema/SchoolSchema');
const router = require('./userRoute');


// router.get("/splash1",async(req,res)=>{


//     Schools.find({},function (req,result) {
        
//         if(result){
//             for(var {id:id,expiryDate:ed} of result){
//                 var CurrentTime=new Date
                
//                 if(ed.getTime()>CurrentTime.getTime()){

//                     Rt=ed.getTime()-CurrentTime.getTime()

//                 }
//                 else{
//                     Rt=0
//                 }
//                 Schools.findByIdAndUpdate(id,{$set:{
//                     RemainingTime:Rt
//                 }},
//                 {new: true},
//                 function(err,user){
//                     if(err){
//                        console.log("Error")
//                     } else{
                        
//                     }
//                 })
//             }

//             Schools.find({},function (req,results) {
//                 console.log(results)
//                 res.send({StatusCode:200,StatusMessage:"Success",Data:results})
//             })
                   
//         }
//         else{
//             res.send(err)
//         }


//     })

// })


router.get("/splash",async(req,res)=>{
    
    Schools.find({}, async function (req,result) {
  if (result) {
    for(var {id:id,expiryDate:ed} of result){
        var CurrentTime=new Date()
        var endTime1=ed
                //console.log(CurrentTime.getTime())
        if(endTime1>CurrentTime.getTime()){
          
            Rt=ed.getTime()-CurrentTime.getTime()

        }
        else{
            Rt=0
        }
      await  Schools.findByIdAndUpdate(id,{$set:{
            RemainingTime:Rt
        }},
        {new: true},
        function(err,user){
            if(err){
               console.log("Error")
            } else{
                
            }
        })
    }
    Schools.find({},function (req,results) {
        
        res.send({StatusCode:200,StatusMessage:"Success",Data:results})
    })
           

} else {
       res.send(err);
     }
   });
 });

module.exports=router;