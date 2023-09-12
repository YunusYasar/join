let editedPriority = null;

let currentDraggedElement;

async function initBoard() {
  checkLogIn();
  await initTemplate('board');
  getCategory();
  await loadTasks();
  await loadContacts();
  renderToDoCard();
}
function startDragging(index) {
  currentDraggedElement = index;
}
function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(status) {
  tasks[currentDraggedElement]['status'] = status;
  renderToDoCard();
  await uploadTasks();
}

function startDragging(index) {
  currentDraggedElement = index;
}

async function uploadTasks() {
  await setItem('tasks', JSON.stringify(tasks));
}

async function changeStatusMobile(index, status, doWhat) {
  const availibleStatus = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
  const task = tasks[index];
  const currentStatusIndex = availibleStatus.indexOf(status);

  if (doWhat === 'previous' && currentStatusIndex > 0) {
    task.status = availibleStatus[currentStatusIndex - 1];
  }
  if (doWhat === 'next' && currentStatusIndex < availibleStatus.length - 1) {
    task.status = availibleStatus[currentStatusIndex + 1];
  }

  await uploadTasks();
  renderToDoCard();
}

function renderSubtaskProgressBar(task, index) {
  const container = document.getElementById(`subtask-box-progress-bar-${index}`);
  const subtasks = task.subtasks;

  if (subtasks && subtasks.length > 0) {
    const completedSubtasks = getCompletedSubtasks(subtasks);
    const subtaskPercent = getSubtaskPercent(subtasks, completedSubtasks);
    container.innerHTML = getProgressBarHTML(subtasks, subtaskPercent, completedSubtasks);
    container.classList.remove('d-none');
  } else {
    container.classList.add('d-none');
  }
}

function getCompletedSubtasks(subtasks) {
  if (subtasks) {
    let completedSubtasks = 0;

    subtasks.forEach(subtasks => {
      if (subtasks.status === 'closed') {
        completedSubtasks++;
      }
    });

    return completedSubtasks;
  }
}

function getCompletedSubtasks(subtasks) {
  let completedSubtasks = 0;
  subtasks.forEach(subtask => {
    if (subtask.status === 'closed') {
      completedSubtasks++;
    }
  });
  return completedSubtasks;
}

function getSubtaskPercent(subtasks, completedSubtasks) {
  if (subtasks) {
    const totalSubtasks = subtasks.length;
    const subtaskPercent = (completedSubtasks / totalSubtasks) * 100;

    return subtaskPercent;
  }
}

function getProgressBarHTML(subtasks, subtaskPercent, completedSubtasks) {
  return /*html*/ `
    <div class="progress-bar-box">
    <div style="width: ${subtaskPercent}%;" class="progress-bar-bar"></div>
    </div>
    <div class="subtask-text-box">
    <span>${completedSubtasks}/${subtasks.length}</span> 
    <span>Done</span>
    </div>
  `;
}

function renderToDoCard() {
  const statusArr = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];

  statusArr.forEach(status => {
    const card = document.getElementById(`${status}-area`);

    if (card) {
      card.innerHTML = '';
      tasks.forEach((task, index) => {
        if (task.status === status) {
          card.innerHTML += generateToDoHTML(task, index);
          renderSubtaskProgressBar(task, index);
        }
      });
    } else {
      console.error(`Element mit der ID '${status}-area' wurde nicht gefunden.`);
    }
  });
}

function openTask(index) {
  renderToDoModalCard(index);
  renderSubtasksOverlay(index);
  let parent = document.getElementById('openTaskModal');
  let child = document.getElementById('openTaskInModal');
  document.getElementById('editingShowTaskIndex').value = index;

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}

function renderToDoModalCard(index) {
  let toDoCardModal = document.getElementById('openTaskInModal');
  toDoCardModal.innerHTML = '';
  const task = tasks[index];
  toDoCardModal.innerHTML += generateToDoModalHTML(task, index);
}

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderSubtasksOverlay(taskIndex) {
  const container = document.getElementById('subtask-box-overlay');
  const subtaskBoxWrapper = document.getElementById('subtaskBoxWrapper');
  if (!tasks || !tasks[taskIndex] || !tasks[taskIndex].subtasks) {
    // Überprüfen, ob tasks und subtasks vorhanden sind
    console.error('Tasks or subtasks are not available.');
    return;
  }
  const subtasks = tasks[taskIndex].subtasks;
  if (subtasks.length > 0) {
    console.log('Found subtasks:', subtasks);
    subtaskBoxWrapper.classList.remove('d-none');
    container.innerHTML = ''; // Container leeren, um alte Subtasks zu entfernen
    subtasks.forEach((subtask, index) => {
      if (subtask.status === 'open') {
        container.innerHTML += getSubtaskOpenHTML(taskIndex, subtask, 'updateSubtaskInOverlay', index);
      } else {
        container.innerHTML += getSubtaskClosedHTML(taskIndex, subtask, 'updateSubtaskInOverlay', index);
      }
    });
  } else {
    console.log('No subtasks found.');
    subtaskBoxWrapper.classList.add('d-none');
  }
}

function renderSubtasksInOverlay(taskIndex, container) {
  const task = tasks[taskIndex];
  const subtasks = task.subtasks;

  if (subtasks.length > 0) {
    subtaskBoxWrapper.classList.remove('d-none');
    subtasks.forEach((subtask, index) => {
      if (subtask.status == 'open') {
        container.innerHTML += getSubtaskOpenHTML(taskIndex, subtask, 'updateSubtaskInOverlay', index);
      } else {
        container.innerHTML += getSubtaskClosedHTML(taskIndex, subtask, 'updateSubtaskInOverlay', index);
      }
    });
  }
}

function getSubtaskOpenHTML(taskIndex, subtask, functionName, index) {
  return /*html*/ `
    <label onchange="${functionName}(${taskIndex}, ${index})"><input id="overlayCheckbox${index}" type="checkbox"> ${subtask.name}</label>
  `;
}

function getSubtaskClosedHTML(taskIndex, subtask, functionName, index) {
  return /*html*/ `
    <label onchange="${functionName}(${taskIndex}, ${index})"><input id="overlayCheckbox${index}" checked  type="checkbox"> ${subtask.name}</label>
  `;
}

async function updateSubtaskInOverlay(taskIndex, subtaskIndex) {
  const checkbox = document.getElementById('overlayCheckbox' + subtaskIndex);
  const task = tasks[taskIndex];

  if (checkbox.checked) {
    task.subtasks[subtaskIndex].status = 'closed';
  } else {
    task.subtasks[subtaskIndex].status = 'open';
  }

  await uploadTasks();
  renderToDoCard();
}

async function deleteTask(index) {
  tasks.splice(index, 1);
  try {
    await setItem('tasks', JSON.stringify(tasks));
    console.log('Task erfolgreich gelöscht!');
  } catch (error) {
    console.error('Fehler beim Löschen des Tasks:', error);
  }

  let parent = document.getElementById('openTaskModal');
  let child = document.getElementById('openTaskInModal');
  parent.classList.remove('modal-bg-animation');
  child.classList.remove('modal-animation');
  renderToDoCard();
  showUserFeedbackMessage('Task successfully deleted');
}

// Hauptfunktion zum Speichern des bearbeiteten Tasks
function saveEditedTask(index) {
  updateTaskDetails(index);
  setItem('tasks', JSON.stringify(tasks))
    .then(() => {
      renderToDoCard();
      openTask(document.getElementById('editingShowTaskIndex').value);

      let parent = document.getElementById('editTaskModal'); // Das Modal schließen
      let child = document.getElementById('editTaskInModal');
      parent.classList.toggle('modal-bg-animation');
      child.classList.toggle('modal-animation');
    })
    .catch(err => {
      console.error('Error updating the task:', err);
    });
}

// Hilfsfunktion zum Aktualisieren der Taskdetails
function updateTaskDetails(index) {
  const editedTitle = document.getElementById('edit-title').value;
  const editedDescription = document.getElementById('edit-description').value;
  const editedDueDate = document.getElementById('edit-due-date').value;
  const EditedPriority = editedPriority;
  const editedContacts = getSelectedContacts();

  tasks[index].title = editedTitle;
  tasks[index].description = editedDescription;
  tasks[index].dueDate = editedDueDate;
  tasks[index].priority = EditedPriority;
  tasks[index].contacts = editedContacts;
  tasks[index].subtasks = currentSubtasks;
}

// Hauptfunktion zum Setzen der bearbeiteten Priorität
function setEditPrio(prioType) {
  const boxes = ['edit-urgent-prio-box', 'edit-medium-prio-box', 'edit-low-prio-box'];

  // Alle Priority-Boxen zurücksetzen
  resetPriorityBoxes(boxes);

  // Aktivieren der ausgewählten Priority-Box
  const currentBox = document.getElementById(`edit-${prioType}-prio-box`);
  currentBox.classList.add(prioType);
  const whiteIcon = currentBox.querySelector('.white-icon');
  whiteIcon.classList.remove('d-none');
  const coloredIcon = currentBox.querySelector(':nth-child(2)');
  coloredIcon.classList.add('d-none');

  // Speichern der bearbeiteten Priorität in einer neuen Variable
  editedPriority = prioType;
}

// Hilfsfunktion zum Zurücksetzen der Priority-Boxen
function resetPriorityBoxes(boxes) {
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });
}

function toggleDropdownEditContacts() {
  let contactsEditList = document.getElementById('dropdownContentEditContacts');
  if (contactsEditList.style.display === 'none' || contactsEditList.style.display === '') {
    contactsEditList.style.display = 'block';
  } else {
    contactsEditList.style.display = 'none';
  }
}

function editTaskModal(index) {
  let task = tasks[index];
  if (!task) {
    console.error('task not found at index', index);
    return;
  }
  currentSubtasks = [...task.subtasks];
  let parent = document.getElementById('editTaskModal');
  parent.innerHTML = editTaskModalHTML(task, index);
  renderAssignedContacts('dropdownContentEditContacts', task);
  renderSubtasks('subtask-edit-box', tasks[index]);
  let child = document.getElementById('editTaskInModal');

  document.getElementById('editingTaskIndex').value = index;

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
  setEditPrio(task.priority);
  openTask(document.getElementById('editingShowTaskIndex').value);
}

//////////////////////////////SEARCH

let foundTasks = [];

function searchTask() {
  const input = document.getElementById('search-task-input').value.toLowerCase();
  foundTasks = tasks.filter(task => task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input));
  renderFilteredTasks();
}

function renderFilteredTasks() {
  const statusArr = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
  statusArr.forEach(status => {
    const card = document.getElementById(`${status}-area`);
    if (card) {
      card.innerHTML = ''; // Lösche die aktuellen Karten
      foundTasks.forEach((task, index) => {
        if (task.status === status) {
          card.innerHTML += generateToDoHTML(task, index); // Füge die gefilterten Karten hinzu
        }
      });
    } else {
      console.error(`Element mit der ID '${status}-area' wurde nicht gefunden.`);
    }
  });
}
