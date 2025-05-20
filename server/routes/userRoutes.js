import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, verifyStripe} from '../controllers/userController.js';
import { ensureAuthenticated } from '../middlewares/auth.js';

const router = express.Router()

// Get user Data
router.get('/user', ensureAuthenticated, getUserData)
router.get('/enrolled-courses', ensureAuthenticated, userEnrolledCourses)
router.post('/purchase', ensureAuthenticated, purchaseCourse)
router.post('/verifyStripe', ensureAuthenticated, verifyStripe)

router.post('/update-course-progress', ensureAuthenticated, updateUserCourseProgress)
router.post('/get-course-progress', ensureAuthenticated, getUserCourseProgress)

router.post('/add-rating', ensureAuthenticated, addUserRating)




export default router;