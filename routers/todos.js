var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:true});

var connectionString = 'postgres://localhost:5432/to_do_database';

router.get('/allTodos', function(req, res){
  var allTodos = [];
  console.log('In GETallTodos.');
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database from GETallTodos.');
      var query = client.query('SELECT * FROM todos');
      query.on('row', function(row){
        allTodos.push(row);
      }); // end query
      query.on('end', function(){
        done();
        console.log(allTodos);
        //send a response
        res.send({toDoArray: allTodos});
      });
    }
  });
});

router.post('/addToDo', urlEncodedParser, function(req, res){
  console.log('In addToDo. To-Do to add: ', req.body);
  //connect to db
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database from addToDo.');
      client.query('INSERT INTO todos (task) VALUES ($1);', [req.body.task]);
      done();
      res.send({response: 'addToDo Complete.'});
    }
  });
});


module.exports = router;
