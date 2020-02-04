// server.js
var app = require('./app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
    console.log('Express server listen on port ' + port);
});

app.get('/', function (reg, res) {
	res.send('hello world!');
});	