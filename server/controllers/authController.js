import User from "../models/user.js";
import bcrypt from "bcryptjs";
import passport from 'passport'
import '../configs/passport.js'
import {v2 as cloudinary} from 'cloudinary'

// API to register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    const imageFile = req.file;

    try {
        if (!name || !email || !password || !imageFile) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        if (await User.findOne({ email })) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const profileUpload = await cloudinary.uploader.upload(imageFile.path)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profile: profileUpload.secure_url
        })

        await user.save()

        return res.status(201).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}


// API to login user
export const loginUser = async (req, res) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            })
        }

        if (!user) {
            return res.status(401).json({
                success: true,
                info
            })
        }

        req.login(user, (error) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                })
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        })
    })(req, res)
}


// API to logout User
export const logoutUser = async (req, res) => {
    req.logout((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            })
        }

        res.status(204).send()
    })
}

