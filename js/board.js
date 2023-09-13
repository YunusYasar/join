/**
 * Represents the edited priority for a task.
 * @type {string|null}
 */
let editedPriority = null;

/**
 * Represents the currently dragged element (typically used in drag-and-drop operations).
 * @type {HTMLElement|null}
 */
let currentDraggedElement;

/**
 * Initialize the board by loading required templates, categories, tasks, and contacts. Then renders the To-Do cards.
 */
async function initBoard() {
  await initTemplate('board');
  getCategory();
  await loadTasks();
  await loadContacts();
  renderToDoCard();
}

/**
 * Sets the current dragging element's index.
 * @param {number} index - The index of the task being dragged.
 */
function startDragging(index) {
  currentDraggedElement = index;
}

/**
 * Prevents the default behavior during a dragover event to allow for dropping.
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Updates the status of the currently dragged task and re-renders the task cards.
 * @param {string} status - The status to which the task should be moved.
 */
async function moveTo(status) {
  tasks[currentDraggedElement]['status'] = status;
  renderToDoCard();
  await uploadTasks();
}

/**
 * Uploads the current tasks to storage.
 */
async function uploadTasks() {
  await setItem('tasks', JSON.stringify(tasks));
}

/**
 * Updates the status of a task on mobile, based on given direction (previous or next).
 * @param {number} index - The index of the task to update.
 * @param {string} status - The current status of the task.
 * @param {string} doWhat - Direction to move the task status (either 'previous' or 'next').
 */
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

/**
 * Renders the progress bar for a task's subtasks.
 * @param {Object} task - The task containing the subtasks.
 * @param {number} index - The index of the task for which to render the progress bar.
 */
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

/**
 * Calculates and returns the percentage of completed subtasks.
 * @param {Array} subtasks - The list of subtasks.
 * @param {number} completedSubtasks - The count of completed subtasks.
 * @returns {number} The percentage of completed subtasks.
 */
function getCompletedSubtasks(subtasks) {
  let completedSubtasks = 0;
  subtasks.forEach(subtask => {
    if (subtask.status === 'closed') {
      completedSubtasks++;
    }
  });
  return completedSubtasks;
}

/**
 * Calculates and returns the percentage of completed subtasks.
 * @param {Array} subtasks - The list of subtasks.
 * @param {number} completedSubtasks - The count of completed subtasks.
 * @returns {number} The percentage of completed subtasks.
 */
function getSubtaskPercent(subtasks, completedSubtasks) {
  if (subtasks) {
    const totalSubtasks = subtasks.length;
    const subtaskPercent = (completedSubtasks / totalSubtasks) * 100;

    return subtaskPercent;
  }
}

/**
 * Renders the tasks into their respective status sections: toDo, inProgress, awaitingFeedback, and done.
 */
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

/**
 * Opens a modal to display the detailed view of a task.
 * @param {number} index - The index of the task to open.
 */
function openTask(index) {
  renderToDoModalCard(index);
  renderSubtasksOverlay(index);
  let parent = document.getElementById('openTaskModal');
  let child = document.getElementById('openTaskInModal');
  document.getElementById('editingShowTaskIndex').value = index;

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}

/**
 * Renders the details of a task into a modal view.
 * @param {number} index - The index of the task to render in the modal.
 */
function renderToDoModalCard(index) {
  let toDoCardModal = document.getElementById('openTaskInModal');
  toDoCardModal.innerHTML = '';
  const task = tasks[index];
  toDoCardModal.innerHTML += generateToDoModalHTML(task, index);
}

/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Renders subtasks for a specific task in an overlay view.
 * @param {number} taskIndex - The index of the task for which to render the subtasks.
 */
function renderSubtasksOverlay(taskIndex) {
  const container = document.getElementById('subtask-box-overlay');
  const subtaskBoxWrapper = document.getElementById('subtaskBoxWrapper');
  if (!tasks || !tasks[taskIndex] || !tasks[taskIndex].subtasks) {
    console.error('Tasks or subtasks are not available.');
    return;
  }
  const subtasks = tasks[taskIndex].subtasks;
  if (subtasks.length > 0) {
    console.log('Found subtasks:', subtasks);
    subtaskBoxWrapper.classList.remove('d-none');
    container.innerHTML = '';
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

/**
 * Renders subtasks into a given container for a specific task.
 * @param {number} taskIndex - The index of the task for which to render the subtasks.
 * @param {HTMLElement} container - The container element where the subtasks should be rendered.
 */
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

/**
 * Updates the status of a subtask based on a checkbox in an overlay and re-renders the tasks.
 * @param {number} taskIndex - The index of the parent task.
 * @param {number} subtaskIndex - The index of the subtask to update.
 */
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

/**
 * Deletes a task from the list of tasks and updates storage. Closes the task modal and provides feedback.
 * @param {number} index - The index of the task to delete.
 */
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

/**
 * Saves the edited details of a task and updates the DOM accordingly.
 * @param {number} index - The index of the task being edited.
 */
function saveEditedTask(index) {
  updateTaskDetails(index);
  setItem('tasks', JSON.stringify(tasks))
    .then(() => {
      renderToDoCard();
      openTask(document.getElementById('editingShowTaskIndex').value);

      let parent = document.getElementById('editTaskModal');
      let child = document.getElementById('editTaskInModal');
      parent.classList.toggle('modal-bg-animation');
      child.classList.toggle('modal-animation');
    })
    .catch(err => {
      console.error('Error updating the task:', err);
    });
}

/**
 * Updates the details of a task based on user input.
 * @param {number} index - The index of the task being updated.
 */
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

/**
 * Sets the priority for a task during editing.
 * @param {string} prioType - The type of priority ('urgent', 'medium', 'low').
 */
function setEditPrio(prioType) {
  const boxes = ['edit-urgent-prio-box', 'edit-medium-prio-box', 'edit-low-prio-box'];
  resetPriorityBoxes(boxes);
  const currentBox = document.getElementById(`edit-${prioType}-prio-box`);
  currentBox.classList.add(prioType);
  const whiteIcon = currentBox.querySelector('.white-icon');
  whiteIcon.classList.remove('d-none');
  const coloredIcon = currentBox.querySelector(':nth-child(2)');
  coloredIcon.classList.add('d-none');
  editedPriority = prioType;
}

/**
 * Resets the visual representation of priority boxes to their default state.
 * @param {string[]} boxes - Array of box IDs to reset.
 */
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

/**
 * Toggles the dropdown for editing contacts.
 */
function toggleDropdownEditContacts() {
  let contactsEditList = document.getElementById('dropdownContentEditContacts');
  if (contactsEditList.style.display === 'none' || contactsEditList.style.display === '') {
    contactsEditList.style.display = 'block';
  } else {
    contactsEditList.style.display = 'none';
  }
}

/**
 * Opens a modal to allow the user to edit the details of a task.
 * @param {number} index - The index of the task being edited.
 */
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

/**
 * Holds tasks found during the search operation.
 */
let foundTasks = [];

/**
 * Searches tasks based on the user input and populates the `foundTasks` array.
 */
function searchTask() {
  const input = document.getElementById('search-task-input').value.toLowerCase();
  foundTasks = tasks.filter(task => task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input));
  renderFilteredTasks();
}

/**
 * Renders tasks found during the search operation into their respective status sections.
 */
function renderFilteredTasks() {
  const statusArr = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
  statusArr.forEach(status => {
    const card = document.getElementById(`${status}-area`);
    if (card) {
      card.innerHTML = '';
      foundTasks.forEach((task, index) => {
        if (task.status === status) {
          card.innerHTML += generateToDoHTML(task, index);
        }
      });
    } else {
      console.error(`Element mit der ID '${status}-area' wurde nicht gefunden.`);
    }
  });
}
