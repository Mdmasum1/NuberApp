var mongoose = require('mongoose'); 

var driverSchema = new mongoose.Schema ({
  name: String,
  assignedRider: String,
  assignedRiderDestination: mongoose.Mixed,
  assignedRiderLocation: mongoose.Mixed,
  currentPosition: mongoose.Mixed,
  availability: String,
  rating: String
});

mongoose.model('driver', driverSchema);

module.exports = mongoose.model('driver');