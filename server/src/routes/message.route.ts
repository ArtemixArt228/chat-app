import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';

import validator from "../middlewares/validator";

import {messageController} from "../controller";

const router = express.Router();

// Налаштування multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Обробка POST запиту для повідомлень
router.post(
    '/',
    upload.single('file'), // Додаємо завантаження файлу
    body('sender')
        .exists()
        .withMessage('Sender is required and cannot be empty'),
    body('groupId')
        .exists()
        .withMessage('Group ID is required and cannot be empty'),
    body('isVoiceMessage')
        .isBoolean()
        .withMessage('isVoiceMessage must be a boolean value'),
    // Перевірка контенту
    body('content')
        .custom((value, { req }) => {
            if (req.file) {
                // Якщо файл є, контент може бути пустим
                return true;
            }
            if (!value) {
                throw new Error('Content is required if no file is provided');
            }
            return true;
        }),
    validator,
    messageController.createMessage,
);

router.get(
    '/:groupId',
    messageController.getMessages
);

export default router;
