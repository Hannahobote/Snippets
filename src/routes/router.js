import express from 'express'
import { router as homeRouter } from './home-router.js'
import { HomeController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new HomeController()

router.use('/', homeRouter)

router.get('/', controller.index)

router.get('/new', controller.new)
router.post('/create', controller.create)

router.get('/:id/edit', controller.edit)
router.post('/:id/update', controller.update)

router.get('/:id/remove', controller.remove)
router.post('/:id/delete', controller.delete)
