import express from 'express'
import { HomeController } from '../controllers/home-controller.js'
import { UserController } from '../controllers/user-controller.js'

export const router = express.Router()

const controller = new HomeController()
const user = new UserController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/', (req, res, next) => controller.indexPost(req, res, next))

// renders form to create account
router.get('/create-account', async (req, res, next) => res.render('snippets/create-account'))
// post form to create account
router.post('/signup', (req, res, next) => user.createAccount(req, res, next))

// renders login form to login user
router.get('/login', async (req, res, next) => res.render('snippets/login'))
// post form to login
router.post('/login-post', (req, res, next) => user.login(req, res, next))

// views a button option for the user to log out.
router.get('/pre-logout', (req, res, next) => user.preLogout(req, res, next))
// user logsout
router.post('/logout', (req, res, next) => user.logout(req, res, next))
