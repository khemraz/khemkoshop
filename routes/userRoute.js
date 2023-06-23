const express = require('express')
const { userRegister, emailVerification, resendVerification, forgetpassword, resetPassword, signIn, signOut, userList, getUserDetails, updateUser, deleteUser } = require('../controller/userController')
const { userCheck, validate } = require('../validation/validator')


const router=express.Router()

router.post('/register',userCheck,validate, userRegister)
router.get('/emailverification/:token',emailVerification)
router.post('/resendverification',resendVerification)
router.post('/forgetpassword',forgetpassword)
router.post('/resetpassword/:token',resetPassword)
router.post('/signin',signIn)
router.get('/signout',signOut)
router.get('/userlist',userList)
router.get('/userdetails/:id',getUserDetails)
router.put('/updateuser/:id',updateUser)
router.delete('/deleteuser/:id',deleteUser)


module.exports=router