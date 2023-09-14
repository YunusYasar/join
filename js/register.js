/**
 * Array to store registered users.
 */
let users = [];


/**
 * Reference to the username input field.
 * @type {HTMLInputElement}
 */
let username = document.getElementById("name");


/**
 * Reference to the email input field.
 * @type {HTMLInputElement}
 */
let email = document.getElementById("email");


/**
 * Reference to the confirm password input field.
 * @type {HTMLInputElement}
 */
let confirm = document.getElementById("confirmpassword");


/**
 * Reference to the password input field.
 * @type {HTMLInputElement}
 */
let password = document.getElementById("password");


/**
 * Reference to the signup button.
 * @type {HTMLButtonElement}
 */
let signup = document.getElementById("signup");


/**
 * Reference to the registration form.
 * @type {HTMLElement}
 */
const form = document.getElementById("forgot-form");


/**
 * Reference to the fly-in button within the form.
 * @type {HTMLElement}
 */
const button = document.querySelector(".fly-in-button");


/**
 * Reference to the overlay element.
 * @type {HTMLElement}
 */
const overlay = document.querySelector(".overlay");


/**
 * Creates a delay for a given number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the given delay.
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Event listener to handle form submission and user registration.
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const passwordMatching = await addUser();
  if (passwordMatching) {
    document.body.classList.add("clicked");
    button.classList.add("clicked");
    await delay(1000);
    form.submit();
    window.location.href = "../index.html";
  }
});


/**
 * Asynchronously adds a new user based on provided registration details.
 * @returns {Promise<boolean>} A promise that resolves to 'true' if registration is successful, 'false' otherwise.
 */
async function addUser() {
  confirm.classList.remove("border-red");
  error.style = "display: none;";
  if (
    username.value.length >= 1 &&
    email.value.length >= 1 &&
    password.value.length >= 1 &&
    password.value == confirm.value
  ) {
    users.push({
      name: username.value,
      email: email.value,
      password: password.value,
    });
    await setItem("users", JSON.stringify(users));
    resetForm();
    return true;
  } else {
    confirm.classList.add("border-red");
    error.style = "display: flex;";
    confirm.value = "";
    return false;
  }
}


/**
 * Resets the registration form fields.
 */
function resetForm() {
  username.value = "";
  email.value = "";
  confirm.value = "";
  password.value = "";
  signup.disabled = false;
}