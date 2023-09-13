/**
 * List of tasks.
 * @type {Array}
 */
let tasks = [];

/**
 * Retrieves stored categories from local storage.
 * @type {Array}
 */
const storedCategories = getCategoriesFromLocalStorage();

/**
 * Array of categories. Falls back to default categories if none are stored.
 * @type {Array}
 */
let categories =
  storedCategories.length > 0
    ? storedCategories
    : [
        {name: 'IT', color: '#008ddc'},
        {name: 'Design', color: '#ff7827'},
        {name: 'Sales', color: '#a900f8'},
        {name: 'Backoffice', color: '#502787'},
        {name: 'Media', color: '#00d345'},
        {name: 'Marketing', color: '#bb051d'},
      ];

/**
 * Array of category colors.
 * @type {Array}
 */
let categoryColors = ['#8AA4FF', '#F00', '#2AD300', '#FF8A00', '#E200BE', '#0038FF'];

/**
 * Currently selected color.
 * @type {String|null}
 */
let selectedColor;

/**
 * Current priority.
 * @type {Number|null}
 */
let currentPriority = null;

/**
 * Selected priority.
 * @type {Number|null}
 */
let selectedPrio = null;

/**
 * List of current subtasks.
 * @type {Array}
 */
let currentSubtasks = [];

/**
 * Initializes tasks, loads categories, tasks, and contacts.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function initTask() {
  checkLogIn();
  await initTemplate('addTask');
  getCategory();
  await loadTasks();
  await loadContacts();
}

/**
 * Loads tasks from storage and parses them into the tasks array.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function loadTasks() {
  try {
    let storedTasks = await getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
      console.log('Geladene Tasks:', tasks);
    }
  } catch (error) {
    console.error('Could not load tasks:', error);
  }
}

/**
 * Loads contacts from storage.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function loadContacts() {
  try {
    let storedContacts = await getItem('contacts');
    if (storedContacts) {
      contacts = JSON.parse(storedContacts);
    }
  } catch (error) {
    console.error('Could not load contacts:', error);
  }
  renderAssignedContacts('dropdownContentContacts');
}

/**
 * Renders the assigned contacts for a task.
 * @function
 * @param {string} targetDivId - The ID of the target div where the contacts will be rendered.
 * @param {Object|null} task - The task object (optional).
 */
function renderAssignedContacts(targetDivId, task = null) {
  let contactsList = document.getElementById(targetDivId);
  if (!contactsList) {
    console.error(`Element with ID ${targetDivId} not found.`);
    return;
  }
  contactsList.innerHTML = '';
  let sortedContacts = sortContactsByName();

  for (let index = 0; index < sortedContacts.length; index++) {
    let contact = sortedContacts[index];
    contactsList.style.display = 'none';
    appendAssignedContact(contactsList, contact, index, task);
  }
}

/**
 * Appends a single assigned contact to the contacts list.
 * @function
 * @param {HTMLElement} contactsList - The DOM element of the contacts list.
 * @param {Object} contact - The contact object.
 * @param {number} index - The index of the contact in the contacts array.
 * @param {Object|null} task - The task object (optional).
 */
function appendAssignedContact(contactsList, contact, index, task = null) {
  let initials = getInitials(contact.name);
  let isChecked = '';
  if (task) {
    for (let assignedContact of task.contacts) {
      if (assignedContact.name === contact.name && assignedContact.email === contact.email) {
        isChecked = 'checked';
        break;
      }
    }
  }
  let contactContainer = document.createElement('div');
  contactContainer.innerHTML = appendAssignedContactHTML(contact, initials, index, isChecked);
  contactContainer.onclick = function (event) {
    event.stopPropagation();
  };
  contactsList.appendChild(contactContainer);
}

/**
 * Retrieves the list of selected contacts from the UI.
 * @function
 * @returns {Array} Array of selected contacts.
 */
function getSelectedContacts() {
  let checkboxes = document.querySelectorAll('.assigned-checkbox:checked');
  let selectedContacts = [];
  checkboxes.forEach(checkbox => {
    let contactIndex = checkbox.getAttribute('value');
    selectedContacts.push(contacts[contactIndex]);
  });
  return selectedContacts;
}

/**
 * Toggles the display of the contacts dropdown.
 * @function
 */
function toggleDropdownContacts() {
  let contactsList = document.getElementById('dropdownContentContacts');
  if (contactsList.style.display === 'none' || contactsList.style.display === '') {
    contactsList.style.display = 'block';
  } else {
    contactsList.style.display = 'none';
  }
}

/**
 * Fetches the dropdown content element, clears its content, and populates it with available categories.
 */
function getCategory() {
  let dropdownContent = document.getElementById('dropdownContent');
  dropdownContent.innerHTML = '';

  if (!dropdownContent) {
    console.error("Element 'dropdownContent' existiert nicht im DOM.");
  }

  dropdownContent.style.display = 'none';

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let categoryDiv = createCategoryDiv(category);
    dropdownContent.appendChild(categoryDiv);
  }
}

/**
 * Creates a category div element containing the name and color representation of the given category.
 * @param {Object} category - An object containing category details.
 * @returns {HTMLElement} A div element representing the category.
 */
function createCategoryDiv(category) {
  let categoryDiv = document.createElement('div');
  let circle = document.createElement('span');
  circle.style.backgroundColor = category.color;
  circle.className = 'circle';

  categoryDiv.appendChild(document.createTextNode(category.name));
  categoryDiv.appendChild(circle);

  categoryDiv.onclick = function (event) {
    event.stopPropagation();
    selectCategory(category.name, category.color);
  };

  return categoryDiv;
}

/**
 * Updates the UI with the selected category's name and hides other related dropdown elements.
 * @param {string} name - The name of the category.
 * @param {string} color - The color code associated with the category.
 */
function selectCategory(name, color) {
  document.getElementById('selectedCategory').innerHTML = name;
  document.getElementById('dropdownContent').style.display = 'none';
  document.getElementById('addNewCategory').style.display = 'none';
  document.getElementById('selectedCategory').classList.remove('d-none');

  let existingCircle = document.querySelector('.dropdown .selected-circle');
  if (existingCircle) existingCircle.remove();

  let selectedCircle = document.createElement('span');
  selectedCircle.className = 'circle selected-circle';
  selectedCircle.style.backgroundColor = color;
  document.querySelector('.dropdown').appendChild(selectedCircle);
}

/**
 * Initializes the UI for creating a new category.
 */
function createNewCategory() {
  const categoryBox = document.getElementById('addNewCategory');
  categoryBox.removeAttribute('onclick');

  categoryBox.innerHTML = getCreateNewCategoryHTML();
  getColorPicker();
  toggleDropdown();
  document.getElementById('dropdownContent').classList.add('d-none');
  document.getElementById('selectedCategory').classList.add('d-none');
}

/**
 * Creates a new category based on the entered name and selected color, then updates the local storage and UI.
 */
function addNewCategory() {
  if (!selectedColor) {
    document.getElementById('errorTagCategory').classList.remove('d-none');
    return;
  }
  const newCategory = {
    name: document.getElementById('category-input').value,
    color: selectedColor,
  };
  categories.push(newCategory);
  saveCategoriesToLocalStorage();
  document.getElementById('dropdownContent').classList.remove('d-none');
  document.getElementById('color-picker-box').style.display = 'none';
  document.getElementById('addNewCategory').style.display = 'none';

  getCategory();
  showUserFeedbackMessage('Category successfully created');
  toggleDropdown();
  document.getElementById('errorTagCategory').classList.add('d-none');
}

/**
 * Saves the current categories list to local storage.
 */
function saveCategoriesToLocalStorage() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

/**
 * Fetches and returns the list of categories from local storage.
 * @returns {Array} An array of stored categories or an empty array if none found.
 */
function getCategoriesFromLocalStorage() {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  return [];
}

/**
 * Deletes a category from the list based on its name and updates local storage.
 * @param {string} categoryName - The name of the category to be deleted.
 */
function deleteCategoryByName(categoryName) {
  const index = categories.findIndex(category => category.name === categoryName);

  if (index !== -1) {
    categories.splice(index, 1);
    saveCategoriesToLocalStorage();
  } else {
    console.log(`Category "${categoryName}" not found.`);
  }
}

/**
 * Populates the color picker box with predefined category colors.
 */
function getColorPicker() {
  const colorBox = document.getElementById('color-picker-box');
  colorBox.classList.remove('d-none');
  colorBox.innerHTML = '';

  categoryColors.forEach((color, index) => {
    colorBox.innerHTML += getColorHTML(color, index);
  });
}

/**
 * Marks a color as selected in the color picker and stores the selection.
 * @param {string} color - The color code of the selected color.
 * @param {string} id - The id of the selected color div.
 */
function selectColor(color, id) {
  const colrPickerBox = document.getElementById('color-picker-box');
  const colorBoxes = colrPickerBox.querySelectorAll('div');
  selectedColor = color;

  colorBoxes.forEach(colorBox => {
    colorBox.classList.remove('active-color');
  });

  const selectedColorBox = document.getElementById(id);
  selectedColorBox.classList.add('active-color');
}

/**
 * Toggles the visibility of the category dropdown and associated elements.
 */
function toggleDropdown() {
  let dropdownContent = document.getElementById('dropdownContent');
  if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
    dropdownContent.style.display = 'block';
    document.getElementById('selectedCategory').classList.add('d-none');
    document.getElementById('addNewCategory').classList.remove('d-none');
  } else {
    dropdownContent.style.display = 'none';
    document.getElementById('addNewCategory').classList.add('d-none');
    document.getElementById('selectedCategory').classList.remove('d-none');
  }
}

/**
 * Sets the selected priority and updates the UI accordingly.
 * @param {string} prioType - The chosen priority ('urgent', 'medium', or 'low').
 */
function setPrio(prioType) {
  const boxes = ['urgent-prio-box', 'medium-prio-box', 'low-prio-box'];
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });
  const currentBox = document.getElementById(`${prioType}-prio-box`);
  currentBox.classList.add(prioType);
  const whiteIcon = currentBox.querySelector('.white-icon');
  whiteIcon.classList.remove('d-none');
  const coloredIcon = currentBox.querySelector(':nth-child(2)');
  coloredIcon.classList.add('d-none');
  currentPriority = prioType;
}

/**
 * Asynchronously creates and stores a new task.
 */
async function addTask() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const selectedCategory = document.getElementById('selectedCategory').textContent.trim();

  if (selectedCategory === 'Select task category') {
    displayCategoryError();
    return;
  }

  const task = buildTaskObject(title, description, selectedCategory);

  await saveTask(task);

  postTaskActions();
}

/**
 * Displays an error if no category has been chosen.
 */
function displayCategoryError() {
  const errorMsgDiv = document.getElementById('errorTagCategory');
  errorMsgDiv.classList.remove('d-none');
  setTimeout(() => {
    errorMsgDiv.classList.add('d-none');
  }, 3000);
}

/**
 * Constructs a task object based on provided details.
 * @param {string} title - Title of the task.
 * @param {string} description - Description of the task.
 * @param {string} selectedCategory - Chosen category for the task.
 * @returns {Object} - Returns the task object.
 */
function buildTaskObject(title, description, selectedCategory) {
  const selectedContacts = getSelectedContacts();
  const dueDate = document.getElementById('due-date').value;
  const modalElement = document.getElementById('addTaskInModal');
  const taskStatus = modalElement ? modalElement.getAttribute('data-status') : 'toDo';

  return {
    title,
    description,
    category: selectedCategory,
    contacts: selectedContacts,
    dueDate,
    priority: currentPriority,
    subtasks: [...currentSubtasks],
    status: taskStatus,
  };
}

/**
 * Asynchronously saves the task.
 * @param {Object} task - The task object to be stored.
 */
async function saveTask(task) {
  tasks.push(task);
  try {
    await setItem('tasks', JSON.stringify(tasks));
    console.log('Task erfolgreich gespeichert!');
    setTimeout(() => {
      window.location.href = 'board.html';
    }, 1000);
  } catch (error) {
    console.error('Fehler beim Speichern des Tasks:', error);
  }
}

/**
 * Clears all fields and gives feedback once a task is created.
 */
function postTaskActions() {
  clearAll();
  renderToDoCard('subtask-box');
  showUserFeedbackMessage('Task successfully created');
  addTaskModal();
}

/**
 * Sets the minimum date attribute to today's date.
 */
function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementsByName('due-date')[0].setAttribute('min', today);
}

/**
 * Clears the content of a given input element.
 * @param {string} id - The ID of the input element to be cleared.
 */
function clearInput(id) {
  let inputField = document.getElementById(id);
  inputField.value = '';
}

/**
 * Renders subtasks to a specific container.
 * @param {string} targetDivId - The ID of the container where the subtasks are to be rendered.
 * @param {Object} [task=null] - The task object, if available.
 */
function renderSubtasks(targetDivId, task = null) {
  const container = document.getElementById(targetDivId);

  if (!container) {
    console.error(`Element mit ID ${targetDivId} nicht gefunden.`);
    return;
  }
  container.innerHTML = '';
  for (let i = 0; i < currentSubtasks.length; i++) {
    const subtask = currentSubtasks[i];
    container.innerHTML += getSubtaskHTML(subtask, i, task, targetDivId);
  }
}

/**
 * Adds a subtask to the list and renders it.
 * @param {string} targetDivId - The ID of the target container.
 */
function addSubtask(targetDivId) {
  const input = targetDivId == 'subtask-edit-box' ? document.getElementById('subtask-input-edit') : document.getElementById('subtask-input');
  if (input.value.length > 0) {
    const subtask = {
      name: input.value,
      status: 'open',
    };
    currentSubtasks.push(subtask);
    renderSubtasks(targetDivId);
    clearInput(input.id);
  }
}

/**
 * Removes a subtask from the list and re-renders the remaining ones.
 * @param {number} i - Index of the subtask to be removed.
 * @param {string} targetDivId - The ID of the target container.
 */
function deleteSubtask(i, targetDivId) {
  currentSubtasks.splice(i, 1);
  renderSubtasks(targetDivId);
}

/**
 * Clears all input fields and resets the UI.
 */
function clearAll() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('selectedCategory').innerHTML = 'Select task category';
  document.getElementById('due-date').value = '';
  currentSubtasks = [];
  renderSubtasks('subtask-box');
  let existingCircle = document.querySelector('.dropdown .selected-circle');
  if (existingCircle) existingCircle.remove();
  resetPrioAndDropdown();
}

/**
 * Resets the priority selections and dropdown checkboxes to default states.
 */
function resetPrioAndDropdown() {
  const boxes = ['urgent-prio-box', 'medium-prio-box', 'low-prio-box'];
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });
  const checkboxes = document.querySelectorAll('#dropdownContentContacts input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  const dropdown = document.getElementById('dropdownContentContacts');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

/**
 * Asynchronously deletes all stored tasks.
 */
async function deleteAllTasks() {
  tasks = [];
  try {
    await setItem('tasks', JSON.stringify(tasks));
    console.log('Alle Tasks erfolgreich gelöscht!');
  } catch (error) {
    console.error('Fehler beim Löschen aller Tasks:', error);
  }
}

/**
 * Toggles the visibility of the 'Add Task' modal.
 * @param {string} [status='toDo'] - The status of the task being added.
 */
function addTaskModal(status = 'toDo') {
  let parent = document.getElementById('addTaskModal');
  let child = document.getElementById('addTaskInModal');

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
  clearAll();
  clearInput('subtask-input');
  child.setAttribute('data-status', status);
}
