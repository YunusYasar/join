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

function togglePopupBar() {
  let popupBar = document.getElementById('popupBar');
  popupBar.classList.toggle('d-none');
}

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

function logoutUser() {
  localStorage.setItem(`loggedIn`, false);
}

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

function saveColumn(clickColumn) {
  column = localStorage.setItem('column', clickColumn);
}
