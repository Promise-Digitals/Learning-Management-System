import Course from "../models/course.js"
import User from "../models/user.js"
import {v2 as cloudinary} from 'cloudinary'

export const updateRoleToEducator = async(req, res) => {
    try {
        const userId = req.user._id

        await User.findByIdAndUpdate(userId, {isEducator: true})

        res.json({
            success: true,
            message: "You can now publish a course"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Add New Course
export const addCourse = async (req, res) => {
    try {
        
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.user._id

        if (!imageFile) {
            return res.json({
                success: false,
                message: "Thumbnail not attached"
            })
        }

        const parsedCourseData = await JSON.parse(courseData)

        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({
            success: true,
            message: "Course added"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        
        const educatorId = req.user._id

        const courses = await Course.find({educator: educatorId})

        res.json({
            success: true,
            courses
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}