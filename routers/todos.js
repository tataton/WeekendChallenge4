var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:true});

var connectionString = 'postgres://localhost:5432/to_do_database';

router.get('/allTodos', function(req, res){
  // Route for GET requests.
  var allTodos = [];
  console.log('In GETallTodos.');
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database from GETallTodos.');
      // PostgresSQL query: Get the whole table.
      var query = client.query('SELECT * FROM todos');
      query.on('row', function(row){
        allTodos.push(row);
      });
      query.on('end', function(){
        done();               // Close postgres connection.
        console.log(allTodos);
        res.status(200).send({toDoArray: allTodos});
      });
    }
  });
});

router.post('/addToDo', urlEncodedParser, function(req, res){
  // Route for POST requests.
  console.log('In addToDo. To-Do to add: ', req.body);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database from addToDo.');
      // PostgresSQL query: Add new task.
      client.query('INSERT INTO todos (task) VALUES ($1);', [req.body.task]);
      done();               // Close postgres connection.
      res.sendStatus(201);  // Close AJAX.
    }
  });
});

router.put('/completeToDo', urlEncodedParser, function(req, res){
  console.log('In completeToDo. To-Do to complete: ', req.body);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database from completeToDo.');
      // PostgresSQL query: Set "complete" flag to true.
      client.query('UPDATE todos SET complete=true WHERE id=$1;', [req.body.id]);
      done();               // Close postgres connection.
      res.sendStatus(200);  // Close AJAX.
    }
  });
});

router.delete('/deleteToDo', urlEncodedParser, function(req, res){
  console.log('In deleteToDo. To-Do to delete: ', req.body);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to database from deleteToDo.');
      // PostgresSQL query: Delete task.
      client.query('DELETE FROM todos WHERE id=$1;', [req.body.id]);
      done();               // Close postgres connection.
      res.sendStatus(200);  // Close AJAX.
    }
  });
});

module.exports = router;
