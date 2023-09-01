let tasks = [];
let categories = [
  {name: 'IT', color: '#008ddc'},
  {name: 'Design', color: '#ff7827'},
  {name: 'Sales', color: '#a900f8'},
  {name: 'Backoffice', color: '#502787'},
  {name: 'Media', color: '#00d345'},
  {name: 'Marketing', color: '#bb051d'},
];

let currentPriority = null;
let selectedPrio = null;
let currentSubtasks = [];

async function init() {
  await includeHTML();
  getCategory();
  await loadTasks();
  await loadContacts();
  renderToDoCard();
}

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
function appendAssignedContact(contactsList, contact, index, task = null) {
  let initials = getInitials(contact.name);
  let isChecked = '';
  // Prüfe, ob der Kontakt bereits zugewiesen ist, wenn ein Task übergeben wurde
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

function getSelectedContacts() {
  let checkboxes = document.querySelectorAll('.assigned-checkbox:checked');
  let selectedContacts = [];
  checkboxes.forEach(checkbox => {
    let contactIndex = checkbox.getAttribute('value');
    selectedContacts.push(contacts[contactIndex]);
  });
  return selectedContacts;
}

function toggleDropdownContacts() {
  let contactsList = document.getElementById('dropdownContentContacts');
  if (contactsList.style.display === 'none' || contactsList.style.display === '') {
    contactsList.style.display = 'block';
  } else {
    contactsList.style.display = 'none';
  }
}

// Hauptfunktion zum Abrufen von Kategorien und Hinzufügen zum Dropdown
function getCategory() {
  let dropdownContent = document.getElementById('dropdownContent');

  if (!dropdownContent) {
    console.error("Element 'dropdownContent' existiert nicht im DOM.");
    return; // Verlässt die Funktion, wenn das Element nicht existiert
  }

  dropdownContent.style.display = 'none';

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let categoryDiv = createCategoryDiv(category);
    dropdownContent.appendChild(categoryDiv);
  }
}
// Funktion zum Erstellen eines einzelnen Kategorie-Divs
function createCategoryDiv(category) {
  let categoryDiv = document.createElement('div');

  let circle = document.createElement('span');
  circle.style.backgroundColor = category.color;
  circle.className = 'circle';

  categoryDiv.appendChild(document.createTextNode(category.name));
  categoryDiv.appendChild(circle);

  categoryDiv.onclick = function (event) {
    // Verhindert, dass das Klick-Event nach oben weitergegeben wird
    event.stopPropagation();
    selectCategory(category.name, category.color);
  };

  return categoryDiv;
}

function selectCategory(name, color) {
  document.getElementById('selectedCategory').innerHTML = name;

  // Diese Zeile stellt sicher, dass der Dropdown geschlossen wird, nachdem eine Kategorie ausgewählt wurde.
  document.getElementById('dropdownContent').style.display = 'none';

  let existingCircle = document.querySelector('.dropdown .selected-circle');
  if (existingCircle) existingCircle.remove();

  let selectedCircle = document.createElement('span');
  selectedCircle.className = 'circle selected-circle';
  selectedCircle.style.backgroundColor = color;
  document.querySelector('.dropdown').appendChild(selectedCircle);
}

function toggleDropdown() {
  let dropdownContent = document.getElementById('dropdownContent');
  if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
    dropdownContent.style.display = 'block';
  } else {
    dropdownContent.style.display = 'none';
  }
}

function setPrio(prioType) {
  const boxes = ['urgent-prio-box', 'medium-prio-box', 'low-prio-box']; // Alle Klassen und d-none von den Bildern entfernen
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });
  const currentBox = document.getElementById(`${prioType}-prio-box`); // Dann die Klasse dem angeklickten Element hinzufügen
  currentBox.classList.add(prioType);
  const whiteIcon = currentBox.querySelector('.white-icon');
  whiteIcon.classList.remove('d-none');
  const coloredIcon = currentBox.querySelector(':nth-child(2)');
  coloredIcon.classList.add('d-none');
  currentPriority = prioType;
}

async function addTask() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const selectedCategory = document.getElementById('selectedCategory').textContent.trim();
  const selectedContacts = getSelectedContacts();
  const dueDate = document.getElementById('due-date').value;
  //zorunlu alan olark priority
  const task = {
    title,
    description,
    category: selectedCategory,
    contacts: selectedContacts,
    dueDate,
    priority: currentPriority,
    subtasks: [...currentSubtasks],
    status: 'toDo',
  };
  tasks.push(task);
  try {
    await setItem('tasks', JSON.stringify(tasks));
    console.log('Task erfolgreich gespeichert!');
  } catch (error) {
    console.error('Fehler beim Speichern des Tasks:', error);
  }
  clearAll();
  renderToDoCard('subtask-box');
  showUserFeedbackMessage('Task successfully created');
  addTaskModal();
}

function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementsByName('due-date')[0].setAttribute('min', today);
}

function clearInput(id) {
  let inputField = document.getElementById(id);
  inputField.value = '';
}

function renderSubtasks(targetDivId, task = null) {
  console.log('renderSubtasks() wurde aufgerufen, targetDivId:', targetDivId);

  const container = document.getElementById(targetDivId);
  console.log('Container:', container);

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

function getSubtaskHTML(subtask, i, task = null, targetDivId) {
  let subtaskName = task ? subtask.name : subtask.name;
  return /*html*/ `
    <div class="subtasks-content">
      <span>
        - ${subtaskName}
      </span>
      <img onclick="deleteSubtask(${i},'${targetDivId}')" class="subtask-img" src="../assets/img/delete.svg" alt="" />
    </div> 
    `;
}

function addSubtask(targetDivId) {
  console.log('addSubtask() wurde aufgerufen');

  const input = targetDivId == 'subtask-edit-box' ? document.getElementById('subtask-input-edit') : document.getElementById('subtask-input');
  if (input.value.length > 0) {
    const subtask = {
      name: input.value,
      status: 'open',
    };
    console.log(`Füge Subtask hinzu: ${input.value}`);
    currentSubtasks.push(subtask);
    renderSubtasks(targetDivId);
    clearInput(input.id);
  }
}

function deleteSubtask(i, targetDivId) {
  currentSubtasks.splice(i, 1);
  renderSubtasks(targetDivId);
}

function clearAll() {
  // Eingabefelder zurücksetzen
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

function resetPrioAndDropdown() {
  const boxes = ['urgent-prio-box', 'medium-prio-box', 'low-prio-box']; // Priority-Boxen zurücksetzen
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });
  const checkboxes = document.querySelectorAll('#dropdownContentContacts input[type="checkbox"]'); // Alle Checkboxen im Dropdown zurücksetzen
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  const dropdown = document.getElementById('dropdownContentContacts'); // Dropdown mit der ID assignedContactsList schließen
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

async function deleteAllTasks() {
  tasks = [];
  try {
    await setItem('tasks', JSON.stringify(tasks));
    console.log('Alle Tasks erfolgreich gelöscht!');
  } catch (error) {
    console.error('Fehler beim Löschen aller Tasks:', error);
  }
}

function addTaskModal() {
  let parent = document.getElementById('addTaskModal');
  let child = document.getElementById('addTaskInModal');

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
  clearAll();
  clearInput('subtask-input');
}
