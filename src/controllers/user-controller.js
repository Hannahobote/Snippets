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
      // Hash and salt the password.
      await bcrypt.hash(req.body.password, 10).then(function (hash) {
        // Create a new user.
        const user = new User({
          username: req.body.username,
          password: hash
        })
        // save user to database.
        user.save()
        console.log('from create function', user)
      })
      res.render('snippets/create-account')
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
      const user = await User.findOne({ username: req.body.username })
      // const hashedPassword = await bcrypt.hash(req.body.password, 10
      if (user) {
        // const validPassword = await bcrypt.compare(req.body.password, user.password)
        console.log('password is correct')
      } else {
        console.log('not in db')
      }
      res.render('snippets/login')
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
      console.log(req.session.username)
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
