import moment from 'moment'
import { Snippets } from '../models/snippets.js'

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
            description: snippet.description,
            author: snippet.author
          }))
      }
      // console.log(viewData) // se whats in the database
      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
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
    console.log('from create function', req.session.username)
    try {
      const snippet = new Snippets({
        description: req.body.description,
        title: req.body.title,
        author: req.session.username
      })
      await snippet.save()
      req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
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
    const viewData = {
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      dayName: moment().format('dddd')
    }
    console.log(viewData)
    res.render('snippets/index', { viewData })
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
        title: snippet.title
      }
      res.render('snippets/edit', { viewData })
    } catch (error) {
      console.log(error)
      req.session.flash = { type: 'danger', text: error.message }
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
        console.log('The snippet was updated successfully')
      } /* else {
        req.session.flash = { type: 'danger', text: 'Failed to update snippet' }
      } */
      res.redirect('..')
    } catch (error) {
      console.log('there was an error')
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
      console.log('something went wrong')
      console.log(error)
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await Snippets.deleteOne({ _id: req.params.id })
      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
      console.log(req.params.id, 'snippet has been removed')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }
}
