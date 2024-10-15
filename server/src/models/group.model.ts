import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    // Назва групи
    name: {
        type: String,
        required: true
    },
    // Список учасників групи
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // Ідентифікатор користувача який створив групу
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const groupModel = mongoose.model("Group", groupSchema)

export default groupModel
