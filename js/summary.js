/**
 * Asynchronously loads the summary content for the dashboard.
 */
async function loadSummary() {
  checkLogIn();
  greetingSummary();
  loadTasksForSummary();
  loadSummaryContent();
}


/**
 * Sets up the greeting message based on the current time.
 */
function greetingSummary() {
  setTimeout(createGreetingPhrase, 300);
   setTimeout(createNameGreating,150);
  fadeGreeting();
}


/**
 * Creates a greeting phrase based on the current time of day.
 */
function createGreetingPhrase() {
  let timeNow = new Date().getHours();
  let greeting;
  if (5 < timeNow && timeNow < 12) {
    greeting = 'Good morning';
  } else if (12 <= timeNow && timeNow < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }
  document.getElementById('summary_container_bottom_right_greeting').innerHTML = /*html*/ `
        ${greeting}
    `;
}


/**
 * Asynchronously creates a greeting with the user's name.
 */
async function createNameGreating() {
  await loadUsers();
  if (currentUser == 'Gast') {
    return;
  } else {
    document.getElementById('summary_container_bottom_right_Name').innerHTML = /*html*/ `
        ${currentUser}
    `;
  }
}


/**
 * Fades out the greeting after a certain duration.
 */
function fadeGreeting() {
  if (window.innerWidth < 1200) {
    setTimeout(function () {
      var container = document.getElementById('summary_container_bottom_right');
      var fadeDuration = 1000;
      var fadeInterval = 10;
      var opacity = 1;
      var deltaOpacity = 1 / (fadeDuration / fadeInterval);
      var fadeOut = setInterval(function () {
        opacity -= deltaOpacity;
        container.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeOut);
          container.style.display = 'none';
        }
      }, fadeInterval);
    }, 1000);
  }
}


/**
 * Navigates to the board page.
 */
function openBoard() {
  window.location.href = 'board.html';
}

/////////////////////


/**
 * Asynchronously loads the list of tasks for the summary page.
 */
async function loadTasksForSummary() {
  tasks = JSON.parse(await getItem('tasks'));
  loadSummaryContent();
}


/**
 * Populates the summary page with content based on the loaded tasks.
 */
function loadSummaryContent() {
  if (tasks.length > 0) {
    tasksInBoard();
    inProgressTasks();
    awaitingFeedbackTasks();
    urgentTasks();
    getDeadline();
    toDoTasks();
    doneTasks();
  }
}


/**
 * Displays the total number of tasks on the board.
 */
function tasksInBoard() {
  document.getElementById('in-board').innerHTML = '';
  document.getElementById('in-board').innerHTML = `
          ${tasks.length}
      `;
}


/**
 * Displays the number of tasks that are in progress.
 */
function inProgressTasks() {
  let inProgress = tasks.filter(t => t['status'] == 'inProgress');
  document.getElementById('in-progress').innerHTML = '';
  document.getElementById('in-progress').innerHTML += `
          ${inProgress.length}
      `;
}


/**
 * Displays the number of tasks that are awaiting feedback.
 */
function awaitingFeedbackTasks() {
  let awaitingFeedback = tasks.filter(t => t['status'] == 'awaitingFeedback');
  document.getElementById('awaiting-feedback').innerHTML = '';
  document.getElementById('awaiting-feedback').innerHTML += `
          ${awaitingFeedback.length}
      `;
}


/**
 * Displays the number of tasks that are marked as urgent.
 */
function urgentTasks() {
  let urgent = tasks.filter(t => t['priority'] == 'urgent');
  document.getElementById('urgent-tasks').innerHTML = '';
  document.getElementById('urgent-tasks').innerHTML += `
          ${urgent.length}
      `;
}


/**
 * Determines and displays the nearest upcoming task deadline.
 */
function getDeadline() {
  document.getElementById('upcoming-deadline').innerHTML = '';
  let earliestDate = tasks[0].dueDate;
  for (let i = 1; i < tasks.length; i++) {
    if (tasks[i].dueDate < earliestDate) {
      earliestDate = tasks[i].dueDate;
    }
  }
  document.getElementById('upcoming-deadline').innerHTML += `
          ${earliestDate}
    `;
}


/**
 * Displays the number of tasks that are to-do.
 */
function toDoTasks() {
  let toDo = tasks.filter(t => t['status'] == 'toDo');
  document.getElementById('to-do').innerHTML = '';
  document.getElementById('to-do').innerHTML += `
          ${toDo.length}
      `;
}


/**
 * Displays the number of tasks that are done.
 */
function doneTasks() {
  let done = tasks.filter(t => t['status'] == 'done');
  document.getElementById('done').innerHTML = '';
  document.getElementById('done').innerHTML += `
          ${done.length}
      `;
}