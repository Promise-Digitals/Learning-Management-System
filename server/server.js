import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import passport from 'passport'
import session from 'express-session'
import connectCloudinary from './configs/cloudinary.js'
import "./configs/passport.js"
import educatorRoutes from './routes/educatorRoutes.js'


// Initialize Express
const app = express()


// Connect to Database
await connectDB()
await connectCloudinary()


// Middlewares
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())


// Routes
app.get('/', (req, res) => res.send("API Working"))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/educator', educatorRoutes)

// Google passport authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: false }), (req, res) => {
    res.redirect('http://localhost:5173')
})


// Port
const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})