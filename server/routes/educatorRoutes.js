import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorControllers.js'
import { ensureAuthenticated } from '../middlewares/auth.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/educator.js'

const router = express.Router()


// Add Educator Role
router.get('/update-role', ensureAuthenticated, updateRoleToEducator)
router.post('/add-course', upload.single('image'), protectEducator, addCourse)
router.get('/courses', ensureAuthenticated, protectEducator, getEducatorCourses)
router.get('/dashboard', ensureAuthenticated, protectEducator, educatorDashboardData)
router.get('/enrolled-students', ensureAuthenticated, protectEducator, getEnrolledStudentsData)


export default router;