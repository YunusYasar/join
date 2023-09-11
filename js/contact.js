let contacts = [];

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

async function initContacts() {
  await initTemplate('contacts');
  await loadContacts();
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
  renderContacts();
}

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

function sortContactsByName() {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function appendSeparator(contactsList, currentLetter) {
  let separator = document.createElement('div');
  separator.className = 'contact-wrapper';
  separator.innerHTML = `<span class="seperator-list">${currentLetter}</span><div class="line-list"></div>`;
  contactsList.appendChild(separator);
}

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

function getRandomColor() {
  return Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)];
}

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('');
}

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

function changeZindex() {
  document.getElementById('contactsOverview').style['z-index'] = 0;
  document.getElementById('contactsList').style['z-index'] = 99;
  document.getElementById('newContact').style['z-index'] = 999;
}

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

function addContactModal() {
  addContactForm.reset();
  let parent = document.getElementById('addContactModal');
  let child = document.getElementById('addContact');

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}

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

async function deleteContact(index) {
  contacts.splice(index, 1);
  await setItem('contacts', JSON.stringify(contacts));
  showUserFeedbackMessage('Contact successfully deleted');
  document.getElementById('currentContact').innerHTML = '';
  renderContacts();
  changeZindex();
}
function noClose(event) {
  event.stopPropagation();
}

function showUserFeedbackMessage(text) {
  popInUserFeedbackMessage(text);
  setTimeout(popOutUserFeedbackMessage, 1500);
}

function popInUserFeedbackMessage(text) {
  let message = document.getElementById('contact-created-message');
  message.innerHTML = text;
  message.classList.remove('d-none');
  message.classList.remove('slide-down');
  message.classList.add('slide-up');
}
function popOutUserFeedbackMessage() {
  let message = document.getElementById('contact-created-message');
  message.classList.remove('slide-up');
  message.classList.add('slide-down');
  setTimeout(() => {
    message.classList.add('d-none');
  }, 1500);
}

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
