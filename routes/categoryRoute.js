const express = require('express')
const { addCategory, getAllCategories, getCategoryDetails, categoryList, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireSignin } = require('../controller/userController')
const { categoryCheck, validate } = require('../validation/validator')
const router = express.Router()

router.post('/addcategory',categoryCheck,validate,requireSignin, addCategory)
router.get('/getallcategories',getAllCategories)
router.get('/categorylist',categoryList)
router.get('/categorydetails/:id',getCategoryDetails)
router.put('/updatecategory/:id',requireSignin, updateCategory)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)

module.exports=router