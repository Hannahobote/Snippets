import moment from 'moment'
import { Snippets } from '../models/snippets.js'
const data = [
  {
    title: 'php',
    user: 'member1',
    id: 1,
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
    id: 2,
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
   *Displays a list of Snippets.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        snippets: await Snippets.find({})
          .map(snippets => ({
            id: snippets._id,
            createdAt: moment(snippets.createdAt).fromNow(),
            value: snippets.value
          }))
      }
      // res.render('home/index', { dummyData })
      res.render('home/index', { data })
      console.log('from index function:', viewData, await Snippets())
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Returns a HTML form for creating a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   */
  async new (req, res) {
    try {
      res.render('home/new')
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Creates a snippet.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async create (req, res, next) {
    try {
      // create a snippet
      const snippet = new Snippets({
        value: req.body.value
      })

      // save to database
      await snippet.save()

      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'The pure number was saved successfully.' }
      res.redirect('.')
      res.render('home/index', { snippet })
    } catch (error) {
      res.render('home/new', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value
      })
    }
  }

  /**
   * Renders a view, based on posted data, and send the rendered HTML as sting as an http response.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async indexPost (req, res, next) {
    const viewData = {
      name: req.body.name,
      dayName: moment().format('dddd')
    }
    res.render('home/index', { viewData })
  }

  /**
   * Renders a view, based on posted data, and send the rendered HTML as sting as an http response.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async edit (req, res, next) {
    try {
      const snippet = await Snippets.findById(req.params.id)
      const { _id: id, title, description } = snippet
      const data = { id, title, description }
      return data
      /* const snippet = new Snippets({
        description: req.body.description,
        done: req.body.done
      })
      await snippet.save() */
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Renders a view, based on posted data, and send the rendered HTML as sting as an http response.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async update (req, res, next) {
    try {
      const result = await Snippets.updateOne({ _id: res.body.id }, {
        description: res.bdy.description,
        done: res.body.done === 'on'
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Renders a view, based on posted data, and send the rendered HTML as sting as an http response.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async remove (req, res, next) {
    try {
      const snippet = new Snippets({
        description: req.body.description,
        done: req.body.done
      })
      await snippet.save()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Renders a view, based on posted data, and send the rendered HTML as sting as an http response.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async delete (req, res, next) {
    try {
      await Snippets.deleteOne({ _id: res.body.id })
      req.session.flash = {
        type: 'success', text: 'The sbippet has been deleted'
      }
      res.redirect('..')
    } catch (error) {
      console.log(error)
    }
  }
}
