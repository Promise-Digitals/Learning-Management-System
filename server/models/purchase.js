import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseId: {
        type: String,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
}, {timestamps: true});


export const Purchase = mongoose.model('Purchase', purchaseSchema)