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
   * @returns {Function} error.
   */
  async createAccount (req, res, next) {
    try {
      const userDuplicate = await User.findOne({ username: req.body.username })
      const checkUser = userDuplicate === null ? false : userDuplicate
      if (req.body.username === checkUser.username) {
        //  console.log(req.body.username, userDuplicate.username)
        console.log('cannot use the same email twice')
        req.session.flash = { type: 'danger', text: 'Cannot use the same email twice' }
        res.redirect('./create-account')
      }
      if (req.body.password > 10) {
        console.log('password is too short')
        req.session.flash = { type: 'danger', text: 'Password must be atleast 10 characters' }
        res.redirect('./create-account')
      }

      const user = new User(req.body)
      // console.log(user)
      user.save()
      req.session.flash = { type: 'success', text: 'Account has been created. Log in to use account' }
      res.redirect('..')
    } catch (error) {
      console.log(error)
    }
  }

  /**
   *Authenticate User.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   * @returns {Function} error.
   */
  async login (req, res, next) {
    try {
      // find user in database
      const user = await User.findOne({ username: req.body.username })
      // if database can find user
      if (user) {
        // compare password in db
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        // if the password is valid
        if (validPassword) {
          console.log(user)
          req.session.regenerate(() => {
            req.session.authenticated = true
            req.session.username = user.username
            req.session.userId = user._id
            req.session.flash = { type: 'success', text: 'Login successful.' }
            res.redirect('.')
          })
        } else {
          console.log('wrong username/pasword')
          const error = new Error()
          error.status = 401
          return next(error)
        }
      } else {
        // console.log('User does not exist')
        // const error = new Error()
        // error.status = 404
        req.session.flash = { type: 'danger', text: 'User does not exist' }
        res.redirect('.')
        // return next(error)
      }
    } catch (error) {
      error.status = 403
      next(error)
      console.log(error)
    }
  }

  /**
   *Pre logout: pressents a button to log out.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   */
  async preLogout (req, res, next) {
    const isLoggedin = { auth: req.session.authenticated }
    res.render('snippets/pre-logout', { isLoggedin })
  }

  /**
   *Logout.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   * @returns {Function} error.
   */
  logout (req, res, next) {
    try {
      // if user tries to log out, but is not logged in to begin with
      if (!req.session.username) {
        const error = new Error('Not found. User must be logged in')
        error.status = 404
        error.message = 'Page not found.'
        return next(error)
      }
      // if user tires to log out, when logged in.
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
