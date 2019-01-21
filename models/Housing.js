const mongoose = require('mongoose');
// const {omit} = require('lodash');
const Schema = mongoose.Schema;

const housingSchema = new Schema({
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: true
    }],
    address: {
      type: String,
      required: true
    }
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true 
  },
  images: [String],
  owner: {
    type: Schema.Types.ObjectId, 
    ref: 'Owner', 
    required: true
  },
  averageCost: Number,
  about: String
}, {timestamps: true});

const Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;