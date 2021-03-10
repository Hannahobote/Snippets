// import moment from 'moment'
import moment from 'moment'
import { Snippets } from '../models/snippets.js'
const data1 = [
  {
    title: 'php',
    user: 'member1',
    id: 'linda',
    description: 'hello world, im member 1 ',
    snippet: `
    temp = $1
    $1 = $2
    $2 = temp
    `,
    done: false
  },
  {
    title: ' java ',
    user: 'member2',
    id: 'Hannah',
    description: 'im ´member 2',
    snippet: `
    temp = x
    x = y
    y = temp
    `,
    done: false
  }
]

/**
 *Hi.
 */
export class HomeController {
  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        snippet: (await Snippets.find({}))
          .map(snippet => ({
            id: snippet._id,
            title: snippet.title,
            description: snippet.description
          }))
      }
      console.log(viewData) // se whats in the database
      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param next
   */
  async createAccount (req, res, next) {
    res.render('snippets/create-account')
  }

  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param next
   */
  async login (req, res, next) {
    res.render('snippets/login')
  }

  /**
   * Returns a HTML form for creating a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async new (req, res) {
    const viewData = {
      description: '',
      done: false
    }
    res.render('snippets/new', { viewData })
  }

  /**
   * Creates a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async create (req, res) {
    try {
      const snippet = new Snippets({
        description: req.body.description,
        title: req.body.title
      })

      await snippet.save()

      req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
      res.redirect('.')
    } catch (error) {
    //  req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./new')
    }
  }

  /**
   * Renders a view, based on posted data, and send the rendered HTML as sting as an http response.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async indexPost (req, res) {
    const indexData = {
      name: req.body.name,
      title: req.body.title,
      description: req.body.description
      // dayName: moment().format('dddd')
    }
    console.log(indexData)
    res.render('snippets/index', { indexData })
  }

  /**
   * Returns a HTML form for editing a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async edit (req, res) {
    try {
      const snippet = await Snippets.findOne({ _id: req.params.id })
      const viewData = {
        id: snippet._id,
        description: snippet.description,
        done: snippet.title
      }
      res.render('snippets/edit', { viewData })
    } catch (error) {
      //  req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async update (req, res) {
    try {
      const result = await Snippets.updateOne({ _id: req.body.id }, {
        description: req.body.description,
        done: req.body.done === 'on'
      })

      if (result.nModified === 1) {
        req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'The snippet you attempted to update was removed by another user after you got the original values.'
        }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./edit')
    }
  }

  /**
   * Returns a HTML form for removing a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async remove (req, res) {
    try {
      const snippet = await Snippets.findOne({ _id: req.params.id })
      const viewData = {
        id: snippet._id,
        description: snippet.description,
        done: snippet.done
      }
      res.render('snippets/remove', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async delete (req, res) {
    try {
      await Snippets.deleteOne({ _id: req.body.id })

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }
}
