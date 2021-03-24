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

/**
 * Auth func.
 *
 * @param {string} username user.
 * @param {string} password password.
 * @returns {object} user.
 */
userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt')
  }
  return user
}

export const User = mongoose.model('User', userSchema)
