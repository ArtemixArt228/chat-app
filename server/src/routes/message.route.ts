import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs'

import validator from "../middlewares/validator";

import {messageController} from "../controller";

const router = express.Router();

// Налаштування multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); // Вказуємо папку для зберігання файлів
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname; // Отримуємо оригінальну назву файлу
        const filePath = path.join('uploads', originalName); // Повний шлях до файлу

        // Перевіряємо, чи файл вже існує
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Якщо файл не існує, зберігаємо його
                cb(null, originalName);
            } else {
                // Якщо файл існує, просто використовуємо його
                // Наприклад, передаємо оригінальну назву
                cb(null, originalName);
            }
        });
    }
});
const upload = multer({ storage });

// Обробка POST запиту для повідомлень
router.post(
    '/',
    upload.single('fileURL'), // Додаємо завантаження файлу
    (req, res, next) => {
        next();
    },
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
