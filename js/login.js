/**
 * The currently logged in user.
 */
let currentUser;


/**
 * Initializes the login page by loading users and cached credentials.
 */
 function init() {
   loadUsers();
   loadCache();
 }


 /**
 * Checks if there is any data in local storage. If not, redirects to the index page.
 */
 function checkLocalStorage () {
   if (localStorage.length === 0) {
     window.location.href = "../index.html";
   }
 }


 /**
 * Asynchronously loads the list of users.
 */
 async function loadUsers() {
   try {
     users = JSON.parse(await getItem('users'));
   } catch (e) {
     //console.error('Loading error:', e);
   }
 }


 /**
 * Attempts to log in the user based on provided credentials. Shows error if credentials are incorrect.
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
 * Logs in the user as a guest.
 */
 function guestUser() {
   localStorage.setItem(`currentUser`, `Guest`);
   window.location.href = 'pages/summary.html';
   localStorage.setItem(`loggedIn`, true);
 }


 /**
 * Checks if the user is logged in. If not, redirects to the index page with an alert.
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
 * Caches the user's email and password if the 'remember me' option is checked.
 */
 function cacheData() {
   let check = document.getElementById('remember');
   if (check.checked == true) {
     localStorage.setItem('email', `${email.value}`);
     localStorage.setItem(`password`, `${password.value}`);
   }
 }


 /**
 * Loads cached email and password into the login form.
 */
 function loadCache() {
   let email = localStorage.getItem('email');
   let password = localStorage.getItem('password');
   document.getElementById('email').value = email;
   document.getElementById('password').value = password;
 }