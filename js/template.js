/**
 * Initializes the template with the given category and other related functionalities.
 *
 * @param {string} categoryName - The name of the category to initialize with.
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
 * Asynchronously includes HTML from external files into elements with the 'w3-include-html' attribute.
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
 * Displays the category based on the given name for desktop view.
 *
 * @param {string} categoryName - The name of the category to display.
 */
async function showCategory(categoryName) {
  if (categoryName === 'legal_notice' || categoryName === 'privacy_policy') {
    document.getElementById('sidebar_categories').classList.add('d-none');
  } else {
    document.getElementById('sidebar_categories').classList.remove('d-none');
    let allCategories = document.getElementsByClassName('active_category');
    if (allCategories.length != 0) {
      for (let i = 0; i < allCategories.length; i++) {
        const element = allCategories[i];

        element.classList.remove('active_category');
      }
    }
    let string = 'sidebar_categories_' + categoryName;
    let addCat = document.getElementById(string);
    addCat.classList.add('active_category');
  }
}


/**
 * Displays the category based on the given name for mobile view.
 *
 * @param {string} categoryName - The name of the category to display.
 */
async function showMobileCategory(categoryName) {
  let allCategories = document.getElementsByClassName('active_category');
  if (allCategories.length != 0) {
    for (let i = 0; i < allCategories.length; i++) {
      const element = allCategories[i];
      element.classList.remove('active_category');
    }
  }
  let string = 'mobile_categories_' + categoryName;
  let addCat = document.getElementById(string);
  addCat.classList.add('active_category');
}


/**
 * Toggles the visibility of the popup bar.
 */
function togglePopupBar() {
  let popupBar = document.getElementById('popupBar');
  popupBar.classList.toggle('d-none');
}


/**
 * Asynchronously creates a circle with the user's name acronym.
 */
async function createNameCircle() {
  await loadUsers();
  let acronym = createAcronym(currentUser);
  let topbar = document.getElementById('topbar_icons');
  let mobiletopbar = document.getElementById('mobile_topbar_icons');
  topbar.innerHTML += /*html*/ `
        <div id="topbar_Icons_Username" onclick="togglePopupBar()">${acronym}</div>
    `;
  mobiletopbar.innerHTML += /*html*/ `
     <div id="mobile_topbar_Icons_Username" onclick="togglePopupBar()">${acronym}</div>
 `;
}


/**
 * Logs out the current user and updates the local storage state.
 */
function logoutUser() {
  localStorage.setItem(`loggedIn`, false);
}


/**
 * Creates an acronym from the given user name.
 *
 * @param {string} currentUser - The name of the current user.
 * @returns {string} The acronym created from the user name.
 */
function createAcronym(currentUser) {
  let acronym;
  let matches = currentUser.match(/^(\w+)|(\w+)\W*$/g);
  if (matches.length == 2) {
    acronym = matches[0].charAt(0) + matches[1].charAt(0);
  } else {
    acronym = matches[0].charAt(0);
  }
  return acronym;
}


/**
 * Saves the clicked column's information to the local storage.
 *
 * @param {string} clickColumn - The identifier of the clicked column.
 */
function saveColumn(clickColumn) {
  column = localStorage.setItem('column', clickColumn);
}