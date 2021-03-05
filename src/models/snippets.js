import mongoose from 'mongoose'

export const SnippetsSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  done: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

export const Snippets = mongoose.model('Snippets', SnippetsSchema)
