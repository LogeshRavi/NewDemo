


module.exports=(req,res,next)={
    const {authorization} = req.headers

if(!authorization){
    return res.status(401).json({error:"you must login"})
}

const token=authorization.replace("Bearer ","")
jwt.verify(token,'secretkey',(err,payload)=>{
    if(err){

    }
    const id=payload
    User.findById(id).then(userdata=>{
        req.user=userdata
        next()
    })
})
}