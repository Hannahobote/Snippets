import express from 'express'
import { HomeController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new HomeController()

router.get('/', controller.index)
// router.post('/', controller.indexPost)

router.get('/login', controller.login)

router.get('/create-account', controller.createAccount)

router.get('/remove', controller.remove)
