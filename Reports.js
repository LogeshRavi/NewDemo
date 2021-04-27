const router = require('express').Router();
const User=require('./Schema/userSchema');
const Schedule=require('./Schema/ScheduleSchema');
const Assesment=require('./Schema/AssesmentSchema')
const Students=require('./Schema/StudentsSchema');
const Gamelist=require('./Schema/GameSchema')
const Teacher=require('./Schema/TeacherSchema')
//const Dummy=require('./Schema/dummySchema')
const Reports=require('./Schema/ReportsSchema')




router.post("/classwise/report1",async(req,res)=>{

   
   const result=req.body.Sub[0].Result
   console.log(result)
    
   var total=0
   for (var j = 0; j <3; j++){
    //console.log(j)
    console.log(req.body.Sub[j].Result);
    var bool=await req.body.Sub[j].Result
    if(bool=='True'){
        console.log(total)
        total=total+1
    }
  
    }

// var Total1=0;
//     console.log(result1)
    // for (var val of Result[0]){
    //     console.log(val)
    
//     if(val=='True'){
//         Total1=Total1+1
//         console.log(Total1)
//     }
//     }

//const data;
    var data4=[]
for (var j = 0; j <3; j++){

  var  obj={

        
        Question:req.body.Sub[j].Question,
        CrtAns:req.body.Sub[j].CrtAns,
        UserAns:req.body.Sub[j].UserAns,
        Result:req.body.Sub[j].Result
    }
    data4[j]=obj

}
console.log(data4)


   const  data= await new Reports({
         name:req.body.name,
         class:req.body.class,
         rollno:req.body.rollno,
         AssesmentId:req.body.AssesmentId,
         GameName:req.body.GameName,
        Sub:
            data4
        ,


            Total:total
        
    })
    console.log(data)

    

 
    
    var data1= await data.save();

    res.json({StatusCode:200,StatusMessage:"Success",Response:"Report Add Successfully",schedule:data1})

})


// router.post("/classwise/report",async(req,res)=>{

//     const cursor = Dummy.find({$and:[{Rollno:req.body.Rollno }, {ClassId:req.body.ClassId}]},(function(err, results){   
//         console.log(results) 
//         res.json(results)
//  }) );



// })


module.exports=router;