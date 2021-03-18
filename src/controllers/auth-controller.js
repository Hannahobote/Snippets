import { UserController } from '../controllers/user-controller.js'
/**
 * Authenticate and authorasation class.
 */
export class AuthController {
/**
 * Authorize.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} next.
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

  }

  /**
   * Authorize.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async test (req, res, next) {
    const user = new UserController()
  }
}
