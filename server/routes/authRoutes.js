import express from 'express'
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';
import upload from '../configs/multer.js';

const router = express.Router()

// Get user Data
router.post('/register', upload.single('profile'), registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)



export default router;