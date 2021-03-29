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
      res.render('snippets/index')
      req.session.flash = { type: 'success', text: 'Account has been created' }
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
          req.session.regenerate(() => {
            req.session.authenticated = true
            req.session.username = user.username
            req.session.userId = user._id
            req.session.flash = { type: 'success', text: 'Login successful.' }
            res.redirect('.')
          })
        } else {
          // throw new Error('Error 403 Wrong username or password')
          const error = new Error('Not found. User must be logged in')
          error.status = 401
          error.message = 'Page not found.'
          return next(error)
        }
      } else {
        throw new Error('Error 403 User does not exist')
      }
    } catch (error) {
      error.status = 403
      next(error)
      console.log(error)
    }
  }

  /**
   * Authenticate user: check if email and passowrd is correct.
   *
   * @param {*} req req.
   * @param {*} res res.
   * @param {*} next func.
   */
  /* async login2 (req, res, next) {
    const { username, password } = req.body
    try {
      const user = User.authenticate(username, password)
      req.session.regenerate(() => {
        req.session.authenticated = true
        req.session.username = user.username
        req.session.userId = user._id
        req.session.flash = { type: 'success', text: 'Login successful.' }
        res.redirect('./login-form')
      })
    } catch (error) {
      const validationErrors = ['Invalid username/password.']
      res.render('./', {
        validationErrors,
        data: { username: username }
      })
      console.log(error)
    }
  } */

  /**
   *Pre logout.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware.
   */
  async preLogout (req, res, next) {
    /* const viewData = {
      users: (await User.find({}))
        .map(user => ({
          id: user._id,
          username: user.username,
          password: user.password
        }))
    } */
    // console.log(viewData) // se whats in the database
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
