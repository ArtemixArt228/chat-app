import express from 'express'
import { body } from 'express-validator';

import validator from "../middlewares/validator";

import {sessionController} from "../controller";


const router = express.Router();

router.post(
    '/',
    body('userId')
        .exists()
        .withMessage('User id is required and cannot be empty'),
    validator,
    sessionController.createSession
);

router.get(
    '/:sessionID',
    sessionController.validateSession
);

export default router;
