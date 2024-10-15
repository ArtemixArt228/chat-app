import express from 'express'
import { body } from 'express-validator'

import userModel from "../models/user.model";

import validator from "../middlewares/validator";
import {authController, userController} from "../controller";

const router = express.Router()

router.post(
    '/',
    body('username')
        .exists()
        .withMessage("name required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .custom(async user => {
            const getUser = await userModel.findOne({ username: user });
            if (getUser) return Promise.reject("Username is already taken");
        }),
    body('socketID')
        .exists()
        .withMessage('Socket ID is required'),
    validator,
    userController.createUser
);

router.get(
    '/',
    userController.getUsers
)

router.get(
    '/:sessionID',
    userController.getUser
)
router.put(
    '/status',
    body('userId')
        .exists()
        .withMessage('User ID is required'),
    body('isOnline')
        .exists()
        .isBoolean()
        .withMessage('isOnline must be a boolean value'),
    validator,
    userController.updateUserStatus
)

router.post(
    '/login',
    body('username')
        .exists()
        .withMessage("Username is required"),
    validator,
    authController.login
);

router.post(
    '/logout',
    body('sessionID')
        .exists()
        .withMessage('Session ID is required'),
    validator,
    authController.logout
);

export default router
