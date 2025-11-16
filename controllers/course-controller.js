const statusHttp = require('../utils/httpstatustext')
const {validationResult} = require('express-validator')
const courseModel = require('../models/coursemodel')

let getAllCourses =async (req,res)=>{

const query = req.query;
let limit = query.limit || 10;
let page = query.page || 1;
const skip = (page - 1 ) * limit;

     const courses = await courseModel.find({},{"__v": false}).limit(limit).skip(skip)
     res.json({status: statusHttp.SUCCESS, data: courses})
}
//getSingleCourse
let singleCourse = async (req,res)=>{
try{ const course = await courseModel.findById(req.params.courseId)
    if (!course)
    {
      res.json({status: statusHttp.FAIL, data:'course not found'});  }
      res.status(200).json({status: statusHttp.SUCCESS, data: course})
    }
   
      
      catch(err)
      {
        res.status(400).json({status: statusHttp.ERROR, error: err.message})
      }
  
  
  }

  const deletecourse = async (req,res)=>{
    let courseId = req.params.courseId
const data = await courseModel.deleteOne({_id: courseId})
  res.status(200).json({status:statusHttp.SUCCESS, msg: "deleted"})
}

const addcourse = async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) 
       { return res.status(400).json({status: statusHttp.FAIL,data: {errors: errors.array()}});}
    
       
    let newcourse = new courseModel(req.body)
    await newcourse.save()
    res.json({status: statusHttp.SUCCESS, data : {course: newcourse}})
    
      
    }

let updatecourse = async (req,res)=>{
   let courseId = req.params.courseId;
   try{  
     const updatedcourse = await courseModel.updateOne({_id: courseId}, {$set: {...req.body}})
     if (!updatedcourse){
      
return res.status(404).json({status: statusHttp.FAIL, msg:'course not found'})
}
//console.log(courseId)


res.status(200).json({status: statusHttp.SUCCESS, data: {updata_course: updatecourse}})
}
catch(errors){
    return res.status(400).json({status: statusHttp.error, error_Message:errors.message});
}
   
   

}



module.exports={
    getAllCourses,
    singleCourse,
    deletecourse,
    addcourse,
    updatecourse
}
