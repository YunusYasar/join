let tasks = [];
let categories = [
  {name: 'IT', color: '#008ddc'},
  {name: 'Design', color: '#ff7827'},
  {name: 'Sales', color: '#a900f8'},
  {name: 'Backoffice', color: '#502787'},
  {name: 'Media', color: '#00d345'},
  {name: 'Marketing', color: '#bb051d'},
];
let prios = ['urgent', 'medium', 'low'];
let currentPriority = null;
let selectedPrio = null;
let currentSubtasks = [];

async function init() {
  await includeHTML();
  getCategory();
  loadContacts();
  loadTasks();
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
  renderAssignedContacts();
}
function renderAssignedContacts() {
  let contactsList = document.getElementById('dropdownContentContacts');
  contactsList.innerHTML = '';
  let sortedContacts = sortContactsByName();

  for (let index = 0; index < sortedContacts.length; index++) {
    let contact = sortedContacts[index];
    contactsList.style.display = 'none';
    appendAssignedContact(contactsList, contact, index);
  }
}
function appendAssignedContact(contactsList, contact, index) {
  let color = contact.color;
  let initials = getInitials(contact.name);
  let contactContainer = document.createElement('div');

  contactContainer.innerHTML = `
      <div class="contact-card-assigned">
          <div class="contact-avatar-assigned" style="background-color: ${color}">
              <span>${initials}</span>
          </div>
          <div class="assigned-contact-choice">
              <label class="contact-name">${contact.name}
              <input type="checkbox" class="assigned-checkbox" value="${index}">
              </label>
          </div>
      </div>
  `;

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

// function getCategory() {
//   let dropdownContent = document.getElementById('dropdownContent');

//   for (let i = 0; i < categories.length; i++) {
//     let category = categories[i];
//     let categoryDiv = document.createElement('div');
//     dropdownContent.style.display = 'none';
//     let circle = document.createElement('span');
//     circle.style.backgroundColor = category.color;
//     circle.className = 'circle';

//     categoryDiv.appendChild(document.createTextNode(category.name));
//     categoryDiv.appendChild(circle);
//     categoryDiv.onclick = function (event) {
//       // Verhindert, dass das Klick-Event nach oben weitergegeben wird
//       event.stopPropagation();
//       selectCategory(category.name, category.color);
//     };

//     dropdownContent.appendChild(categoryDiv);
//   }
// }
function getCategory() {
  let dropdownContent = document.getElementById('dropdownContent');

  if (!dropdownContent) {
    console.error("Element 'dropdownContent' existiert nicht im DOM.");
    return; // Verlässt die Funktion, wenn das Element nicht existiert
  }

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let categoryDiv = document.createElement('div');

    dropdownContent.style.display = 'none';

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

    dropdownContent.appendChild(categoryDiv);
  }
}

function toggleDropdownContacts() {
  let contactsList = document.getElementById('dropdownContentContacts');
  if (contactsList.style.display === 'none' || contactsList.style.display === '') {
    contactsList.style.display = 'block';
  } else {
    contactsList.style.display = 'none';
  }
}
function toggleDropdown() {
  let dropdownContent = document.getElementById('dropdownContent');
  if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
    dropdownContent.style.display = 'block';
  } else {
    dropdownContent.style.display = 'none';
  }
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

function setPrio(prioType) {
  // Alle Klassen und d-none von den Bildern entfernen
  const boxes = ['urgent-prio-box', 'medium-prio-box', 'low-prio-box'];
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });

  // Dann die Klasse dem angeklickten Element hinzufügen
  const currentBox = document.getElementById(`${prioType}-prio-box`);
  currentBox.classList.add(prioType);
  const whiteIcon = currentBox.querySelector('.white-icon');
  whiteIcon.classList.remove('d-none');
  const coloredIcon = currentBox.querySelector(':nth-child(2)');
  coloredIcon.classList.add('d-none');

  // Setze den aktuellen Wert von priority
  currentPriority = prioType;
}

async function addTask() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const selectedCategory = document.getElementById('selectedCategory').textContent.trim();
  const selectedContacts = getSelectedContacts();
  const dueDate = document.getElementById('due-date').value;

  // Verwende currentPriority direkt
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
}

function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementsByName('due-date')[0].setAttribute('min', today);
}
function clearInput(id) {
  let inputField = document.getElementById(id);
  inputField.value = '';
}
function addSubtask() {
  const input = document.getElementById('subtask-input');
  if (input.value.length > 0) {
    const subtask = {
      name: input.value,
      status: 'open',
    };
    currentSubtasks.push(subtask);
    renderSubtasks();
  }
}

function renderSubtasks() {
  const container = document.getElementById('subtask-box');
  clearInput('subtask-input');
  container.innerHTML = '';

  for (let i = 0; i < currentSubtasks.length; i++) {
    const subtask = currentSubtasks[i];
    container.innerHTML += getSubtaskHTML(subtask, i);
  }
}

function getSubtaskHTML(subtask, index) {
  return /*html*/ `
  <div class="subtasks-content">
    <span>
      - ${subtask.name}
    </span>
    <img onclick="deleteSubtask(${index})" class="subtask-img" src="../assets/img/delete.svg" alt="" />
  </div> 
  `;
}
function deleteSubtask(i) {
  currentSubtasks.splice(i, 1);
  renderSubtasks();
}

function clearAll() {
  // Eingabefelder zurücksetzen
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('selectedCategory').innerHTML = 'Select task category';
  document.getElementById('due-date').value = '';
  currentSubtasks = [];
  renderSubtasks();
  let existingCircle = document.querySelector('.dropdown .selected-circle');
  if (existingCircle) existingCircle.remove();
  // Priority-Boxen zurücksetzen
  const boxes = ['urgent-prio-box', 'medium-prio-box', 'low-prio-box'];
  boxes.forEach(boxId => {
    const box = document.getElementById(boxId);
    box.classList.remove('urgent', 'medium', 'low');
    const whiteIcon = box.querySelector('.white-icon');
    whiteIcon.classList.add('d-none');
    const coloredIcon = box.querySelector(':nth-child(2)');
    coloredIcon.classList.remove('d-none');
  });
  // Alle Checkboxen im Dropdown zurücksetzen
  const checkboxes = document.querySelectorAll('#dropdownContentContacts input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Dropdown mit der ID assignedContactsList schließen
  const dropdown = document.getElementById('dropdownContentContacts');
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
  // addContactForm.reset();
  let parent = document.getElementById('addTaskModal');
  let child = document.getElementById('addTaskInModal');

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}
