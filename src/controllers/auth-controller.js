import moment from 'moment'
import { User } from '../models/user.js'
/**
 * Authenticate and authorasation class.
 */
class AuthController {
/**
 * Authorize.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async authorize (req, res, next) {
    try {
      if (!req.session.authenticated) {
        const error = new Error('Not found')
        error.status = 404
        error.message = 'Page not found.'
        return next(error)
      }
      next()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Login post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginPost (req, res, next) {
    try {
      const user = await User.authenticate(username, password)
      req.session.regenerate(() => {
        req.session.authenticated = true
        req.session.username = username
        req.session.userId = user._id
        res.redirect('./')
      })
    } catch (error) {
      console.log(error)
    }
  }
}
