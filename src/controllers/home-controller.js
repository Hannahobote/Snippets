import moment from 'moment'
import { Snippets } from '../models/snippets.js'
/**
 *Hi.
 */
export class HomeController {
  /**
   * Renders a view and sends the rendered HTML sting as an http resone.
   * index GET.
   * READ.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async index (req, res, next) {
    try {
     const viewData = {
        snippets: (await Snippets.find({}))
          .map(snippets => ({
            id: snippets._id,
            description: snippets.description,
            done: snippets.done
          }))
      }
     res.render('home/index', { viewData })
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
  async create (req, res, next) {
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
  async new (req, res, next) {
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
  async edit (req, res, next) {
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
