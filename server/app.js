var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8000;

app.use(express.static('public'));

// Points to router for base URL:
var index = require('../routers/index');
app.use('/', index);
// Points to router for all database requests:
var todos = require('../routers/todos');
app.use('/todos', todos);

app.listen(port, function(){
  console.log('Server up on port ' + port + '.');
});
