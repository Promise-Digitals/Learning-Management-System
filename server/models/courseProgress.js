import mongoose from "mongoose";

const courseprogressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    lectureCompleted: []
}, {minimize: false})

export const CoursePregress = mongoose.model('CourseProgress', courseprogressSchema)