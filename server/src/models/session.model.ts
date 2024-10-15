import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    // Ідентифікатор коритувача який стосується сесії
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Ідентифікатор сесії
    sessionID: {
        type: String,
        required: true,
        unique: true
    },
    // Час створення сесії
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Час Завершення сесії
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const sessionModel = mongoose.model('Session', sessionSchema)

export default sessionModel
