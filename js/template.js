/**
 * Initializes the template based on the given category name. Includes HTML, sets up categories, and creates the user's name circle.
 * @param {string} categoryName - The name of the category to initialize.
 */
async function initTemplate(categoryName) {
  await includeHTML();
  if (window.innerWidth > 900) {
    showCategory(categoryName);
  } else {
    showMobileCategory(categoryName);
  }
  currentUser = localStorage.getItem('currentUser');
  await createNameCircle();
}

/**
 * Includes external HTML files based on the 'w3-include-html' attribute in the DOM elements.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

/**
 * Displays the appropriate category based on the given category name for desktop view.
 * @param {string} categoryName - The name of the category to display.
 */
async function showCategory(categoryName) {
  var x = document.getElementsByClassName("category");
  for (i = 0; i < x.length; i++) {
    x[i].classList.add("d-none");
  }
  document.getElementById(categoryName).classList.remove("d-none");
}

/**
 * Displays the appropriate category based on the given category name for mobile view.
 * @param {string} categoryName - The name of the category to display.
 */
async function showMobileCategory(categoryName) {
  var x = document.getElementsByClassName("category");
  for (i = 0; i < x.length; i++) {
    x[i].classList.add("d-none");
  }
  document.getElementById(categoryName).classList.remove("d-none");
}

/**
 * Toggles the visibility of the popup bar.
 */
function togglePopupBar() {
  let popupBar = document.getElementById('popupBar');
  popupBar.classList.toggle('d-none');
}

/**
 * Creates a circle with the user's initials and adds it to the top bar.
 */
async function createNameCircle() {
  var nameCircle = document.getElementById('nameCircle');
  var user = await getUser(currentUser);
  var acronym = createAcronym(user['firstName'], user['lastName']);
  nameCircle.innerHTML = acronym;
}

/**
 * Logs out the current user by updating the 'loggedIn' status in the local storage.
 */
function logoutUser() {
  localStorage.setItem('loggedIn', false);
}

/**
 * Creates an acronym based on the current user's name.
 * @param {string} currentUser - The name of the current user.
 * @returns {string} The acronym created from the user's name.
 */
function createAcronym(firstName, lastName) {
  return firstName.charAt(0) + lastName.charAt(0);
}

/**
 * Saves the clicked column to the local storage.
 * @param {string} clickColumn - The column that was clicked.
 */
function saveColumn(clickColumn) {
  column = localStorage.setItem('column', clickColumn);
}
