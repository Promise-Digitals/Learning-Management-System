import Course from "../models/course.js"
import { Purchase } from "../models/purchase.js"
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


// Get Educator Dashboard Data(Total Earnings, Enrolled Students, No of courses)
export const educatorDashboardData = async (req, res) => {
    try {

        const educatorId = req.user._id;
        const courses = await Course.find({educator: educatorId})
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        // collect unique enrolled students Ids with their course titles
        const enrolledStudentsData = [];

        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name profile');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        })
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {

        const educatorId = req.user._id;
        const courses = await Course.find({educator: educatorId})

        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completes'
        }).populate('userId', 'name profile').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}