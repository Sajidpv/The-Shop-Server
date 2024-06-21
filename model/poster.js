import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const posterSchema = new Schema({
  posterName: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true 
});

const Poster = model('Poster', posterSchema);

export default Poster;
