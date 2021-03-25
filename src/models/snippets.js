import mongoose from 'mongoose'

export const SnippetsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  done: {
    type: Boolean,
    required: false
  },
  author: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export const Snippets = mongoose.model('Snippets', SnippetsSchema)
