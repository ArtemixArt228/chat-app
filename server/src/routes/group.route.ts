import express from 'express';
import { body } from 'express-validator';
import validator from '../middlewares/validator';

import { groupController } from "../controller";

const router = express.Router();

router.post(
    '/',
    body('name')
        .exists()
        .withMessage('Group name is required'),
    body('members')
        .isArray()
        .withMessage('Members must be an array'),
    body('createdBy')
        .exists()
        .withMessage('Creator ID is required'),
    validator,
    groupController.createGroup
);

router.get(
    '/:groupId',
    groupController.getGroup
);

router.get(
    '/',
    groupController.getGroups
)

router.put(
    '/addMember',
    body('groupId')
        .exists()
        .withMessage('Group ID is required'),
    body('userId')
        .exists()
        .withMessage('User ID is required'),
    validator,
    groupController.addMember
);

export default router;
