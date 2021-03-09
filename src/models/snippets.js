import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export const SnippetsSchema = new mongoose.Schema({
  description: {
    title: String,
    id: uuidv4(),
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
