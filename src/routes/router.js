import express from 'express'
import { router as homeRouter } from './home-router.js'
import { HomeController } from '../controllers/home-controller.js'
import { AuthController } from '../controllers/auth-controller.js'

export const router = express.Router()

const controller = new HomeController()
const auth = new AuthController()

router.use('/', homeRouter)

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/new', (req, res, next) => controller.new(req, res, next))
router.post('/create', auth.authorize, controller.create)

router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))
router.post('/:id/update', (req, res, next) => controller.update(req, res, next))

router.get('/:id/remove', (req, res, next) => controller.remove(req, res, next))
router.post('/:id/delete', (req, res, next) => controller.delete(req, res, next))
