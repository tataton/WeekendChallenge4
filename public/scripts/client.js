var todos = [];

$(document).ready(function(){
  refreshDisplay();
});

var refreshDisplay = function(){
  $.get('/todos/allTodos', function(responseObject){
    console.log('Employee AJAX GET success.', responseObject);
    todos = responseObject.toDoArray;
  }).done(displayToDos);
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
