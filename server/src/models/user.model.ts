import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //Ім'я користувача
    username: {
        type: String,
        required: true
    },
    // Ідентифікатор зєднання
    socketID: {
        type: String,
        required: true
    },
    // Ідентифіікатор сесії
    sessionID: {
        type: String,
        required: true
    },
     // Поле статусу користувача
    isOnline: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

const userModel = mongoose.model('User', userSchema)
export default userModel
