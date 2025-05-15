import User from "../models/user.js"

export const protectEducator = async (req, res, next) => {
    try {

        const userId = req.user._id

        const response = await User.findById(userId)

        if (!response.isEducator) {
            return res.json({
                success: false,
                message: "Unathorized Access!"
            })
        }

        next()
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}