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
      const user = await User.findOne({ username: req.body.username })
      // if database can find user
      if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        // if the password is valid
        if (validPassword) {
          req.session.regenerate(() => {
            // informs that user is logged in
            req.session.authenticated = true
            req.session.username = user.username
            req.session.userId = user._id
            req.session.flash = { type: 'success', text: 'Login successful.' }
            res.redirect('.')
            console.log(req.session)
          })
        } else {
          req.session.flash = { type: 'danger', text: 'Username or password is incorrect.' }
          throw new Error('Error 403 Wrong Login')
        }
      } else {
        req.session.flash = { type: 'danger', text: 'User does not exist.' }
        throw new Error('Error 403 User does not exist')
      }
    } catch (error) {
      error.status = 403
      next(error)
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
      delete req.session.username
      if (!req.session.username) {
        // informs that user is not logged in
        req.session.authenticated = false
        req.session.userId = null
        req.session.flash = { type: 'success', text: 'Logout successful.' }
        console.log(req.session)
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
