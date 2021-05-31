const router = require('express').Router();
const User = require('./Schema/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
const Schedule = require('./Schema/ScheduleSchema');
const Assesment = require('./Schema/AssesmentSchema')
const NewAssesment=require('./Schema/NewAssesmentSchema')
const Students = require('./Schema/StudentsSchema');
const Gamelist = require('./Schema/GameSchema')
const Teacher = require('./Schema/TeacherSchema');
const StudentsData = require('./Schema/StudentsData')
const School = require('./Schema/SchoolSchema')
const Reports = require('./Schema/ReportsSchema')
const Educator=require('./Schema/educatorSchema');
const Child=require('./Schema/NewStudentSchema');
const Class=require('./Schema/NewClassSchema')
const bodyParser = require('body-parser')
const {verifyPasswordsMatch}=require('./views/validator')
const { check, validationResult } = require('express-validator')
const randomstring = require("randomstring");
const { body } = require('express-validator/check');

const urlencodedParser = bodyParser.urlencoded({ extended: false })

//teacher register  //no need
router.post('/teacher/register', async (req, res) => {
  try {
    var empidExist = await User.findOne({ empid: req.body.empid })
    if (empidExist) {
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Employee ID Already Exist" })
    }
    
    var teacher = new Teacher({
      // name:req.body.name,
      // class:req.body.class,
      username: req.body.empid,
      password: req.body.password
    })
    var data1 = await teacher.save()

    const user = new User({
      name: req.body.name,
      class: req.body.class,
      schoolName: req.body.schoolName,
      empid: req.body.empid,
      //  code:req.body.code,
      rollno: 01,
      password: req.body.password,
      role:"teacher"
    })

    var data = await user.save();
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Register Successfully", user: data1 })


  } catch (error) {
    res.status(400).json(error)
  }
})



//Educator Register Api
router.post('/educator/register', async (req, res) => {

 const Email=req.body.Email
 const status="Y"
  var EmailExist = await Educator.findOne({ Email: req.body.Email , isVerify:status }) 
  if (EmailExist) {
    return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Email ID Already Exist" })
  }

  var EmailExist = await Educator.findOne({ eUserName:req.body.eUserName  , isVerify:status })
  if (EmailExist) {
    return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "UserName Already Exist" })
  }
  const secretCode = randomstring.generate({
    length: 6,
    charset: 'numeric'
  })

  const user = new Educator({

    Name:req.body.Name,
    Email:req.body.Email,
    eUserName:req.body.eUserName,
    ePassword:req.body.ePassword,
    phoneNumber:req.body.phoneNumber,
    otp:secretCode,
    status:"Y",
    isVerify:"N"
  })
  var data = await user.save();

  const output = `
    
    <h2>TERV KIDS |OTP ALERT</h2>
    <h4>Hi ${req.body.Email}</h4>
    <br></br>
    <h4>Please enter the below code to complete verification</h4>
   <br/>
   <h1> ${secretCode} </h1>
  `;
 
  var sender =nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
      user:'rlogeshfive@gmail.com',
      pass:'vihaan567'
    }
  })

  var data1={
    from:'rlogeshfive@gmail.com',
    to:Email,
    subject:'One Time Password(OTP) ',
    html: output
  }
  
  sender.sendMail(data1,function (err,info) {
     if(err){
       console.log(err)
     }
     else{
      res.json({ StatusCode: 200, StatusMessage: "Success", Response: "OTP Send Successfully",user:data })

     }
  })

   // res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Register Successfully", user: data })

})

//OTP verification for educator
router.post('/otp-verification', async (req, res) => {

  const email=req.query.Email
  const otp=req.body.otp
  var otp1;
  var id;
  var q =  Educator.find({Email:email }).sort({'_id':-1}).limit(1);
    q.exec(function(err, posts) {
     posts.forEach(function(item) {
      console.log(item.otp);
      otp1=item.otp
      id=item.id
      console.log(otp,otp1,id)
      if(otp==otp1){
        
        Educator.findByIdAndUpdate(id, {
          $set: {
            isVerify:"Y"
          }
        },
          { new: true },
          function (err, user) {
            if (err) {
              console.log("Error")
            } else {
                
            }
          });
        res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Account Verify" })
      }
      else{
        res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Pls Check OTP "})
    
      }
    });
});

 

})

// create new otp
router.post('/create-otp', async (req, res) => {

  const email=req.query.Email

  const secretCode = randomstring.generate({
    length: 6,
    charset: 'numeric'
  })

  var update = await Educator.updateMany({ Email: email }, {
    $set: {
      otp:secretCode
    }
  })

  var sender =nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'rlogeshfive@gmail.com',
      pass:'vihaan567'
    }
  })

  var data1={
    from:'rlogeshfive@gmail.com',
    to:email,
    subject:'One Time Password(OTP)',
    html: `${secretCode}` 
  }
  
  sender.sendMail(data1,function (err,info) {
     if(err){
       console.log(err)
     }
     else{
      res.json({ StatusCode: 200, StatusMessage: "Success", Response: "OTP Send Successfully" })

     }
  })



})

//add new child
router.post('/add/children', async (req, res) => {
    
  const user = new Child({
  StudentName:req.body.StudentName,
  Age:req.body.Age,
  School:req.body.School,
  ModeofEducation:req.body.ModeofEducation,
  studentUserName:req.body.studentUserName,
  studentPassword:req.body.studentPassword,
  EducatorEmail:req.body.EducatorEmail,
  ProfilePictureId:req.body.ProfilePictureId,
  PasswordType:req.body.PasswordType

  })
  var data = await user.save();
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Register Successfully", user: data })

})

router.post('/login/parent', async (req, res) => {

  var ParentExist = await Educator.findOne({$or: [{Email: req.body.Email,isVerify:"Y"},{eUserName: req.body.Email,isVerify:"Y"}]})
  
  if(!ParentExist){

    var StatusChk = await Educator.findOne({$or: [{Email: req.body.Email,isVerify:"N"},{eUserName: req.body.Email,isVerify:"N"}]})
    if(StatusChk){
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Your Account is Not Verify" })
    }
  else{
    return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "User Not Found" })
  }
  }
  let results;
  
    if(ParentExist && ParentExist.ePassword==req.body.password){
      const cursor=Child.find({EducatorEmail:ParentExist.Email},function  (err,result) {
        results=result
      var userToken = jwt.sign({ _id: ParentExist.id }, 'secretkey')
        res.header('auth', userToken).json({ StatusCode: 200, StatusMessage: "Success", Response: "Login Successfully", token: userToken, user: ParentExist ,Student_List:results})
      })
    }
    else{
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: " Password Not Correct" })
    }
})

const NewValidUser = (req, res, next) => {
  var token = req.header('auth');

  jwt.verify(token, 'secretkey', (err, payload) => {
    if (err) {

    }
      //console.log(payload)
    const id = payload
    Educator.findById(id).then(data => {
      req.user = data
      //console.log(req.user)
      next()
    })
  })
}

//children login
router.post('/login/children', async (req, res) => {

  var StudentExist = await Child.findOne( {studentUserName: req.body.name})

 
  if (!StudentExist ) {
    
    return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "UserId Not Exist" })
  }
 
  if (StudentExist && StudentExist.studentPassword==req.body.password) {
    
    var userToken = await jwt.sign({ _id: StudentExist.id }, 'secretkey')
      res.header('auth', userToken).send({ StatusCode: 200, StatusMessage: "Success", Response: "Login Successfully", token: userToken, user: StudentExist })

  }
  else
  {
    return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Password Not Correct" })
  }



})


const NewValidUser1 = (req, res, next) => {
  var token = req.header('auth');

  jwt.verify(token, 'secretkey', (err, payload) => {
    if (err) {

    }
      //console.log(payload)
    const id = payload
    Child.findById(id).then(data => {
      req.user = data
      //console.log(req.user)
      next()
    })
  })
}




//student register //no need
router.post('/student/register', async (req, res) => {

  try {
    var rollnoExist = await User.findOne({ rollno: req.body.rollno })

    if (rollnoExist) {

      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Roll Number Already Exist" })
    }

    var student = new Students({
      name: req.body.name,
      class: req.body.class,
      rollno: req.body.rollno,
      schoolName:req.body.schoolName
    })
    var data = await student.save()

    var student = new StudentsData({
      username: req.body.rollno,
      password: req.body.password

    })
    var data1 = await student.save()


    // var hash= await bcrypt.hash(req.body.password,10)
    const user = new User({
      name: req.body.name,
      class: req.body.class,
      schoolName: req.body.schoolName,
      empid: 1,
      rollno: req.body.rollno,
      password: req.body.password,
      
    })



    var data = await user.save();
    // res.json(data);
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Register Successfully", user: data1 })

  } catch (error) {
    res.status(400).json(error)
  }
})

//login //no need
router.post('/login', async (req, res) => {
  try {
    if (req.body.name && !data && req.body.role=="teacher") {
      var data = await User.findOne({ empid: req.body.name })
      
     
    }
    if (req.body.name && !data && req.body.role=="student") {
      var data = await User.findOne({ rollno: req.body.name })
      
    }

   
   

    

    if (!data) {
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "User Not Found" })
    }


    else {

      // var validpassword = await User.compare(req.body.password,data.password);

      if (req.body.password == data.password) {

        var userToken = await jwt.sign({ _id: data.id } || { _id: data.id }, 'secretkey')
        res.header('auth', userToken).send({ StatusCode: 200, StatusMessage: "Success", Response: "Login Successfully", token: userToken, user: data })

      }
      else {

        return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Password Not Valid" })
      }
    }

  } catch (error) {
    res.status(400).json(error)
  }
})

const ValidUser = (req, res, next) => {
  var token = req.header('auth');

  jwt.verify(token, 'secretkey', (err, payload) => {
    if (err) {

    }
    //  console.log(payload)
    const id = payload
    User.findById(id).then(data => {
      req.user = data
      next()
    })
  })
}




//teacher Update //no need
router.post("/teacher/update", ValidUser, async (req, res) => {
  const eid = req.user.id


  var update = await User.updateMany({ empid: req.body.empid }, {
    $set: {
      name: req.body.name,
      class: req.body.class,
      schoolName: req.body.schoolName,
      empid: req.body.empid,
      password: req.body.password
    }
  })
  //return res.json({StatusCode:200,StatusMessage:"Success",Response:"Updated !!!",User:update})

  var result = await User.findById(eid, function (req, rest) {

    return res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Updated !!!", User: rest })
  })

})

//student Update //no nedd
router.post("/student/update", ValidUser, async (req, res) => {
  const eid = req.user.id

  // var hash1= await bcrypt.hash(req.body.password,10)
  var update = await User.updateMany({ rollno: req.body.rollno }, {
    $set: {
      name: req.body.name,
      class: req.body.class,
      schoolName: req.body.schoolName,
      rollno: req.body.rollno,
      password: req.body.password
    }
  })

  var update = await Students.updateMany({ rollno: req.body.rollno }, {
    $set: {
      name: req.body.name,
      class: req.body.class,
      rollno: req.body.rollno,

    }
  })

  var result = await User.findById(eid, function (req, rest) {

    return res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Updated !!!", User: rest })
  })


})


//new class schedule //no need
router.post("/scheduleclassdummy/kg", ValidUser, async (req, res) => {


  var createTime = new Date();
  var endtime = new Date();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var time = new Date();

  today = dd + '-' + mm + '-' + yyyy + ',' + time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  console.log(today)

  endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
  var CurrentTime = new Date()
  if (endtime.getTime() < CurrentTime) {
    isCompleted = "Y"
  }
  else {
    isCompleted = "N"
  }

  const noofstudents = req.body.studentRollNoList.length
  const schedule = new Schedule({
    topicName: req.body.topicName,
    subject: req.body.subject,
    GameName: req.body.GameName,
    class: req.body.class,
    duration: req.body.duration,
    NoOfStudents: noofstudents,
    studentRollNoList: req.body.studentRollNoList,
    CreatedTime: createTime,
    endTime: endtime,
    Date: today,
    isCompleted: isCompleted,
    RemainingTime: req.body.duration,
    CreatedBy: req.user.name,
    empid: req.user.empid
  })

  var data = await schedule.save();
  console.log(data)
  res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Schedule Successfully", schedule: data })


})


//Assesment  //no need
router.post("/assesmentdummy/kg", ValidUser, async (req, res) => {
  var createTime = new Date();
  var endtime = new Date();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var time = new Date();

  today = dd + '-' + mm + '-' + yyyy + ',' + time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  console.log(today)

  endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
  var CurrentTime = new Date()
  if (endtime.getTime() < CurrentTime) {
    isCompleted = "Y"
  }
  else {
    isCompleted = "N"
  }

  const noofstudents = req.body.studentRollNoList.length


  const assesment = new Assesment({
    topicName: req.body.topicName,
    subject: req.body.subject,
    GameName: req.body.GameName,
    class: req.body.class,
    duration: req.body.duration,
    NoOfStudents: noofstudents,
    studentRollNoList: req.body.studentRollNoList,
    CreatedTime: createTime,
    endTime: endtime,
    Date: today,
    isCompleted: isCompleted,
    CreatedBy: req.user.name,
    empid: req.user.empid,
    RemainingTime: req.body.duration,

  })

  var data = await assesment.save();
  res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Schedule Successfully", Assesment: data })

})

//get assesment data 
router.get("/assesment/alldata", NewValidUser, async (req, res) => {
  const username = req.user.Email
  NewAssesment.find({ CreatedBy: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
    if (result) {
      for (var { id: id, CreatedTime: Ct, duration: d } of result) {
        var endtime = new Date();
        endtime.setTime(Ct.getTime() + (d * 60 * 1000));
        var CurrentTime = new Date()
        console.log(id)
        console.log(CurrentTime.getTime())
        console.log(endtime.getTime())
        if (endtime.getTime() < CurrentTime.getTime()) {
          isCompleted = "Y"
        }
        else {
          isCompleted = "N"
        }

        if (isCompleted == "N") {
          Rt = endtime.getTime() - CurrentTime.getTime()
        } else {
          Rt = 0
        }
        await NewAssesment.findByIdAndUpdate(id, {
          $set: {
            isCompleted: isCompleted,
            RemainingTime: Rt
          }
        },
          { new: true },
          function (err, user) {
            if (err) {
              console.log("Error")
            } else {

            }
          });
      }
      const data = NewAssesment.find({ CreatedBy: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
        res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Assesment: results });
      })
    } else {
      res.send(err);
    }
  });
});


//GET GAME 
router.route("/gameselection").post(function (req, res) {
  const cursor = Gamelist.find({ subjectName: req.body.subjectName }, (function (err, results) {
    res.json(results)
  }));
})




//student reports updated 
router.post("/studentwise/report", NewValidUser1, async (req, res) => {
  const studentUserName1 = req.user.studentUserName
  console.log(studentUserName1)
  const cursor = Reports.find({ $and: [{ studentUserName: studentUserName1 }, { AssesmentId: req.query
    .AssesmentId }] }, (function (err, results) {
    console.log(results)
    res.json(results)
  }));
})


//report for teachers
router.post("/educator/report", NewValidUser, async (req, res) => {
  var page = parseInt(req.query.page) || 0; //for next page pass 1 here
  var limit = parseInt(req.query.limit) || 0;
  if (limit == 0) {
    return res.json({ msg: "format error" })
  }

  const rollno1 = req.body.rollno
  const cursor = Reports.find({ $and: [{ rollno: rollno1 }, { AssesmentId: req.body.AssesmentId }] }).skip(page * limit) //Notice here
    .limit(limit)
    .exec((err, doc) => {
      if (err) {
        return res.json(err);
      };
      Reports.countDocuments({ $and: [{ rollno: rollno1 }, { AssesmentId: req.body.AssesmentId }] }).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        if (count < limit * page) {
          return res.json({ msg: "invalid data" })
        }
        return res.json({
          total: count,
          page: page,
          student: doc
        });
      });
    });
})

router.post("/teacherwise/report1", NewValidUser, async (req, res) => {

  const rollno1 = req.body.rollno
  const cursor = Reports.find({ $and: [{ rollno: rollno1 }, { AssesmentId: req.body.AssesmentId }] }, function (req, result) {
    res.json(result)
  })

})
// dummy
router.post("/assesmentwise/leaderboard", ValidUser, async (req, res) => {

  // const class1 = req.body.class
  const AssesmentId1 = req.query.AssesmentId

  //console.log(class1 , AssesmentId)
  const arr = []
  const arr1 = []
  // const cursor=Reports.find({$and:[{class:class1 }, {AssesmentId:AssesmentId}]},{},{ sort: { 'Total' : -1 }},function(req,result){
  //  console.log(result)

  console.log(AssesmentId1)
  await Reports.aggregate(
    [
      {
        $match: {
          AssesmentId: AssesmentId1
        }
      },
      {
        $group: {
          _id: "$rollno",

          "Total": {
            $avg: '$Total'
          }
        }
      },
      {
        $sort: { Total: -1 }
      }
    ],
    (e, d) => {
      if (!e) {

        console.log(d)
        var arrayOfStrings = d.map(function (obj) {
          arr.push(obj._id)
          console.log(arr)
        });
      }
      //  const cursor = Reports.find({rollno:d},function(err,result){
      //   var arrayOfStrings = result.map(function(obj) {
      //     arr1.push(obj.name)
      //     console.log(arr1)            
      //   });

      //  })



      else {
        console.log(e)
      }
    })
    
      // res.json(arr1)
      const arrlen = arr.length
      
       //AssesmentId1 = req.query.AssesmentId
      console.log(AssesmentId1)
      console.log(arr)
      var cursor = []
      for (var i = 0; i < arrlen; i++) {
        console.log(arr[i])
        var data =  await Reports.findOne({ rollno: arr[i] }, function (err, result) {
          console.log(result.name)
          cursor.push(result.name)
          console.log(cursor)
          console.log(i)
          if (cursor.length == arrlen)
          {
            res.json(cursor)
          }
          // res.json(res.name)
          // //var arrayOfStrings = res.map(function(obj) {
          //  // arr1.push(obj)
          //   console.log(arr1)            
          // });
        })
     
      }
    
    
    
  // })res.json(cursor)
    
    
  console.log(cursor)
})


router.get("/class/leaderboard", ValidUser, async (req, res) => {

  const class1 = req.query.class
  //const AssesmentId1=req.query.AssesmentId

  //console.log(class1 , AssesmentId)
  const arr = []
  // const cursor=Reports.find({$and:[{class:class1 }, {AssesmentId:AssesmentId}]},{},{ sort: { 'Total' : -1 }},function(req,result){
  //  console.log(result)

  console.log(class1)
  Reports.aggregate(
    [
      {
        $match: {
          class: class1
        }
      },
      {
        $group: {
          _id: "$name",

          "Total": {
            $avg: '$Total'
          }
        }
      },
      {
        $sort: { Total: -1 }
      }
    ],
    (e, d) => {
      if (!e) {

        console.log(d)
        var arrayOfStrings = d.map(function (obj) {
          arr.push(obj._id)
          console.log(arr)

          //   const cursor=Reports.find({rollno:rollno1},{},function (error,result) {
          //       console.log(result)
          // })                        
        });


      } else {
        console.log(e)
      }
     
    })

    const arrlen = arr.length
       //AssesmentId1 = req.query.AssesmentId
      console.log(AssesmentId1)
      console.log(arr)
      var cursor = []
      for (var i = 0; i < arrlen; i++) {
        console.log(arr[i])
        var data =  await Reports.findOne({ rollno: arr[i] }, function (err, result) {
          console.log(result.name)
          cursor.push(result.name)
          console.log(cursor)
          console.log(i)
          if (cursor.length == arrlen)
          {
            res.json(cursor)
          }
          // res.json(res.name)
          // //var arrayOfStrings = res.map(function(obj) {
          //  // arr1.push(obj)
          //   console.log(arr1)            
          // });
        })
     
      }
    
  // })
})


router.get("/subject/leaderboard", ValidUser, async (req, res) => {

  const GameName = req.query.GameName
  const AssesmentId1 = req.query.AssesmentId

  //console.log(class1 , AssesmentId)
  const arr = []
  // const cursor=Reports.find({$and:[{class:class1 }, {AssesmentId:AssesmentId}]},{},{ sort: { 'Total' : -1 }},function(req,result){
  //  console.log(result)

  console.log(GameName)
 await Reports.aggregate(
    [
      {
        $match: {
          GameName: GameName,
          AssesmentId: AssesmentId1
        }
      },
      {
        $group: {
          _id: "$rollno",

          "Total": {
            $avg: '$Total'
          }
        }
      },
      {
        $sort: { Total: -1 }
      }
    ],
    (e, d) => {
      if (!e) {

        console.log(d)
        var arrayOfStrings = d.map(function (obj) {
          arr.push(obj._id)
          console.log(arr)

          //   const cursor=Reports.find({rollno:rollno1},{},function (error,result) {
          //       console.log(result)
          // })                        
        });


      } else {
        console.log(e)
      }
     
    })

    const arrlen = arr.length
    console.log(arrlen)
       //AssesmentId1 = req.query.AssesmentId
      console.log(AssesmentId1)
      console.log(arr)
      var cursor = []
      for (var i = 0; i < arrlen; i++) {
        console.log(arr[i])
        var data =  await Reports.findOne({ rollno: arr[i] }, function (err, result) {
          console.log(result.name)
          cursor.push(result.name)
          console.log(cursor)
          console.log(i)
          if (cursor.length == arrlen)
          {
            res.json(cursor)
          }
          // res.json(res.name)
          // //var arrayOfStrings = res.map(function(obj) {
          //  // arr1.push(obj)
          //   console.log(arr1)            
          // });
        })
     
      }
    
  
})


router.get("/student/progress", ValidUser, async (req, res) => {

  const rollno = req.user.rollno

  const cursor = Reports.find({ rollno: rollno }, function (err, result) {
    res.json(result)
  })

})


router.post("/create/report",NewValidUser1,async(req,res)=>{
   
  const result=req.body.Sub[0].Result
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
        name:req.user.StudentName,
        AssesmentId:req.body.AssesmentId,
        studentUserName:req.user.studentUserName,
        GameName:req.body.GameName,
       Sub:
           data4
       ,


           Total:total
       
   }) 
   var data1= await data.save();

   res.json({StatusCode:200,StatusMessage:"Success",Response:"Report Add Successfully",schedule:data1})

})


// get studentgame from assesment  01 100% 
// working
router.get("/student/gamename", NewValidUser1, async (req, res) => {

  const studentUserName1=req.user.studentUserName
  //const studentUserName1=req.query.studentUserName
  const AssesmentId=req.query.AssesmentId
 
  var data1=[]
  var data=[]
  const gamelist=Reports.find({$and:[{studentUserName:studentUserName1}, {AssesmentId:AssesmentId}]},function (err,result) {
    
    
    result_list = []
    for(var i=0;i<result.length;i++){
      indivdual_obj = result[i]
      temp_obj= Object()
      temp_obj.GameName = indivdual_obj.GameName
      temp_obj.Total =indivdual_obj.Total
      result_list.push(temp_obj)
    }
    res.json({StatusCode: 200, StatusMessage: "Success", GameName_List: result_list })

  })

})

// get details report for student 02  100%
//working
router.get("/studentwise/report", NewValidUser1,async (req, res) => {
     
  const studentUserName1=req.user.studentUserName
  //const studentUserName1=req.query.studentUserName
  //const class1=req.user.class
  const AssesmentId=req.query.AssesmentId
  const Subject=req.query.GameName

  const gamelist=Reports.find({$and:[{studentUserName:studentUserName1}, {AssesmentId:AssesmentId},{GameName:Subject}]},function (err,result) {
    
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Report", Student_Report: result })

  })
})
        

//tab 1 teacher report getStudentlist from assesment
// working
router.get("/assesment/studentlist",NewValidUser,async (req, res) => {
     
  //const rollno=req.query.rollno
  const AssesmentId=req.query.AssesmentId
  NewAssesment.findById(AssesmentId ,  function (err, result) {
    res.json({StatusCode: 200, StatusMessage: "Success", Students_List: result.studentsList})
  })
})
  

//tab1 get student gamelist by teacher
  router.get("/gamename1/report", async (req, res) => {

    const studentUserName1=req.query.studentUserName
   // const class1=req.query.class
    const AssesmentId=req.query.AssesmentId
    //console.log(AssesmentId,class1,rollno)
    var data1=[]
    var data=[]
    const gamelist=Reports.find({$and:[{studentUserName:studentUserName1 }, {AssesmentId:AssesmentId}]},function (err,result) {
      result_list = []
      for(var i=0;i<result.length;i++){
        indivdual_obj = result[i]
        temp_obj= Object()
        temp_obj.GameName = indivdual_obj.GameName
        temp_obj.Total =indivdual_obj.Total
        result_list.push(temp_obj)
      }
     
      res.json({StatusCode: 200, StatusMessage: "Success", GameName_List: result_list })
  
    })
  
  })

//tab1 get assesmentwise report by teacher
  router.get("/studentwise1/report", ValidUser,async (req, res) => {
    
    const studentUserName1=req.query.studentUserName
    const AssesmentId=req.query.AssesmentId
    const Subject=req.query.GameName
  
    const gamelist=Reports.find({$and:[{studentUserName:studentUserName1 }, {AssesmentId:AssesmentId},{GameName:Subject}]},function (err,result) {
  
      res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Report", Student_Report: result })
  
    })
  })
//tab assesment list by teacher for reports
  router.get("/assesmentlist/report",async (req, res) => {
     
    const rollno=req.query.rollno
    Assesment.find({ studentRollNoList: rollno }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
      
      console.log(result)
    result_list = []
    for(var i=0;i<result.length;i++){
      indivdual_obj = result[i]
      temp_obj= Object()
      temp_obj.id =indivdual_obj.id
      temp_obj.topicname = indivdual_obj.topicName
      temp_obj.subject =indivdual_obj.subject
      temp_obj.Date =indivdual_obj.Date
      temp_obj.Duration=indivdual_obj.duration
      result_list.push(temp_obj)
    }
    console.log(result_list)
    res.json({StatusCode: 200, StatusMessage: "Success", Schedule_Class: result_list})
  

  // })


    })
  })





// educator update
  router.post("/educator/update", NewValidUser, async (req, res) => {
    const id=req.user.id
    Educator.findByIdAndUpdate(id, {
      $set: {
        ePassword:req.body.ePassword,
        phoneNumber:req.body.phoneNumber
      }
    },
      { new: true },
      function (err, user) {
        if (err) {
          console.log("Error")
        } else {
            
        }
      });
    var result = await Educator.findById(id, function (req, rest) {

      return res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Updated !!!", User: rest })
    })
  })

  //Edit Children 
  router.post("/child/update", NewValidUser, async (req, res) => {
    const studentUserName1=req.query.studentUserName
    var update = await Child.updateMany({ studentUserName:studentUserName1 }, {
      $set: {
        Age:req.body.Age,
        School:req.body.School,
        ModeofEducation:req.body.ModeofEducation,
        studentPassword:req.body.studentPassword,
      }
    })
    const data = Child.find({ studentUserName:studentUserName1 }, function (req, results) {
      res.send({ StatusCode: 200, StatusMessage: "Success", Response: "Student details Updated", StudentDeatils: results });
  })
})

  // Delete Children
  router.route("/deletechildren").delete(function (req, res) {
    const studentUserName1=req.query.studentUserName
    const data = Child.findOneAndDelete({studentUserName:studentUserName1}, function (err, results) {
      res.send({ StatusCode: 200, StatusMessage: "Success", Response: "Delete Student Record", StudentDeatils: results });
  
    })
  })
 
//forgot password
  router.post("/forgot/password", async (req, res) => {
    
    const email=req.body.Email
    
    var EmailExist = await Educator.findOne({'Email': email ,isVerify:"Y" })

    if (!EmailExist) {
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Email ID Not Exist" })
    }

    //const secret=JWT_Secret+EmailExist.ePassword
  
      const id=EmailExist.id
      console.log(id)
      
    var userToken = jwt.sign({_id:id}, 'secretkey',{expiresIn:'15m'})
    const link=`https://gamelogin2.herokuapp.com/api/reset-password/${userToken}`

    const output = `
    
    <h2>TERV KIDS |Reset Password</h2>
    <h3>Hi ${email}</h3>
    <br></br>
    <h4>Forgot Password ? No Problem !</h4>
    <h4>Reset Your Password by clicking below link</h4>
   <br/>
   <h3> ${link} </h3>
  `;
    

    var sender =nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:'rlogeshfive@gmail.com',
        pass:'vihaan567'
      }
    })

    var data={
      from:'rlogeshfive@gmail.com',
      to:email,
      subject:'Account Activiation Link',
      html:output
    }

    sender.sendMail(data,function (err,info) {
       if(err){
         console.log(err)
       }
       else{
        res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Mail Send Successfully" })
       }
    })
  })

  router.get("/reset-password/:token", async (req, res) => {
    
    const token=req.params.token
        jwt.verify(token, 'secretkey', (err, payload) => {
            if (err) {
              return res.send('Link invalid or expired')
            }
        res.render('reset-password') 
        })
     })

     

  router.post("/reset-password/:token", urlencodedParser, [

    body('password','Password Should Not be Empty').notEmpty(),
    body('password2').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
    return true;

    })
   
   ] ,async (req, res) => {

   
  
    const token1=req.params.token
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('reset-password', {
            alert
        })
        return
    }
    
   const {password,password2}=req.body
    const token=req.params.token
  
    try {
      //const payload=jwt.verify(token,'secretkey')
      jwt.verify(token, 'secretkey', (err, payload) => {
        if (err) {
    
        }
          console.log(payload)
        const id = payload._id
        
        Educator.findByIdAndUpdate(id, {
          $set: {
            ePassword:password
          }
        },
          { new: true },
          function (err, user) {
            if (err) {
              console.log("Error")
            } else {
                res.render('show')
            }
          });
      })
    } catch (error) {
    }
  })

  router.get("/show", async (req, res) => {

    res.render('show')
  })

  //get children list
  router.get("/getChildren",NewValidUser, async (req, res) => {
  const email=req.user.Email
    Child.find({EducatorEmail:email},function (err,results) {
      res.send({ StatusCode: 200, StatusMessage: "Success", Response: " StudentsList", StudentsList: results });
    })

  })

  //new create class api
  router.post("/scheduleclass/kg", NewValidUser, async (req, res) => {
    var createTime = new Date();
    var endtime = new Date();
  
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    var time = new Date();
  
    today = dd + '-' + mm + '-' + yyyy + ',' + time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    console.log(today)
  
    endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
    var CurrentTime = new Date()
    if (endtime.getTime() < CurrentTime) {
      isCompleted = "Y"
    }
    else {
      isCompleted = "N"
    }
  
    const noofstudents = req.body.studentsList.length
    const schedule = new Class({
      topicName: req.body.topicName,
      subject: req.body.subject,
      GameName: req.body.GameName,
      //class: req.body.class,
      duration: req.body.duration,
      NoOfStudents: noofstudents,
      studentsList: req.body.studentsList,
      CreatedTime: createTime,
      endTime: endtime,
      Date: today,
      isCompleted: isCompleted,
      RemainingTime: req.body.duration,
      CreatedBy: req.user.Email,
    })
  
    var data = await schedule.save();
    console.log(data)
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Schedule Successfully", schedule: data })
  
  
  })

  // get create class by educator
  router.get("/schedule/alldata", NewValidUser, async (req, res) => {
    const username = req.user.Email
    Class.find({CreatedBy: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
  
  
      if (result) {
        for (var { id: id, CreatedTime: Ct, duration: d } of result) {
          var endtime = new Date();
          await endtime.setTime(Ct.getTime() + (d * 60 * 1000));
          var CurrentTime = new Date()
  
          if (endtime.getTime() < CurrentTime.getTime()) {
            isCompleted = "Y"
          }
          else {
            isCompleted = "N"
          }
          if (isCompleted == "N") {
            Rt = endtime.getTime() - CurrentTime.getTime()
          } else {
            Rt = 0
          }
  
          await Class.findByIdAndUpdate(id, {
            $set: {
              isCompleted: isCompleted,
              RemainingTime: Rt
            }
          }),
            { new: true },
  
            function (err, user) {
              if (err) {
                console.log("Error")
              } else {
  
              }
            };
  
        }
  
        const data = Class.find({ CreatedBy: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
          res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Class: results });
        })
  
  
      } else {
        res.send(err);
      }
    });
  });

  //new create assesment api
  router.post("/assesment/kg", NewValidUser, async (req, res) => {

    var createTime = new Date();
    var endtime = new Date();
  
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    var time = new Date();
  
    today = dd + '-' + mm + '-' + yyyy + ',' + time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    console.log(today)
  
    endtime.setTime(createTime.getTime() + (req.body.duration * 60 * 1000));
    var CurrentTime = new Date()
    if (endtime.getTime() < CurrentTime) {
      isCompleted = "Y"
    }
    else {
      isCompleted = "N"
    }
   
    const noofstudents = req.body.studentsList.length
  
  
    const assesment1 = new NewAssesment({
      topicName: req.body.topicName,
      subject: req.body.subject,
      GameName: req.body.GameName,
      duration: req.body.duration,
      NoOfStudents: noofstudents,
      studentsList: req.body.studentsList,
      CreatedTime: createTime,
      endTime: endtime,
      Date: today,
      isCompleted: isCompleted,
      CreatedBy: req.user.Email,
      RemainingTime: req.body.duration,
  
    })
  
    var data = await assesment1.save();
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Schedule Successfully", Assesment: data })
  
  })


//get class by student
  router.get("/getStudentClass", NewValidUser1, async (req, res) => {
    const username = req.user.studentUserName
    Class.find({studentsList: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
  
      if (result) {
        for (var { id: id, CreatedTime: Ct, duration: d } of result) {
          var endtime = new Date();
          await endtime.setTime(Ct.getTime() + (d * 60 * 1000));
          var CurrentTime = new Date()
  
          if (endtime.getTime() < CurrentTime.getTime()) {
            isCompleted = "Y"
          }
          else {
            isCompleted = "N"
          }
          if (isCompleted == "N") {
            Rt = endtime.getTime() - CurrentTime.getTime()
          } else {
            Rt = 0
          }
  
          await Class.findByIdAndUpdate(id, {
            $set: {
              isCompleted: isCompleted,
              RemainingTime: Rt
            }
          }),
            { new: true },
  
            function (err, user) {
              if (err) {
                console.log("Error")
              } else {
              }
            };
        }
       
  
        const gamelist=Class.find({ studentsList: username }, {}, { sort: { 'CreatedTime': -1 } },function (err,result) {
          result_list = []
          for(var i=0;i<result.length;i++){
            indivdual_obj = result[i]
            temp_obj= Object()
            temp_obj.id =indivdual_obj.id
            temp_obj.topicname = indivdual_obj.topicName
            temp_obj.subject =indivdual_obj.subject
            temp_obj.Date =indivdual_obj.Date
            temp_obj.Duration=indivdual_obj.duration
            temp_obj.isCompleted=indivdual_obj.isCompleted
            result_list.push(temp_obj)
          }
          res.json({StatusCode: 200, StatusMessage: "Success", Schedule_Class: result_list})
      
        })
  
      } else {
        res.send(err);
      }
    });
  });

  //get assesment by student
  router.get("/getStudentAssessment", NewValidUser1, async (req, res) => {
    const username = req.user.studentUserName
    NewAssesment.find({studentsList: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
  
      if (result) {
        for (var { id: id, CreatedTime: Ct, duration: d } of result) {
          var endtime = new Date();
          await endtime.setTime(Ct.getTime() + (d * 60 * 1000));
          var CurrentTime = new Date()
  
          if (endtime.getTime() < CurrentTime.getTime()) {
            isCompleted = "Y"
          }
          else {
            isCompleted = "N"
          }
          if (isCompleted == "N") {
            Rt = endtime.getTime() - CurrentTime.getTime()
          } else {
            Rt = 0
          }
  
          await NewAssesment.findByIdAndUpdate(id, {
            $set: {
              isCompleted: isCompleted,
              RemainingTime: Rt
            }
          }),
            { new: true },
  
            function (err, user) {
              if (err) {
                console.log("Error")
              } else {
              }
            };
        }
       
  
        const gamelist=NewAssesment.find({ studentsList: username }, {}, { sort: { 'CreatedTime': -1 } },function (err,result) {
          result_list = []
          for(var i=0;i<result.length;i++){
            indivdual_obj = result[i]
            temp_obj= Object()
            temp_obj.id =indivdual_obj.id
            temp_obj.topicname = indivdual_obj.topicName
            temp_obj.subject =indivdual_obj.subject
            temp_obj.Date =indivdual_obj.Date
            temp_obj.Duration=indivdual_obj.duration
            temp_obj.isCompleted=indivdual_obj.isCompleted
            result_list.push(temp_obj)
          }
          res.json({StatusCode: 200, StatusMessage: "Success", Schedule_Class: result_list})
      
        })
  
      } else {
        res.send(err);
      }
    });
  });




module.exports = router;