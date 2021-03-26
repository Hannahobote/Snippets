import { User } from '../models/user.js'
import { Snippets } from '../models/snippets.js'

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
      if (!req.session.authenticated) {
        console.log('user must be logged in')
        const error = new Error('Not found. User must be logged in')
        error.status = 404
        error.message = 'Page not found.'
      }
      next()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * User can edit,delete.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Function} next.
   */
  async userPremission (req, res, next) {
    try {
      // get the current snippet
      let snippet = await Snippets.findOne({ _id: req.params.id })
      // rename to the snippets author
      snippet = snippet.author
      if (req.session.authenticated && req.session.username === snippet) {
        console.log(req.session.username, snippet)
        console.log('user can edit/delete')
      } else {
        console.log(req.session.username, snippet)
        console.log('user cannot edit/delete')
        const error = new Error('Not found')
        error.status = 404
        return next(error)
      }
      next()
    } catch (error) {
      console.log(error)
    }
  }
}
