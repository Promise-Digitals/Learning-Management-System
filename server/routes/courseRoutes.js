import express from 'express'
import { getAllCourses, getCourseId } from '../controllers/courseController.js'

const router = express.Router()

router.get('/all', getAllCourses)
router.get('/:id', getCourseId)


export default router