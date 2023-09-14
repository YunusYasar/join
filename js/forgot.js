/**
 * Reference to the forgot password form.
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
 * Event listener to handle form submission.
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const emailMatching = await sendMail();
  if (emailMatching) {
    document.body.classList.add("clicked");
    button.classList.add("clicked");
    await delay(1000);
    form.submit();
  }
});


/**
 * Sends an email for password reset. Also handles email validation.
 * @returns {Promise<boolean>} A promise that resolves to 'true' if the email matches, 'false' otherwise.
 */
async function sendMail() {
  let email = document.getElementById("email");
  email.classList.remove("border-red");
  error.style = "display:none;";
  if (users[0].email == email.value) {
    return true;
  } else {
    email.classList.add("border-red");
    email.value = "";
    error.style = "display:flex;";
    return false;
  }
}