import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // Посилання на користувача який відправив повідомлення
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Зміст повідомлення
    content: {
        type: String,
        required: false
    },
    // Ідентифікатор групи
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    // Поле для визначення чи повідомлення є голосовим
    isVoiceMessage: {
        type: Boolean,
        default: false
    },
    // шлях до файлу якйи вкладений у повідомлення
    fileURL: {
        type: String,
        default: null
    }
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema)

export default messageModel
