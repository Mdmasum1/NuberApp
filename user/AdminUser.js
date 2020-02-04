var mongoose = require('mongoose'); 

var adminSchema = new mongoose.Schema({
  name: String
});

mongoose.model('admin', adminSchema);

module.exports = mongoose.model('admin');