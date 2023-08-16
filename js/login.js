let LoginHTML = /*html*/`
        <h1>Log in</h1>
        <div id="underline"></div>
        <form onsubmit="login(); return false">
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <input type="password" id="pwd" name="Password" placeholder="Password" required>
            <span id="msgPwd"></span>
            <div class="pwd-ext">
                <input type="checkbox" name="Remember" id="saveLogin">
                <label for="saveLogin">Remember me</label>
                <a onclick="renderHTML('content',PwdHTML);hideElementID('signUp')">Forgot my password</a>
            </div>
            <div class="but-area">
                <button class="but-dark">Log in</button>
                <button class="but-light" onclick="loginGuest()">Guest Log in</button>
            </div>
        </form>
`;

let SingupHTML =/*html*/`
        <img class="arrow-back" src="assets/img/arrow-left-line.png" alt="Join Logo" onclick="renderHTML('content',LoginHTML); showElementID('signUp')">
        <h1>Sign up</h1>
        <div id="underline"></div>
        <form onsubmit="checkPwd(addUser()); return false">
            <input type="name" id="name" name="Name" placeholder="Name Lastname" pattern="[A-ZÃ„Ã–Ãœ][a-zÃ¤Ã¶Ã¼ÃŸ]{1,} [A-ZÃ„Ã–Ãœ][a-zÃ¤Ã¶Ã¼ÃŸ]{1,}" title="Name Lastname" required>
            <span id="msgName"></span>
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgEmail"></span>
            <input type="password" id="pwd" name="Password" placeholder="Password" minlength="8" required>
            <input type="password" id="pwdCon" name="Password" placeholder="Confirm Password" minlength="8" required>
            <span id="msgPwd"></span>
            <button class="but-dark" type="submit">Sign up</button>          
        </form>
`;
let PwdHTML = /*html*/`
        <img class="arrow-back" src="assets/img/arrow-left-line.png" alt="Join Logo" onclick="renderHTML('content',LoginHTML); showElementID('signUp')">
        <h1>I forgot my password</h1>
        <div id="underline"></div>
        <p>Don't worry! We will send you an email with the istructions to reset your password.</p>
        <form action="https://join-649.developerakademie.net/php/send_mail_change_pwd.php" method="POST"> 
            <input type="email" id="email" name="Email" placeholder="Email" required>
            <span id="msgMail"></span>
            <button class="but-dark">Send me the email</button>
        </form>
`;
let SendMailHTML = /*html*/`
    <div class="ovlyMsg">
        <div>
            <img src="./img/icons/send_mail.svg" alt="send e-mail">
            <span>An E-Mail has been sent to you</span>
        </div>
    </div>
`;
let ChangePwdHTML = /*html*/`
    <div class="ovlyMsg">
        <div>
            <span>You reset your password</span>
        </div>
    </div>
`;

/**
 * 
 * @param {string} id 
 * @param {string} HTML 
 */
function renderHTML(id, HTML) {
    let contentBox = document.getElementById(id);
    contentBox.innerHTML = HTML;
}

function togglPwd(id) {
    let element = document.getElementById(id);
    let type = element.getAttribute('type') === 'password' ? 'text' : 'password';
    element.setAttribute('type', type);
    let bgImg = element.style.backgroundImage;
    if (type === 'password') {
        element.setAttribute("style", "background-img:url(./img/icons/visibility_on.svg);");
    } else {
        element.setAttribute("style", "background-img:url(./img/icons/visibility_off.svg;)");
    }

}

function hidePwd(id) {
    let element = document.getElementById(id);
    element.setAttribute('type', 'password');
}

//------------------------------------------------

// this part should be in the backend
let users = [];

async function initLogin() {
    users = await getItem('users');
    contactListSorted = await getItem('contacts');
    loadLogin();
    checkState();
}

function checkPwd(doFunction) {
    let pwd1 = document.getElementById('pwd');
    let pwd2 = document.getElementById('pwdCon');
    if (pwd1.value === pwd2.value) {
        doFunction;
    } else {
        addMsg('pwdCon', 'msgPwd', 'Password confirmation is wrong!');
    }
}

function addUser() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let pwd = document.getElementById('pwd');
    if (!users.find(u => u.email == email.value)) {
        addUserToData(name.value, email.value, pwd.value);
        return
    }
    if (users.find(u => u.email == email.value)) {
        addMsg('email', 'msgEmail', 'Email already exists!');
    }
}

async function addUserToData(name, email, pwd) {
    let id=users.length+1;
    users.push({id: id,name: name, email: email, pwd: pwd });
    setItem('users', users);
    const data = JSON.stringify({ name: name, mail: email});
    fetch("https://join-615.developerakademie.net/php/send_mail_add_user.php",{method: 'POST',body: data});
    await initLogin();
    renderHTML('content', LoginHTML);
    showElementID('signUp');
    renderHTML('hidden', SendMailHTML);
}

function login() {
    let email = document.getElementById('email');
    let pwd = document.getElementById('pwd');
    let user = users.find(u => u.email == email.value && u.pwd == pwd.value);
    if (user) {
        safeLogin(JSON.stringify(user));
        console.log('login ok');
        window.location.href = 'pages/summary.html'+'?user='+user.id;
    }
    else {
        addMsg('pwd', 'msgPwd', 'Ups, wrong password! Try again.');
    }
}

function loginGuest() {
    // set activ User!
    window.location.href = 'pages/summary.html';
}

function safeLogin(user) {
    let save = document.getElementById('saveLogin');
    if (save.checked) {
        localStorage.setItem('User', user);
    } else {
        localStorage.removeItem('User');
    }
}

function loadLogin() {
    let user = JSON.parse(localStorage.getItem('User'));
    if (user) {
        document.getElementById('email').value = user['email'];
        document.getElementById('pwd').value = user['pwd'];
        document.getElementById('saveLogin').checked = true;
    }
}

function forgotPwd() {
    let email = document.getElementById('email');
    if (users.find(u => u.email == email.value)) {
        renderHTML('hidden', SendMailHTML);
        renderHTML('content', LoginHTML);
        showElementID('signUp');
    } else {
        addMsg('email', 'msgMail', 'Email not exist!');
    }
}

function checkState() {
    const msg = URL_PARAMS.get('msg');
    if (msg=='send_Mail'){
        renderHTML('hidden', SendMailHTML);
        hideElementID('SendMailHTML');
    }
}

async function changePassword() {
    const mail = URL_PARAMS.get('mail');
    let userID = findIndexByValue('email', mail, users);
    users[userID]['pwd']=document.getElementById('pwd').value;
    setItem('users', users);
    renderHTML('hidden', ChangePwdHTML);
    setTimeout(function() { goToStartPage(); }, 2000);
}

function goToStartPage(){
    window.location = '../index.html';
}

//------------------------------------------------

// move later to main.js!
function hideElementID(ElementID) {
    document.getElementById(ElementID).classList.add('display-none');
}
function showElementID(ElementID) {
    document.getElementById(ElementID).classList.remove('display-none');
}
function addMsg(inpID, msgID, msgString) {
    let inp = document.getElementById(inpID);
    inp.classList.add('border-wrg');
    inp.value = '';
    document.getElementById(msgID).innerHTML = msgString;
}