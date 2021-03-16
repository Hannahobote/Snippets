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
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.pre('save', async () => {
  this.password = await bcrypt.hash(this.password, 8)
})

export const User = mongoose.model('User', userSchema)
