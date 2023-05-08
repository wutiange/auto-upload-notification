import express from 'express'
import * as pgyerController from '../controllers/pgyerController'

const pgyerRouter = express.Router()


pgyerRouter.post('/upload', pgyerController.upload)

export default pgyerRouter