var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8000;

app.use(express.static('public'));

var index = require('../routers/index');
app.use('/', index);

app.listen(port, function(){
  console.log('Server up on port ' + port + '.');
});
