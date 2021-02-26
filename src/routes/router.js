import express from 'express'
import { router as homeRouter } from './home-router.js'

export const router = express.Router()

router.use('/', homeRouter)
