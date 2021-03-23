import express from 'express'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import { HomeController } from '../controllers/home-controller.js'
import { UserController } from '../controllers/user-controller.js'

export const router = express.Router()

const controller = new HomeController()
const user = new UserController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/', (req, res, next) => controller.indexPost(req, res, next))

// router.get('/login', (req, res, next) => user.login(req, res, next))
// router.get('/create-account', (req, res, next) => user.createAccount(req, res, next))
router.get('/create-account-get', async (req, res, next) => {
 res.render('snippets/create-account')
})

router.get('/login-get', async (req, res, next) => {
  res.render('snippets/login')
 })

router.post('/create-account', async (req, res, next) => {
  const user = new User(req.body)
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  console.log(user)
  user.save()
})

router.post('/login', async (req, res) => {
  const body = req.body
  const user = await User.findOne({ username: body.username})
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password)
    if (validPassword) {
      res.render('snippets/test')
      // res.status(200).json({ message: 'Valid password' })
    } else {
      res.status(400).json({ error: 'Invalid Password' })
    }
  } else {
    res.status(401).json({ error: 'User does not exist' })
  }
})

router.post('/test', (req, res, next) => user.test(req, res, next))

router.get('/pre-logout', (req, res, next) => user.preLogout(req, res, next))

router.post('/logout', (req, res, next) => user.logout(req, res, next))
