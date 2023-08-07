async function initContacts() {
  await includeHTML();
}

function toggleAddContactModal() {
  addContactForm.reset();
  let parent = document.getElementById('addContactModal');
  let child = document.getElementById('addContact');

  parent.classList.toggle('modal-bg-animation');
  child.classList.toggle('modal-animation');
}
