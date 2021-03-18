import express from 'express'
import { HomeController } from '../controllers/home-controller.js'
import { UserController } from '../controllers/user-controller.js'

export const router = express.Router()

const controller = new HomeController()
const user = new UserController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/', (req, res, next) => controller.indexPost(req, res, next))

// router.post('/login', (req, res, next) => controller.login(req, res, next))
// router.post('/create-account', (req, res, next) => controller.createAccount(req, res, next))

router.get('/login', (req, res, next) => user.login(req, res, next))
router.get('/create-account', (req, res, next) => user.createAccount(req, res, next))

router.post('/test', (req, res, next) => user.test(req, res, next))
