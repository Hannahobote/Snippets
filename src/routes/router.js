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
// user has to be logged in to create
router.post('/create', auth.authorize, controller.create)

router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))
// user must be authenticated + be the author of the snippet to edit the snippet.
router.post('/:id/update', auth.authorize, auth.userPremission, controller.update)

router.get('/:id/remove', (req, res, next) => controller.remove(req, res, next))
// user must be authenticated + be the author of the snippet to delete the snippet.
router.post('/:id/delete', auth.authorize, auth.userPremission, controller.delete)