import Stripe from "stripe";
import Course from "../models/course.js";
import { Purchase } from "../models/purchase.js";
import User from "../models/user.js";
import { CoursePregress } from "../models/CourseProgress.js";

// API to get user data
export const getUserData = async (req, res) => {
    try {
        
        const user = await User.findOne({_id: req.user._id}).select('-password')

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

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


// Users Enrolled Courses with lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        
        const userData = await User.findById(req.user._id).populate('enrolledCourses')

        res.json({
            success: true,
            enrolledCourses: userData.enrolledCourses
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API to Purchase Course
export const purchaseCourse = async (req, res) => {
    try {

        const {courseId} = req.body
        const {origin} = req.headers
        const userData = await User.findById(req.user._id)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            res.json({
                success: false,
                message: "Data not found"
            })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId: userData._id,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        // Stripe Gateway Initialize
        const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        // Creating Line items for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await StripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify-stripe?success=true&purchaseId=${newPurchase._id}`,
            cancel_url: `${origin}/verify-stripe?success=false&purchaseId=${newPurchase._id}`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({
            success: true,
            session_url: session.url
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API for stripe webhooks for secure payment(In Video), we used dummy payment instead
export const stripeWebhook = async(req, res) => {

}


// API to Verify Stripe Payment
export const verifyStripe = async (req, res) => {
    const {purchaseId, success} = req.body

    try {

        if (success === "true") {
            const purchaseData = await Purchase.findById(purchaseId);
            const courseData = await Course.findById(purchaseData.courseId)
            const userData = await User.findById(purchaseData.userId)

            courseData.enrolledStudents.push(userData)
            await courseData.save()

            userData.enrolledCourses.push(courseData._id)
            await userData.save()

            purchaseData.status = "completed"
            await purchaseData.save()

            res.json({
                success: true
            })

        }else{
            await Purchase.findByIdAndUpdate(purchaseId, {status: "failed"});

            res.json({
                success: false
            })
        }
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Update user course progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.user._id
        const {courseId, lectureId} = req.body

        const progressData = await CoursePregress.findOne({userId, courseId})

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({
                    success: true,
                    message: "Lecture Already completed"
                })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        }else{
            await CoursePregress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({
            sucess: true,
            message: 'Progress Updated'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.user._id
        const {courseId, lectureId} = req.body

        const progressData = await CoursePregress.findOne({userId, courseId})

        res.json({
            success: true,
            progressData
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// Add user rating to course
export const addUserRating = async(req, res){
    const userId = req.user._id
    const {courseId, rating} = req.body;

    if (!courseId || userId || !rating || rating < 1 || rating > 5) {
        return res.json({
            success: false,
            message: "Invalid details"
        })
    }

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            res.json({
                success: false,
                message: 'Course not found'
            })
        }

        const user = await User.findById(userId)
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({
                success: false,
                message: "User has not purchased this course"
            })
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating
        }else{
            course.courseRatings.push({userId, rating})
        }

        await course.save();

        return res.json({
            success: true,
            message: 'Rating added'
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}