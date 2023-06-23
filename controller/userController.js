const crypto =require('crypto')
const jwt = require('jsonwebtoken')


const User = require('../models/userModel')
const Token=require('../models/tokenModel')

const sendEmail = require('../utils/setEmail')
const { send } = require('process')
const { expressjwt } = require('express-jwt')
const OrderItemsModel = require('../models/OrderItemsModel')

//to register new user
exports.userRegister = async(req,res)=>{
    //destructuring to get user name,email.password
    const {username,email,password}=req.body
    let user = await User.findOne({email:email})
    if(user){
        return res.status(400).json({error:"email already registered."})
    }
    let userToRegister=new User({
        username:username,
        email:email,
        password:password
    })
    userToRegister=await userToRegister.save()
    if(!userToRegister){
        return res.status(400).json({error:'something went wrong'})
    }
   
    //generate token
    let token=new Token({
        token: crypto.randomBytes(24).toString('hex'),
        user:userToRegister._id
    })
    token=await token.save()
    if(!token){
        return res.status(400).json({error:"Something Went Wrong"})
    }
   //sent verification email
   //const url=`http://localhost:5000/api/emailverification/${token.token}`
   const url=`${process.env.FRONTEND_URL}/emailverification/${token.token}` 

sendEmail({
    from:"noreply@example.com",
    to:email,
    subject:"verification Email",
    text:`CLick on the following link or copy paste it in your browser to verify to your email.${url}`,
    html:`<a href="${url}"><button>Verify email</button></a>`
})

    res.send(userToRegister)
}

//to verify email/user
exports.emailVerification=async (req,res)=>{
    //check token
    let token = await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired"})
    }
    //check user
    let user=await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User associated with the token not found"})
    }
    
    //check if already verified
    if(user.isVerified){
        return res.status(400).json({error:"User already verified.Login to continue"})
    }
    //verify user
    user.isVerified=true
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send({message:"User verified successfully"})
}

//resent verification
exports.resendVerification=async(req,res)=>{
    //check email
    let user=await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered."})
    }
    //check if already verified
    if(user.isVerified){
        return res.status(400).json({error:"user already verified.login to continue"})
    }
    //generate token
    let token=new Token({
        token: crypto.randomBytes(24).toString('hex'),
        user:user._id
    })
    token=await token.save()
    if(!token){
        return res.status(400).json({error:"Something Went Wrong"})
    }
    //send token in email
    //const url=`http://localhost:5000/api/emailverification/${token.token}`
   const url=`${process.env.FRONTEND_URL}/emailverification/${token.token}` 

sendEmail({
    from:"noreply@example.com",
    to:/*{req.body.email,}*/user.email,
    subject:"verification Email",
    text:`CLick on the following link or copy paste it in your browser to verify to your email.${url}`,
    html:`<a href="${url}"><button>Verify email</button></a>`
})

res.send({message:"Email verification link has been sent to your email."})
}

//forget password
exports.forgetpassword=async(req,res)=>{
    //check email
    let user=await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"User not registered"})
    }
    //generate token
    let token=new Token({
        token:crypto.randomBytes(24).toString('hex'),
        user:user._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }

    //send reset link with token in email
//    const url=`http://localhost:5000/api/resetpassword/${token.token}`
   const url=`${process.env.FRONTEND_URL}/resetpassword/${token.token}` 
   sendEmail({
        from:"noreply@eg.com",
        to:user.email,
        subject:"reset password",
        text:`click on the following link or copy paste it in your browser to reset your password.${url}`,
        html:`<a href='${url}'><button>Reset</button></a>`
    })
res.send({message:"Password reset link has been sent to your email."})

}

//reset password
exports.resetPassword = async(req,res)=>{
    //check token
    let token = await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"Inavalid token or token may have expired"})
    }

    // find user
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User associated with the token not found"})
    }
    //reset pw
    user.password=req.body.password
    user=await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send({message:"Password reset successful"})
}

//signin process
exports.signIn = async(req,res)=>
{
    let {email,password}=req.body
    //check email
    let user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({error:"email not registered"})
    }
    //check password
    if(!user.authenticate(password)){
        return res.status(400).json({error:"email and password do not match"})
    }
    //user verified or not?
    if(!user.isVerified){
        return res.status(400).json({error:"User not verified"})
    }
    //generate token-jwt(json web token)
    let token = jwt.sign({user:user._id,role:user.role},process.env.JWT_SECRET)
    //set data in cookie
    res.cookie('myCookie',token,{expire:Date.now()+86400})
    //send information to frontend
    let {_id,username,role}=user
    res.send({token,user:{_id,username,role,email}})
}

//signout process
exports.signOut=async(req,res)=>{
    let response=await res.clearCookie('myCookie')
    if(!response){
        return res.status(400).json({error:"Something Went Wrong"})
    }
    res.send({message:"signed Out successfully"})
}

//authorization
exports.requireSignin=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256']
})

//user List
exports.userList=(req,res)=>{
    User.find()//.populate('username')
    .then(user=>{
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    else{
    res.send(user)
    }
})
.catch(err=>res.status(400).json({error:err.msg}))
 }

 //user details
 exports.getUserDetails=async(req,res)=>{
    let user=await User.findById(req.params.id)
    if(!user){
        return res.status(400).json
        ({error:"something went wrong"})
    }
    res.send(user)
 }

 //update user
 exports.updateUser=async(req,res)=>{
    let userToupdate = await User.findByIdAndUpdate(req.params.id,{
        username:req.body.username,
        email:req.body.email
    },{new:true})
    if(!userToupdate){
        return res.status(400).json({error:"User not found"})
    }
    res.send(userToupdate)
 }
 
 //to delete an user
exports.deleteUser=(req,res)=>{
    User.findByIdAndRemove(req.params.id)
    .then(userToDelete=>{
        if(!userToDelete){
        return res.status(400).json
        ({error:"User not found"})
        }
        res.send({message:"user deleted successfully"})
    })
    .catch(err=>res.status(400).json({error:err.message}))
}

