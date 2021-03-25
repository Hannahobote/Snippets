import bcrypt from 'bcrypt'
import { User } from '../models/user.js'
/**
 * Authenticate and authorasation class.
 */
export class AuthController {
/**
 * Authorize: give certain access to user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} next.
 */
  async authorize (req, res, next) {
    try {
      const user = await User.findOne({ username: req.session.username })
      console.log(req.session, user)
      if (!req.session.authenticated) {
        console.log('user is not authorized')
        const error = new Error('Not found')
        error.status = 404
        error.message = 'User must be logged in to create snippet'
        return next(error)
      } else {
        console.log('user is authorized')
      }
      next()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Authenticate user: check if email and passowrd is correct.
   *
   * @param {*} req req.
   * @param {*} res res.
   * @param {*} next func.
   * @returns {object} user
   */
  async authenticate (req, res, next) {
    const user = await User.findOne({ username: req.body.username })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error('Invalid login attempt')
    }

    req.session.regenerate(() => {
      req.session.authenticated = true
      req.session.username = user.username
      req.session.userId = user._id
      res.redirect('./')
    })
    return user
  }
}
