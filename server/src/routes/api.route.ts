import express from 'express'

import userRouter from './user.route'
import groupsRouter from './group.route'
import messageRouter from './message.route'
import sessionRouter from './session.route'

const router = express.Router()

router.use('/users', userRouter)
router.use('/groups', groupsRouter)
router.use('/messages', messageRouter);
router.use('/sessions', sessionRouter);

export default router
