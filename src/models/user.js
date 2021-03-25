import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
    
  },
  password: {
    type: String,
    minlength: [10, 'the password must be of a minimun length 10 characters'],
    maxlength: 100,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

// salts and hashes the passoword
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/* userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt')
  }
  return user
} *

/* accountController.loginPost = async (req, res, next) => {
  try {
    const user = User.authenticate(req.body.username, req.body.password)
    req.session.regenerate(() => {
      req.session.authenticated = true
      req.session.username = user.username
      req.session.userId = user._id
      res.redirect('./')
    })
  } catch (error) {
    console.log(error)
  }
} */
export const User = mongoose.model('User', userSchema)
