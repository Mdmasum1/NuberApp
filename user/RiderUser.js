var mongoose = require('mongoose'); 

var riderSchema = new mongoose.Schema ({
  name: String,
  currentDriver: String,
  destination: mongoose.Mixed,
  location: mongoose.Mixed
});

mongoose.model('rider', riderSchema);

module.exports = mongoose.model('rider');