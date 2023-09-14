let currentUser;

function init() {
  loadUsers();
  loadCache();
}

function checkLocalStorage () {
  if (localStorage.length === 0) {
    window.location.href = "../index.html";
  }
  }

async function loadUsers() {
  try {
    users = JSON.parse(await getItem('users'));
  } catch (e) {
    //console.error('Loading error:', e);
  }
}

function loginUser() {
  let error = document.getElementById('error');
  loadUsers();
  if (users[0].email == email.value && users[0].password == password.value) {
    password.classList.remove('border-red');
    error.style = 'display: none;';
    window.location.href = 'pages/summary.html';
    localStorage.setItem(`currentUser`, `${users[0].name}`);
    localStorage.setItem(`loggedIn`, true);
    cacheData();
  } else {/**
  * Represents the current user.
  * @type {?string}
  */
 let currentUser;
 
 /**
  * Initializes the login page by loading users and cached data.
  */
 function init() {
   loadUsers();
   loadCache();
 }
 
 /**
  * Checks if local storage is empty and redirects if true.
  */
 function checkLocalStorage () {
   if (localStorage.length === 0) {
     window.location.href = "../index.html";
   }
 }
 
 /**
  * Asynchronously loads the users from storage.
  */
 async function loadUsers() {
   try {
     users = JSON.parse(await getItem('users'));
   } catch (e) {
     //console.error('Loading error:', e);
   }
 }
 
 /**
  * Logs in a user based on provided credentials.
  */
 function loginUser() {
   let error = document.getElementById('error');
   loadUsers();
   if (users[0].email == email.value && users[0].password == password.value) {
     password.classList.remove('border-red');
     error.style = 'display: none;';
     window.location.href = 'pages/summary.html';
     localStorage.setItem(`currentUser`, `${users[0].name}`);
     localStorage.setItem(`loggedIn`, true);
     cacheData();
   } else {
     password.classList.add('border-red');
     error.style = 'display: flex;';
     password.value = '';
   }
 }
 
 /**
  * Logs in a guest user.
  */
 function guestUser() {
   localStorage.setItem(`currentUser`, `Guest`);
   window.location.href = 'pages/summary.html';
   localStorage.setItem(`loggedIn`, true);
 }
 
 /**
  * Checks the login status and redirects if not logged in.
  */
 function checkLogIn() {
   checkLocalStorage();
   let LogInStatus = localStorage.getItem(`loggedIn`);
   if (LogInStatus == 'false') {
     alert('Please Log In to view this Page.');
     setTimeout((window.location.href = '../index.html'), 2000);
   }
 }
 
 /**
  * Caches user data for future sessions if the remember option is selected.
  */
 function cacheData() {
   let check = document.getElementById('remember');
   if (check.checked == true) {
     localStorage.setItem('email', `${email.value}`);
     localStorage.setItem(`password`, `${password.value}`);
   }
 }
 
 /**
  * Loads cached email and password data.
  */
 function loadCache() {
   let email = localStorage.getItem('email');
   let password = localStorage.getItem('password');
   document.getElementById('email').value = email;
   document.getElementById('password').value = password;
 }
 
    password.classList.add('border-red');
    error.style = 'display: flex;';
    password.value = '';
  }
}

function guestUser() {
  localStorage.setItem(`currentUser`, `Guest`);
  window.location.href = 'pages/summary.html';
  localStorage.setItem(`loggedIn`, true);
}

function checkLogIn() {
  checkLocalStorage();
  let LogInStatus = localStorage.getItem(`loggedIn`);
  if (LogInStatus == 'false') {
    alert('Please Log In to view this Page.');
    setTimeout((window.location.href = '../index.html'), 2000);
  }
}

function cacheData() {
  let check = document.getElementById('remember');
  if (check.checked == true) {
    localStorage.setItem('email', `${email.value}`);
    localStorage.setItem(`password`, `${password.value}`);
  }
}

function loadCache() {
  let email = localStorage.getItem('email');
  let password = localStorage.getItem('password');
  document.getElementById('email').value = email;
  document.getElementById('password').value = password;
}
