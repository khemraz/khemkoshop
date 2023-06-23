const {check,validationResult}=require('express-validator')

exports.categoryCheck=[
    check('category_name',"category name is required").notEmpty()
    .isLength({min:3}).withMessage("Category name must be atleast 3 chars")
]

exports.validate=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        //return res.status(400).json({error:errors.array().map(err=>err.msg)})
        return res.status(400).json({error:errors.array()[0].msg})
    }
    next()
}

exports.productCheck=[
    check('product_name',"Product name is required").notEmpty().isLength({min:3}).withMessage("product name must be at least 3 characters"),

    check('product_price',"Product price is required").notEmpty().isNumeric().withMessage("price must be number"),

    check('product_description',"Product description is required").notEmpty().isLength({min:20}).withMessage("description must be at least 20 characters"),

    check('count_in_stock',"count in stock is required").notEmpty().isNumeric().withMessage("count must be a number"),

    check('category',"category is required").notEmpty()
    
]

exports.userCheck = [
    check("username", "User name is required").notEmpty().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    
    check("email", "email is required").notEmpty().isEmail().withMessage("email format incorrect")
    //email milena bhane withMessage auxa
    ,
    check("password", "Password is  required").notEmpty().matches(/[a-z]/).withMessage("Password contain must 1 lowercase character ").matches(/[A-Z]/).withMessage("Password must contain at least 1 upper case character").isLength({ min: 8 }).withMessage("password must  be at least 8 characters")
      .not().matches(/[./\\]/).withMessage("password must not contain . or / or \\")
  ]