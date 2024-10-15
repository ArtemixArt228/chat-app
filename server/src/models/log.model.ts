import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    // Поле із типом дії
    action: {
        type: String,
        required: true
    },
    // опис події
    description: {
        type: String,
        required: true
    },
    // Посилання на ідентифікатор користувача який виконав дію
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
}, { timestamps: true });

const logModel = mongoose.model('Log', logSchema);

export default logModel;
