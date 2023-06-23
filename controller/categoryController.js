const Category=require('../models/categoryModel')

//add category
exports.addCategory=async(req,res)=>{
    //check if already exists
    let category=await Category.findOne({category_name:req.body.category_name})
    if(category){
        return res.status(400).json({error:"Category already exists"})

    }
    //if category donot exists, add new categories
    let categoryToAdd=new Category({
        category_name:req.body.category_name
    })
    categoryToAdd = await categoryToAdd.save()
    if(!categoryToAdd){
        return res.status(400).json({error:"SomeThing Went WROOOOOONG"})
    }
    res.send(categoryToAdd)
}

 //to get all categories

 exports.getAllCategories=async(req,res)=>{
    let categories=await Category.find()
    if(!categories){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(categories)
 }

 //to get all catgories using promie(.then)
 exports.categoryList=(req,res)=>{
    Category.find()
    .then(categories=>{
    if(!categories){
        return res.status(400).json({error:"Something went wrong"})
    }
    else{
    res.send(categories)
    }
})
.catch(err=>res.status(400).json({error:err.msg}))
 }

 //category details
 exports.getCategoryDetails=async(req,res)=>{
    let category=await Category.findById(req.params.id)
    if(!category){
        return res.status(400).json
        ({error:"something went wrong"})
    }
    res.send(category)
 }

 //category update
 exports.updateCategory=async(req,res)=>{
    let categoryToUpdate=await Category.findByIdAndUpdate(req.params.id,{
        category_name:req.body.category_name
    },
    {new:true})

    if(!categoryToUpdate){
        return res.status(400).json
        ({error:"Something went wrong!!"})
    }
    res.send(categoryToUpdate)  
 }


 //delete category
 exports.deleteCategory=(req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then(categoryToDelete=>{
        if(!categoryToDelete){
        return res.status(400).json
        ({error:"Category not found"})
        }
        res.send({message:"Category deleted successfully"})
    })
    .catch(err=>res.status(400).json({error:err.message}))
}

//