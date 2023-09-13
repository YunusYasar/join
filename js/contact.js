/**
 * List of contacts.
 * @type {Array}
 */
let contacts = [];

/**
 * @typedef {Object} Colors
 * @description Colors map for various predefined colors.
 */
const colors = {
  blue: '#008ddc',
  orange: '#ff7827',
  purple: '#a900f8',
  darkpurple: '#502787',
  pink: '#ff63fa',
  green: '#00d345',
  red: '#bb051d',
  yellow: '#ffc938',
};

/**
 * Initializes contacts by loading templates and contacts.
 */
async function initContacts() {
  checkLogIn();
  await initTemplate('contacts');
  await loadContacts();
}

/**
 * Asynchronously loads stored contacts and renders them.
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
  renderContacts();
}

/**
 * Renders contacts into the UI.
 * Contacts are sorted by name and grouped by initial letters.
 */
function renderContacts() {
  let contactsList = document.getElementById('contactsList');
  contactsList.innerHTML = '';
  let sortedContacts = sortContactsByName();
  let currentLetter = '';

  for (let index = 0; index < sortedContacts.length; index++) {
    let contact = sortedContacts[index];
    let initialLetter = contact.name.charAt(0).toUpperCase();

    if (initialLetter !== currentLetter) {
      currentLetter = initialLetter;
      appendSeparator(contactsList, currentLetter);
    }
    appendContact(contactsList, contact, index);
  }
}

/**
 * Sorts the contacts array by contact name.
 * @returns {Array<Object>} Sorted array of contacts.
 */
function sortContactsByName() {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Appends a separator (based on initial letters) to the contact list.
 * @param {HTMLElement} contactsList - The HTML container for contacts.
 * @param {string} currentLetter - The initial letter for grouping.
 */
function appendSeparator(contactsList, currentLetter) {
  let separator = document.createElement('div');
  separator.className = 'contact-wrapper';
  separator.innerHTML = `<span class="seperator-list">${currentLetter}</span><div class="line-list"></div>`;
  contactsList.appendChild(separator);
}

/**
 * Appends a contact to the contact list.
 * @param {HTMLElement} contactsList - The HTML container for contacts.
 * @param {Object} contact - Contact details.
 * @param {number} index - Index of the contact in the array.
 */
function appendContact(contactsList, contact, index) {
  let color = contact.color;
  let initials = getInitials(contact.name);
  let contactContainer = document.createElement('div');
  contactContainer.className = 'contact-container';
  contactContainer.innerHTML = `
      <div class="contact-card" onclick="renderContactCard(${index});">
        <div class="contact-avatar" style="background-color: ${color}">
          <span>${initials}</span>
        </div>
        <div class="contactlist-data">
          <span class="contact-name">${contact.name}</span>
          <span class="contact-email">${contact.email}</span>
        </div>
      </div>
  `;
  contactsList.appendChild(contactContainer);
}

/**
 * Returns a random color from the colors map.
 * @returns {string} A hexadecimal color value.
 */
function getRandomColor() {
  return Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)];
}

/**
 * Extracts and returns initials from a name.
 * @param {string} name - Full name.
 * @returns {string} Initials extracted from the name.
 */
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('');
}

/**
 * Renders a contact card for detailed view.
 * @param {number} index - Index of the contact to render.
 */
function renderContactCard(index) {
  document.getElementById('currentContact').innerHTML = '';
  let contact = contacts[index];
  contact.initials = getInitials(contact.name);
  contact.color = contact.color;
  let contactCardHTML = currentContactHTML(contact, index);
  document.getElementById('currentContact').innerHTML = contactCardHTML;
  document.getElementById('contactsOverview').style['z-index'] = 99;
  document.getElementById('contactsList').style['z-index'] = 0;
}

/**
 * Changes the Z-index for various contact sections.
 */
function changeZindex() {
  document.getElementById('contactsOverview').style['z-index'] = 0;
  document.getElementById('contactsList').style['z-index'] = 99;
  document.getElementById('newContact').style['z-index'] = 999;
}

/**
 * Asynchronously adds a new contact after form submission.
 * @param {Event} event - The form submission event.
 */
async function addContact(event) {
  event.preventDefault();

  let name = document.getElementById('contactName').value;
  let email = document.getElementById('contactEmail').value;
  let phone = document.getElementById('contactPhone').value;
  let color = getRandomColor();

  let contact = {name: capitalizeFirstLetter(name), email: email, phone: phone, color: color};
  contacts.push(contact);
  await setItem('contacts', JSON.stringify(contacts));

  addContactModal();
  showUserFeedbackMessage('Contact successfully created');
  renderContacts();
}

/**
 * Asynchronously updates a contact based on the provided index.
 * @param {number} index - Index of the contact in the contacts array.
 */
async function updateContact(index) {
  let name = document.getElementById('editContactName').value;
  let email = document.getElementById('editContactEmail').value;
  let phone = document.getElementById('editContactPhone').value;
  let color = contacts[index].color;

  contacts[index] = {name: capitalizeFirstLetter(name), email: email, phone: phone, color: color};
  await setItem('contacts', JSON.stringify(contacts));

  editContactModal(index);
  showUserFeedbackMessage('Contact successfully updated');
  renderContacts();
  renderContactCard(index);
}

/**
 * Toggles the add contact modal visibility and resets the form.
 */
function addContactModal() {
  addContactForm.reset();
  let parent = document.getElementById('addContactModal');
  let child = document.getElementById('addContact');

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}

/**
 * Toggles the edit contact modal visibility and loads contact details for editing.
 * @param {number} index - Index of the contact in the contacts array.
 */
function editContactModal(index) {
  let contact = contacts[index];
  if (!contact) {
    console.error('Contact not found at index', index);
    return;
  }
  let parent = document.getElementById('editContactModal');
  parent.innerHTML = editContactModalHTML(contact, index);
  let child = document.getElementById('editContact');

  document.getElementById('editingIndex').value = index;
  document.getElementById('editContactName').value = contact.name;
  document.getElementById('editContactEmail').value = contact.email;
  document.getElementById('editContactPhone').value = contact.phone;

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}

/**
 * Asynchronously deletes a contact based on the provided index.
 * @param {number} index - Index of the contact in the contacts array.
 */
async function deleteContact(index) {
  contacts.splice(index, 1);
  await setItem('contacts', JSON.stringify(contacts));
  showUserFeedbackMessage('Contact successfully deleted');
  document.getElementById('currentContact').innerHTML = '';
  renderContacts();
  changeZindex();
}

/**
 * Prevents an event from propagating up the DOM tree.
 * @param {Event} event - The event to stop propagation for.
 */
function noClose(event) {
  event.stopPropagation();
}

/**
 * Shows a feedback message to the user for a short duration.
 * @param {string} text - Message text to display.
 */
function showUserFeedbackMessage(text) {
  popInUserFeedbackMessage(text);
  setTimeout(popOutUserFeedbackMessage, 1500);
}

/**
 * Animates the feedback message to pop in and display the provided text.
 * @param {string} text - Message text to display.
 */
function popInUserFeedbackMessage(text) {
  let message = document.getElementById('contact-created-message');
  message.innerHTML = text;
  message.classList.remove('d-none');
  message.classList.remove('slide-down');
  message.classList.add('slide-up');
}

/**
 * Animates the feedback message to pop out and hide.
 */
function popOutUserFeedbackMessage() {
  let message = document.getElementById('contact-created-message');
  message.classList.remove('slide-up');
  message.classList.add('slide-down');
  setTimeout(() => {
    message.classList.add('d-none');
  }, 1500);
}

/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The string with its first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
