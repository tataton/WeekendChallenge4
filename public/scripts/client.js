/* Client-side to-do list manager interface. Some key features:

I've started to use Promises, and specifically jQuery .Deferreds, to
manage code dependent on asynchronous AJAX calls, rather than placing the
code within the success block of the AJAX call. This approach has been
advised by pretty much every Stack Overflow thread and developer blog I've
read as a means of improving modularity. But it does require a little more
attention to how the Promise is declared; I've found that sometimes I will
accidentally write the code so that I re-use the same Promise after it's
already been resolved, which leads to further AJAX calls not being called
(because the program thinks they have already been called). I think the way
to do this the right way is

var newPromise = $.ajax(whatevah);              // Creates a new Promise;
$.when(newPromise).done(whatComesAfter);        // When the action is done,
                                                   do whatComesAfter.

This way, the new Promise is created in a new variable declaration, which
binds it to its local scope and prevents it from being re-used. I am still
learning about these though, and if I screwed it up, I'm definitely looking
for input. So far they seem to work.

I have also started to use $.get and $.post in place of $.ajax for those
two HTTP methods for simplicity. Oddly, there is no $.put or $.delete in
jQuery, so I'm still using $.ajax for those. */

var todos = [];

$(document).ready(function(){
  refreshDisplay();
});

$(document).on('click', '#addTaskButton', function(){
  var newTaskObject = {task: $('#addTaskInput').val()};
  var addToDo = $.post('/todos/addToDo', newTaskObject);
  $.when(addToDo).done(refreshDisplay);
});

$(document).on('click', '.delete-task', function(){
  var toDeleteID = $(this).data('id');
  var deleteTask = $.ajax('/todos/deleteToDo', {
    data: {id: toDeleteID},
    method: 'DELETE'
  });
  $.when(deleteTask).done(refreshDisplay);
});

$(document).on('click', '.complete-task', function(){
  var toCompleteID = $(this).data('id');
  var completeTask = $.ajax('/todos/completeToDo', {
    data: {id: toCompleteID},
    method: 'PUT'
  });
  $.when(completeTask).done(refreshDisplay);
});

var refreshDisplay = function(){
  var getTodos = $.get('/todos/allTodos', function(responseObject){
    todos = responseObject.toDoArray;
  });
  $.when(getTodos).done(displayToDos);
};

var displayToDos = function(){
  var tableText = '<tr class="header-row"><th class="complete-column"></th><th class="delete-column"></th><th class="taskname-column">Task</th></tr>';
  var completedText = '';
  for (var i = (todos.length - 1); i >= 0; i--) {
    if (todos[i].complete) {
      completedText += '<tr class="completed-row"><td></td><td><button type="button" class="delete-task" data-id="' + todos[i].id + '">delete</button></td><td>' + todos[i].task + '</td></tr>';
    } else {
      tableText += '<tr class="incomplete-row"><td><button type="button" class="complete-task" data-id="' + todos[i].id + '">complete</button></td><td><button type="button" class="delete-task" data-id="' + todos[i].id + '">delete</button></td><td>' + todos[i].task + '</td></tr>';
    }
  }
  $('#taskTable').html(tableText + completedText);
};
