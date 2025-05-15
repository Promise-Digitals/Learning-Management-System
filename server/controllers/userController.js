import User from "../models/user.js";

// API to get user data
export const getUserData = async (req, res) => {
    try {
        
        const user = await User.findOne({_id: req.user._id}).select('-password')

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}