let currentUser;

function init() {
  loadUsers();
  loadCache();
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function loginUser() {
  let error = document.getElementById("error");
  loadUsers();
  if (users[0].email == email.value && users[0].password == password.value) {
    password.classList.remove("border-red");
    error.style = "display: none;";
    window.location.href = "pages/summary.html";
    localStorage.setItem(`currentUser`, `${users[0].name}`);
    localStorage.setItem(`loggedIn`, true);
    cacheData();
  } else {
    password.classList.add("border-red");
    error.style = "display: flex;";
    password.value = "";
  }
}

function guestUser() {
  localStorage.setItem(`currentUser`, `Guest`);
  window.location.href = "pages/summary.html";
  localStorage.setItem(`loggedIn`, true);

}


function checkLogIn() {
  let LogInStatus = localStorage.getItem(`loggedIn`);
  if (LogInStatus == 'false') {
    alert('Please Log In to view this Page.');
    setTimeout(window.location.href = "index.html", 2000);
  }
}

function cacheData() {
  let check = document.getElementById("remember");
  if (check.checked == true) {
    localStorage.setItem("email", `${email.value}`);
    localStorage.setItem(`password`, `${password.value}`);

  }
}

function loadCache() {
  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");
  document.getElementById("email").value = email;
  document.getElementById("password").value = password;
}