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
      const userDuplicate = await User.findOne({ username: req.body.username }) === undefined ? 'unique' : req.body.username
      console.log(req.body.username, userDuplicate)
      if (req.body.username === userDuplicate.username) {
        console.log('cannot use the same email twice')
        const error = new Error()
        error.status = 404
        return next(error)
      } else {
        const user = new User(req.body)
        console.log(user, userDuplicate)
        user.save()
        req.session.flash = { type: 'success', text: 'Account has been created' }
      }
      res.render('snippets/login')
    } catch (error) {
      res.render('snippets/login')
      req.session.flash = { type: 'danger', text: error.message }
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
          // error.message = 'Page not found.'
          return next(error)
        }
      } else {
        console.log('User does not exist')
        const error = new Error()
        error.status = 404
        return next(error)
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
    const isLoggedin = { auth: req.session.authenticated }
    // console.log(viewData) // se whats in the database
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
