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

$(document).ready(function(){
  refreshDisplay();
});

$(document).on('click', '#addTaskButton', function(){
  /* Event handler for "Add Task" button. Performs an AJAX POST to send
  new task to database, and then refreshes to-do list on the DOM. */
  var newTaskObject = {task: $('#addTaskInput').val()};
  var addToDo = $.post('/todos/addToDo', newTaskObject);
  $.when(addToDo).done(refreshDisplay);
});

$(document).on('click', '.delete-task', function(){
  /* Event handler for any "Delete" button. Database id of task is stored
  in the button's data-id attribute. This gets that data, performs an AJAX
  DELETE to remove the to-do from the database, and then refreshes to-do list
  on the DOM. */
  var toDeleteID = $(this).data('id');
  var deleteTask = $.ajax('/todos/deleteToDo', {
    data: {id: toDeleteID},
    method: 'DELETE'
  });
  $.when(deleteTask).done(refreshDisplay);
});

$(document).on('click', '.complete-task', function(){
  /* Event handler for any "Complete" button. Database id of task is stored
  in the button's data-id attribute. This gets that data, performs an AJAX
  PUT to switch the complete boolean from false to true in the database, and
  then refreshes to-do list on the DOM. */
  var toCompleteID = $(this).data('id');
  var completeTask = $.ajax('/todos/completeToDo', {
    data: {id: toCompleteID},
    method: 'PUT'
  });
  $.when(completeTask).done(refreshDisplay);
});

var refreshDisplay = function(){
  /* Refreshes to-do list on DOM; called on document.ready, and then again
  after any database modification.
  Chaining $.ajax with .Deferred methods (such as .done and .then) will
  pipe the response of the AJAX call to the next function. So my $.get call
  is super simple, and I don't need to declare arguments in the .done
  statement (even though the callback displayToDos has one argument). This
  actually also allowed be to eliminate the global to-do-array variable
  I expected to need; this is the only place I need the whole array.*/
  var getTodos = $.get('/todos/allTodos');
  $.when(getTodos).done(displayToDos);
};

var displayToDos = function(responseOfGet){
  /* Generates HTML table from result of AJAX GET. Two parallel lists are
  generated for separate formatting: a list of completed to-dos, and a
  list of incomplete to-dos. In the HTML table, the incomplete to-dos
  are listed before the complete ones, in reverse-chronological order
  (from the time the to-do is created). */
  var todos = responseOfGet.toDoArray;
  // Header row:
  var tableText = '<tr class="header-row"><th class="complete-column"></th><th class="delete-column"></th><th class="taskname-column">Task</th></tr>';
  var completedText = '';
  // For loop steps backwards to do reverse chronology.
  for (var i = (todos.length - 1); i >= 0; i--) {
    if (todos[i].complete) {
      // If task is already completed, it's added to the list of completed tasks.
      completedText += '<tr class="completed-row"><td></td><td><button type="button" class="delete-task" data-id="' + todos[i].id + '">delete</button></td><td>' + todos[i].task + '</td></tr>';
    } else {
      // Otherwise, the task is incomplete, and added to the other list.
      tableText += '<tr class="incomplete-row"><td><button type="button" class="complete-task" data-id="' + todos[i].id + '">complete</button></td><td><button type="button" class="delete-task" data-id="' + todos[i].id + '">delete</button></td><td>' + todos[i].task + '</td></tr>';
    }
  }
  // And then the lists are concatenated and put on the DOM.
  $('#taskTable').html(tableText + completedText);
};
