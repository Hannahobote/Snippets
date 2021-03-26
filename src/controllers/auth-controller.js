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
        console.log('user is not authorized')
        const error = new Error('Not found')
        error.status = 404
        return next(error)
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
      let author = {
        tasks: (await Snippets.find({}))
          .map(task => ({
            id: task._id,
            description: task.description,
            author: task.author
          }))
      }
      author = author.tasks.filter(person => person.author === req.session.username)
      author = author.map(person => person.author)

      if (req.session.authenticated && req.session.username === author[0]) {
        console.log(req.session.username, author[0])
        console.log('user is can edit')
      } else {
        console.log(author[0])
        console.log('user cannot edit')
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
