import moment from 'moment'
/**
 *Hi.
 */
export class HomeController {
  /**
   * Hi.
   */
  constructor () {
    this.hello = 'hello world'
  }

  /**
   * Renders a view and sends the rendered HTML sting as an http resone.
   * index GET.
   *
   * @param {object} req - Express request obj.
   * @param {object} res - Express response obj.
   * @param {Function} next - Express next middlewere function.
   */
  async index (req, res, next) {
    res.render('home/index')
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
}
