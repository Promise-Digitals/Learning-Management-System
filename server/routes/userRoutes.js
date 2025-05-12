import express from 'express'
import { getUserData} from '../controllers/userController.js';
import { ensureAuthenticated } from '../middlewares/auth.js';

const router = express.Router()

// Get user Data
router.get('/user', ensureAuthenticated, getUserData)



export default router;