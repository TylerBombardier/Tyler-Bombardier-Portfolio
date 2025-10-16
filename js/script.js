/*
Handles changing the html tag for site theme transitions
*/
let root = document.documentElement;
let toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", ()=>{
    let current = root.getAttribute("data-theme");
    if(current === "light"){
        root.setAttribute("data-theme","dark");
    }
    else{
        root.setAttribute("data-theme","light");
    }
});

/*
Creates a cooldown for clicking the switch theme button
*/
let myButton = document.getElementById("themeToggle");
const cooldownTime = 700; //In miliseconds

myButton.addEventListener("click",()=>{
    myButton.disabled = true;
    console.log("Theme Changed, myButton disabled.")
    setTimeout(()=>{
        myButton.disabled = false;
        console.log("myButton re-enabled.")
    },cooldownTime)
});

/*
Handles the drop down of the navbar
*/

window.addEventListener("scroll",()=>{
    let navbar = document.getElementById("navBar");
    let homePage = document.getElementById("homePage");

    const dropPoint = homePage.offsetHeight * 0.7;

    if(window.scrollY >= dropPoint){
        navbar.classList.add("visible");
    } else {
        navbar.classList.remove("visible")
    }
});

/*
Loads content into the about page on a button press
*/

let contentData = {
    "About Me": {
        header: "<h1>About Me</h1>",
        body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
    },
    "Education": {
        header: "<h1>Education</h1>",
        body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
    },
    "My Skills": {
        header: "<h1>My Skills</h1>",
        body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
    }
};

let aboutMenuButtons = document.querySelectorAll('.menu-item');
let aboutContentHeader = document.getElementById("aboutContentHeader");
let aboutContentBody = document.getElementById("aboutContentBody");

function loadAboutContent(event){
    let buttonClickedName = event.target.textContent.trim();
    let content = contentData[buttonClickedName];
    if (content) {
        aboutContentHeader.innerHTML = content.header;
        aboutContentBody.innerHTML = content.body;
    } else {
        aboutContentBody.innerHTML = "<p>Content not found</p>";
    }
}

aboutMenuButtons.forEach(button => {
    button.addEventListener("click",loadAboutContent)
});