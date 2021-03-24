import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
/**
 * Authenticate and authorasation class.
 *
 */
export class UserController {
  /**
   *Create account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   */
  async createAccount (req, res, next) {
    try {
      const user = new User(req.body)
      console.log(user)
      user.save()
      res.render('snippets/test')
    } catch (error) {
      console.log(error)
    }
  }

  /**
   *Post req to get passowrd.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   */
  async login (req, res, next) {
    try {
      // find user in database
      const body = req.body
      const user = await User.findOne({ username: body.username })
      if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(body.password, user.password)
        if (validPassword) {
          // render view that informs that the user is logged in
          res.render('snippets/test')
          console.log('valid password', { username: user.username, hash: user.password })
        } else {
          res.status(400).json({ error: 'Invalid Password' })
        }
      } else {
        res.status(401).json({ error: 'User does not exist' })
      }
    } catch (error) {
      res.status(500).send()
      console.log(error)
    }
  }

  /**
   *Pre logout.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   */
  preLogout (req, res, next) {
    res.render('snippets/pre-logout')
  }

  /**
   *Logout.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   */
  logout (req, res, next) {
    try {
      console.log(req.sessionID)
      delete req.session.user
      if (!req.session.user) {
        req.session.flash = { type: 'success', text: 'Logout successful.' }
        console.log('user logged out', req.session.username)
        res.redirect('..')
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Redirect to login.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async test (req, res, next) {
    const user = { user: req.body.username, password: req.body.password }
    console.log(user, req.body)
    res.render('snippets/test')
  }
}
