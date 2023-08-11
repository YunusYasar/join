// constants
const STORAGE_TOKEN = 'ZC2Y587W1PWRYY1WEBT2KNWJKKLT0W9EU32TPB2B';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const URL_PARAMS = new URLSearchParams(window.location.search);
const USER = URL_PARAMS.get('user');


let activeTab;
let contactListSorted = [];
let tasks = [];
let groups = [];

let dummyTasks = [
    {
        title: 'Test1',
        group: 'Sales',
        descr: 'ushliuhkjahfkj',
        users: ['antom@yahoo.de','simon.huber@gmail.com'],
        prio: 1,                                     // 0=low 1=medium 2=high
        deadline: '2023-07-07',
        created: '13.07.2023',
        condit: 0,                                  // 0=ToDo 1=InProgress 2=AwaitingFeedback 3=Done
        subTask: [
            {
                descr: '212121',
                state: 0,
            },
            {
                descr: 'jhghjk',
                state: 1,
            }

        ]
    },
    {
        title: 'Test2',
        group: 'Backoffice',
        descr: 'lhdjlqkjdqldjjhiqwdoiqziowdlqlkdwhlqhd',
        users: ['johndoe@yahoo.de', 'julia.maier@yahoo.de'],
        prio: 1,                                     // 0=low 1=medium 2=high
        deadline: '2023-07-11',
        created: '11.07.2023',
        condit: 1,                                  // 0=ToDo 1=InProgress 2=AwaitingFeedback 3=Done
        subTask: [
            {
                descr: '212121',
                state: 0,
            },
            {
                descr: 'jhghjk',
                state: 1,
            },
            {
                descr: '212121',
                state: 1,
            },
            {
                descr: 'jhghjk',
                state: 1,
            }]
    },
    {
        title: 'Test3',
        group: 'Design',
        descr: 'lhdjlqkscascascacsascjdqldjjhiqwdoiqziowdlqlkdwhlqhd',
        users: ['sabrina.berger@web.de', 'sarahw@gmail.com','johndoe@yahoo.de', 'julia.maier@yahoo.de'],
        prio: 2,                                     // 0=low 1=medium 2=high
        deadline: '2023-07-14',
        created: '10.07.2023',
        condit: 2,                                  // 0=ToDo 1=InProgress 2=AwaitingFeedback 3=Done
        subTask: []
    }
];

let dummyGroups =[
    {
        name:'Design',
        color:'#ff7a00',
    },
    {
        name:'Sales',
        color:'#fc71ff',
    },
    {
        name:'Backoffice',
        color:'#1fd7c1',
    },
    {
        name:'Media',
        color:'#ffc701',

    },
    {
        name:'Marketing',
        color:'#0038ff',
    },
]

// common used funcitons

async function init(tabID) {
    await includeHTMLasync();
    contactListSorted = await getItem('contacts');
    tasks = await getItem('tasks');
    groups =  await getItem('groups');
    setActiveMenuTab(tabID);
    activeTab = tabID;
    setHeaderUserData();
    setTabLink(USER);//getURLparam());
}


function showElement(ID, event) {
    if(event){event.stopPropagation()};
    for (let i = 0; i < ID.length; i++) {
        document.getElementById(ID[i]).classList.remove('display-none');
    }
}


function hideElement(ID) {
    for (let i = 0; i < ID.length; i++) {
        document.getElementById(ID[i]).classList.add('display-none');
    }
}


function showOvlyCard(cardHTML) {
    document.getElementById('ovlyCard').classList.add('showovlyCard');
    document.getElementById('ovly').classList.add('showovly');
    document.getElementById('ovlyCard').innerHTML = cardHTML;
}


function hideOvlyCard() {
    if (document.getElementById('ovlyCard')) {
        document.getElementById('ovlyCard').classList.remove('showovlyCard');
        document.getElementById('ovly').classList.remove('showovly');
    }
}


function stopHideElement(event) {
    event.stopPropagation();
}


/*
function getURLparam(){
    let URLparam = new URLSearchParams(window.location.search);
    let userID = URLparam.get('user');
    return userID;
}
*/


function getContactInitials(name){
    let separatedName = name.split(" ");
    return separatedName[0][0] + separatedName[1][0];
}

function findIndexByValue(ValueToSearch, valueToFind, dataArray) {
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i][ValueToSearch] == valueToFind) {
        return i;
      }
    }
    return -1; // Wenn die Emailadresse nicht gefunden wurde, wird -1 zurÃ¼ckgegeben
  }

// menu related functions

function setActiveMenuTab(tabID) {
    let tabIDs = ['tabsummary', 'tabboard', 'tabaddtask', 'tabcontacts', 'tabimpressum'];
    for (let i = 0; i < 5; i++) {
        document.getElementById(tabIDs[i]).classList.remove('active');
    }
    if (tabID) {
        document.getElementById(tabID).classList.add('active');
    }
}


function setTabLink(userID){
    if (userID) {
        document.getElementById('tabsummary').setAttribute('href',`../pages/summary.html?user=${userID}`);
        document.getElementById('tabboard').setAttribute('href',`../pages/board.html?user=${userID}`);
        document.getElementById('tabaddtask').setAttribute('href',`../pages/addtask.html?user=${userID}`);
        document.getElementById('tabcontacts').setAttribute('href',`../pages/contacts.html?user=${userID}`);
    }
}


// header related functions

function logout(event) {
    stopHideElement(event);
}


async function setHeaderUserData(){
    let userID = USER; //getURLparam();
    if (userID) {
        let users = await getItem('users');
        let user = users.filter(u=>u['id']==userID);
        if (user.length != 0 ){
            let initials = getContactInitials(user[0]['name']);
            document.getElementById('headerInitials').innerHTML = initials;
        }else{
            console.warn('userID not found');
        }
    } else {
        document.getElementById('headerInitials').innerHTML = 'Guest';
    }
}


// server relatede functions
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}


async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    let response = await fetch(url).then(res => res.json());
    response = response['data']['value'].replace(/\'/g,'"'); // answer from server in case of JSON array not correct
    return JSON.parse(response);
}