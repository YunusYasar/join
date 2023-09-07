async function loadSummary(){
    checkLogIn();     
    greetingSummary(); 
}



function greetingSummary(){
    createGreetingPhrase();
    createNameGreating();
    fadeGreeting();
}


function createGreetingPhrase(){
    let timeNow = new Date().getHours();
    let greeting;
    if(5 < timeNow && timeNow < 12){
        greeting = "Good morning"
    } else if (12 <= timeNow && timeNow < 18){
        greeting = "Good Afternoon"
    } else {
        greeting = "Good Evening"
    }
    document.getElementById('summary_container_bottom_right_greeting').innerHTML = /*html*/`
        ${greeting}
    `
}


async function createNameGreating(){
        await loadUsers();
        if(currentUser == 'Gast'){
            return
        } else{
        document.getElementById('summary_container_bottom_right_Name').innerHTML = /*html*/`
        ${currentUser}
    `}
}


function fadeGreeting(){
    if (window.innerWidth < 1200) {
        
        setTimeout(function() {
            
            var container = document.getElementById("summary_container_bottom_right");
            var fadeDuration = 1000;
            var fadeInterval = 10;
            var opacity = 1;
            var deltaOpacity = 1 / (fadeDuration / fadeInterval);
            var fadeOut = setInterval(function() {
                opacity -= deltaOpacity;
                container.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(fadeOut);
                    container.style.display = "none";
                }
            }, fadeInterval);
        }, 1000);
    }
}


function openBoard(){
    window.location.href = "board.html";
}


