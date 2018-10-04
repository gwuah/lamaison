const mongoose = require('mongoose');
// const {omit} = require('lodash');
const Schema = mongoose.Schema;

const housingSchema = new Schema({
  location: {
    type: String, 
    required: true, 
    trim: true, 
    lowercase:true
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true 
  },
  telephone: { 
    type: String, 
    required: true, 
    unique: true },
  geo: {
    longitude: Number,
    latitude: Number
  },
  images: [String],
  owner: {
    type: Schema.Types.ObjectId, 
    ref: 'Owner', 
    required: true
  },
  averageCost: Number,
}, {timestamps: true});

const Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;