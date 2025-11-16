const {body} = require('express-validator')
const express = require('express');
const router = express.Router();


const coursescontroller = require('../controllers/course-controller')

router.route('/')
.get(coursescontroller.getAllCourses)
.post([body('title').notEmpty().withMessage('title cannot be empty').
isLength({min: 2}).withMessage('too short dude try 2 chars at least'),
body('price').notEmpty().withMessage('price required')],coursescontroller.addcourse)





router.route('/:courseId')
.get(coursescontroller.singleCourse)
.patch(coursescontroller.updatecourse)
.delete(coursescontroller.deletecourse)

module.exports =router;