import express from 'express';
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
        },
        profile: {
            type: String,
            required: true
        },
        isEducator: {
            type: Boolean,
            default: false
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ]
    }, {timestamps: true}
);


const User = mongoose.model('User', userSchema);

export default User