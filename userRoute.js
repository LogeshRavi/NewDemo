const router = require('express').Router();
const User = require('./Schema/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
const Schedule = require('./Schema/ScheduleSchema');
const Assesment = require('./Schema/AssesmentSchema')
const Students = require('./Schema/StudentsSchema');
const Gamelist = require('./Schema/GameSchema')
const Teacher = require('./Schema/TeacherSchema');
const StudentsData = require('./Schema/StudentsData')
const School = require('./Schema/SchoolSchema')
const Reports = require('./Schema/ReportsSchema')
const Educator=require('./Schema/educatorSchema');
const Child=require('./Schema/NewStudentSchema');
const bodyParser = require('body-parser')
const {validateConfirmPassword}=require('./views/validator')
//const { check, validationResult } = require('express-validator')
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
      res.json({ StatusCode: 200, StatusMessage: "Success", Response: "OTP Send Successfully",User:data })

     }
  })

   // res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Register Successfully", user: data })

})

//OTP verification for educator
router.post('/otp-verification', async (req, res) => {

  const email=req.query.Email
  const otp=req.body.otp
  
  var EmailExist = await Educator.findOne({ Email:email })
   const otp1=EmailExist.otp
  if(otp==otp1){
    
    var update = await Educator.updateMany({ Email: email }, {
      $set: {
        isVerify:"Y"
      }
    })
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Account Verify" })
  }
  else{
    res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Pls Check OTP "})

  }

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


//new class schedule
router.post("/scheduleclass/kg", ValidUser, async (req, res) => {


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


//fetch schedule data

router.get("/schedule/alldata", ValidUser, async (req, res) => {
  const username = req.user.empid
  Schedule.find({ empid: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {


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

        await Schedule.findByIdAndUpdate(id, {
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

      const data = Schedule.find({ empid: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
        res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Class: results });
      })


    } else {
      res.send(err);
    }
  });
});

//Assesment 
router.post("/assesment/kg", ValidUser, async (req, res) => {
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
//router.route("/assesment/alldata").get(function(req, res) {
router.get("/assesment/alldata", ValidUser, async (req, res) => {
  const username = req.user.empid
  Assesment.find({ empid: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
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
        await Assesment.findByIdAndUpdate(id, {
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
      const data = Assesment.find({ empid: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
        res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Assesment: results });
      })
    } else {
      res.send(err);
    }
  });
});

//get student name
router.route("/classstudent").post(function (req, res) {
  const cursor = Students.find({ "class": req.body.class ,"schoolName":req.body.schoolName}, (function (err, results) {
    res.json(results)
  }));
})

//GET GAME
router.route("/gameselection").post(function (req, res) {
  const cursor = Gamelist.find({ subjectName: req.body.subjectName }, (function (err, results) {
    res.json(results)
  }));
})


//delete student details
router.route("/deleteStudents").delete(function (req, res) {
  var id = req.query.id;
  const data = Students.findByIdAndDelete(id, function (err, results) {
    res.json(results)
  })
})


//Get Student Class
router.get("/getStudentClass1", ValidUser, async (req, res) => {
  const user = req.user.rollno
  console.log(user)
  const Class = Schedule.find({ studentRollNoList: user }, function (req, results) {
    console.log(results)
    res.json(results)
  }
  )
})

//get Student Class
router.get("/getStudentAssessment1", ValidUser, async (req, res) => {
  const user = req.user.rollno
  console.log(user)
  const Class = Assesment.find({ studentRollNoList: user }, function (req, results) {
    console.log(results)
    res.json(results)
  }
  )
})

router.get("/getTeacherClass", ValidUser, async (req, res) => {
  const ClassName = req.user.class
  res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Schedule Successfully", ClassName: ClassName })
})


router.get("/getStudentClass", ValidUser, async (req, res) => {
  const username = req.user.rollno
  console.log(username)
  Schedule.find({ studentRollNoList: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
    console.log(result)

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

        await Schedule.findByIdAndUpdate(id, {
          $set: {
            isCompleted: isCompleted,
            RemainingTime: Rt / 60000
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
      const data = Schedule.find({ studentRollNoList: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
        res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Class: results });
      })


    } else {
      res.send(err);
    }
  });
});


router.get("/getStudentAssessment", ValidUser, async (req, res) => {
  const username = req.user.rollno
  console.log(username)
  Assesment.find({ studentRollNoList: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
    console.log(result)

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

        await Assesment.findByIdAndUpdate(id, {
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
      const data = Assesment.find({ studentRollNoList: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
        res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Class: results });
      })

    } else {
      res.send(err);
    }
  });
});


//student reports
router.post("/studentwise/report", ValidUser, async (req, res) => {
  const rollno1 = req.user.rollno
  const cursor = Reports.find({ $and: [{ rollno: rollno1 }, { AssesmentId: req.body.AssesmentId }] }, (function (err, results) {
    console.log(results)
    res.json(results)
  }));
})


//report for teachers
router.post("/studentwise/report1", ValidUser, async (req, res) => {
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

router.post("/teacherwise/report1", ValidUser, async (req, res) => {

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

// get studentgame from assesment  01 100%
router.get("/student/gamename/report", ValidUser, async (req, res) => {

  const rollno=req.user.rollno
  //const studentUserName1=req.query.studentUserName
  const AssesmentId=req.query.AssesmentId
 
  var data1=[]
  var data=[]
  const gamelist=Reports.find({$and:[{rollno:rollno}, {AssesmentId:AssesmentId}]},function (err,result) {
    
    
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
router.get("/studentwise/report", ValidUser,async (req, res) => {
     
  const rollno=req.user.rollno
  //const studentUserName1=req.query.studentUserName
  //const class1=req.user.class
  const AssesmentId=req.query.AssesmentId
  const Subject=req.query.Subject

  const gamelist=Reports.find({$and:[{rollno:rollno }, {AssesmentId:AssesmentId},{GameName:Subject}]},function (err,result) {
    
    res.json({ StatusCode: 200, StatusMessage: "Success", Response: "Report", Student_Report: result })

  })
})

// router.get("/getstudentlist/assesment", async (req, res) => {

//   const AssesmentId1 = req.query.AssesmentId
//   const arr = []
//   // const studentlist=Reports.find({AssesmentId:AssesmentId1},function (err,result) {
    
//   //   console.log(result)
//   //   result_list = []
//   //   for(var i=0;i<result.length;i++){
//   //     indivdual_obj = result[i]
//   //     temp_obj= Object()
//   //     temp_obj.name = indivdual_obj.name
//   //     temp_obj.rollno =indivdual_obj.rollno
//   //     result_list.push(temp_obj)
//   //   }
//   //   console.log(result_list)
//   //   res.send(result_list)

//   // })

//   Reports.aggregate(
//     [
//       {
//         $match: {
//           AssesmentId: AssesmentId1
//         }
//       },
//       {
//         $group: {
//           _id: {rollno:"$rollno",name:"$name"},

          
//         }
//       },
//       {
//         $sort: { rollno: -1 }
//       }
     
//     ],
//     (e, d) => {
//       if (!e) {

//         console.log(d)
//         var arrayOfStrings = d.map(function (obj) {
//           arr.push(obj._id)
//           console.log(arr)
//         });
//         res.json(arr)
//       }
//       //  const cursor = Reports.find({rollno:d},function(err,result){
//       //   var arrayOfStrings = result.map(function(obj) {
//       //     arr1.push(obj.name)
//       //     console.log(arr1)            
//       //   });

//       //  })



//       else {
//         console.log(e)
//       }
//     })

//   })

//tab 1 teacher report getStudentlist from assesment
router.get("/assesment/studentlist",ValidUser,async (req, res) => {
     
  //const rollno=req.query.rollno
  const AssesmentId=req.query.AssesmentId
  Assesment.findById(AssesmentId ,  function (err, result) {
    res.json({StatusCode: 200, StatusMessage: "Success", Students_List: result.studentRollNoList})
  })
})
  

//tab1 get student gamelist by teacher
  router.get("/gamename1/report", async (req, res) => {

    const rollno=req.query.rollno
   // const class1=req.query.class
    const AssesmentId=req.query.AssesmentId
    //console.log(AssesmentId,class1,rollno)
    var data1=[]
    var data=[]
    const gamelist=Reports.find({$and:[{rollno:rollno }, {AssesmentId:AssesmentId}]},function (err,result) {
      
     
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
     
    const rollno=req.query.rollno
    const class1=req.query.class
    const AssesmentId=req.query.AssesmentId
    const Subject=req.query.Subject
  
    const gamelist=Reports.find({$and:[{rollno:rollno }, {AssesmentId:AssesmentId},{GameName:Subject}]},function (err,result) {
  
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
//res.json({StatusCode: 200, StatusMessage: "Success", Schedule_Class: result})
  //get gamelist
  // router.get("/gamelist3/report",async (req, res) => {
     
  //   const rollno=req.query.rollno
  //   const AssesmentId=req.query.AssesmentId
  //   Assesment.findById(AssesmentId ,  function (err, result) {
  //   res.json({StatusCode: 200, StatusMessage: "Success", Schedule_Class: result.GameName})
    
  // })

  

  //new student login
  router.post('/login1', async (req, res) => {
   
    var StudentExist = await Educator.findOne({studentUserName: req.body.name,studentPassword:req.body.password})
    
    
   
    if (!StudentExist ) {
      
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "UserId or Password Not Correct" })
    }
   


    if (StudentExist) {

      
      
      var userToken = await jwt.sign({ _id: StudentExist.id }, 'secretkey')
        res.header('auth', userToken).send({ StatusCode: 200, StatusMessage: "Success", Response: "Login Successfully", token: userToken, user: StudentExist })

    }
    else
    {
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "UserId or Password Not Correct" })
    }

  })

  //login parents
  router.post('/login/parent', async (req, res) => {

    var ParentExist = await Educator.findOne({Email:req.body.Email})

   
    
    if(!ParentExist){
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Email Not Found" })
    }

   
    let results;
    if(ParentExist.isVerify=="Y"){
      if(ParentExist && ParentExist.ePassword==req.body.password){
      
        const cursor=Child.find({EducatorEmail:req.body.Email},function  (err,result) {
          results=result
        console.log(results)
        var userToken = jwt.sign({ _id: ParentExist.id }, 'secretkey')
          res.header('auth', userToken).json({ StatusCode: 200, StatusMessage: "Success", Response: "Login Successfully", token: userToken, user: ParentExist ,Student_List:results})
        })
      }
      else{
        return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: " Password Not Correct" })
      }
    }
    else{
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Your Account is Not Verify" })
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

  // router.post("/parent/update", NewValidUser, async (req, res) => {
  //   const email=req.user.Email
  //   console.log(email)
  // })

  router.post("/newassesment/kg", NewValidUser, async (req, res) => {
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

  router.get("/getStudentAssessment2", NewValidUser, async (req, res) => {
    const username = req.user.AddStudent[0].studentUserName
    //console.log(username)
    Assesment.find({ studentRollNoList: username }, {}, { sort: { 'CreatedTime': -1 } }, async function (err, result) {
      //console.log(result)
  
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
  
          await Assesment.findByIdAndUpdate(id, {
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
        const data = Assesment.find({ studentRollNoList: username }, {}, { sort: { 'CreatedTime': -1 } }, function (req, results) {
          res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Class: results });
        })
  
      } else {
        res.send(err);
      }
    });
  });

//children login
  router.post('/login/children', async (req, res) => {

    var StudentExist = await Child.findOne( {studentUserName: req.body.name,studentPassword:req.body.password})

   
    if (!StudentExist ) {
      
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "UserId Not Exist" })
    }
   
    if (StudentExist) {
      
      var userToken = await jwt.sign({ _id: StudentExist.id }, 'secretkey')
        res.header('auth', userToken).send({ StatusCode: 200, StatusMessage: "Success", Response: "Login Successfully", token: userToken, user: StudentExist })

    }
    else
    {
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Password Not Correct" })
    }

  

  })

  router.post("/educator/update", NewValidUser, async (req, res) => {
    const Email=req.user.Email
    const Email1=req.body.Email
    var update = await Educator.updateMany({ Email: Email }, {
      $set: {
       // Email:req.body.Email,
        Name:req.body.Name,
        eUserName:req.body.eUserName,
        ePassword:req.body.ePassword,
        phoneNumber:req.body.phoneNumber,
      }
    })

    var update = await Child.updateMany({ Email: Email }, {
      $set: {
        Email:req.body.Email,
      }
    })
 
    var name= Child.find({Email:Email1}, function (err,result) {
      if(result){
        for (var {id:id,UserName:UserName,Email:Email}of result) {
          studentUserName2=UserName+"_"+Email
          console.log(studentUserName2)
           Child.findByIdAndUpdate(id, {
            $set: {
              studentUserName:studentUserName2
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
        const data = Child.find({ Email:Email1 }, function (req, results) {
          res.send({ StatusCode: 200, StatusMessage: "Success", Schedule_Assesment: results });
        })
      }
    })
  
  })

  //Edit Children 
  router.post("/child/update", NewValidUser, async (req, res) => {

    //const Email=req.user.Email
    const studentUserName1=req.query.studentUserName
    //const Email1=req.body.Email
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
 

  router.post("/forgot/password", async (req, res) => {
    
    const email=req.body.Email
    
    var EmailExist = await Educator.findOne({ Email: email })

    if (!EmailExist) {
      return res.json({ StatusCode: 400, StatusMessage: "Failure", Response: "Email ID Not Exist" })
    }

    //const secret=JWT_Secret+EmailExist.ePassword
  
      const id=EmailExist.id
    

    var userToken = jwt.sign({_id:id}, 'secretkey')
    const link=`http://localhost:3000/api/reset-password/${userToken}`

    const output = `
    
    <h2>TERV KIDS |Reset Password</h2>
    <h3>Hi ${req.body.Email}</h3>
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
         res.json({Success:'Mail send successfully',Token:userToken})
       }
    })
  })

  router.get("/reset-password/:token", async (req, res) => {
    [validateConfirmPassword]
    const token=req.params.token
        jwt.verify(token, 'secretkey', (err, payload) => {
            if (err) {
        
            }
        res.render('reset-password') 
        })
     })

     

  router.post("/reset-password/:token", body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
        }
      }), async (req, res) => {

    // req.check('password', 'Password is invalid Min 4 length').isLength({min: 4})
    // req.check('password', 'Password and Confirm Password is Not Equal').equals(req.body.password2);


    [validateConfirmPassword]
   // var password=req.body.password
   const {password,password2}=req.body
    //const id=req.params.id
    console.log(password,password2)
    const token=req.params.token
    
    //console.log(token)

    if (password !== password2) {
     return res.send( 'Passwords do not match, pls try again ' );
  }
   
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
                res.send('password updated succesfully,Now login in Terv kids App')
            }
          });
      })

      

      

      
    } catch (error) {
      
    }
  


  })

  

module.exports = router;