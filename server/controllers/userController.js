import User from "../models/user.js";

// API to get user data
export const getUserData = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            image: req.user.image
        }
    })
}