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
    "aboutMe": {
        header: "<h1>About Me</h1>",
        body: `
        <p>I'm a Mobile Application Development student St. Clair College with a passion for building unique and challenging projects.</p>
        <p>
        I've always been a technically oriented person, 
        using command blocks and redstone in minecraft,
        learning how games are made and how they function, it's always been a source of fascination for me.
        </p>
        <p>
        Once I started highschool, I was finally given the oppurtunity to get taught how to program. 
        Which is where everything started and I learned that coding was an exhilarating type of experience for me,
        I loved the feeling of creating a program and seeing it come to life.
        </p>
        `
    },
    "education": {
        header: "<h1>Education</h1>",
        body: `
        <p>My history shows a deep level of experience in technoloy, business, and people skills:</p>
        <ul>
            <li>Graduated with honors</li>
            <li>Awarded Riverside Secondary Citizenship Award</li>
            <li>Specialized High Skills Major in Business & Technology</li>
            <li>Co-Op Placement: Code Ninja's</li>
        </ul>
        `
    },
    "skills": {
        header: "<h1>My Skills</h1>",
        body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
    }
};

let aboutMenuButtons = document.querySelectorAll(".menu-item");
let aboutContentHeader = document.getElementById("aboutContentHeader");
let aboutContentBody = document.getElementById("aboutContentBody");

aboutContentHeader.innerHTML = contentData["aboutMe"].header;
aboutContentBody.innerHTML = contentData["aboutMe"].body;

function loadAboutContent(event){
    let buttonClickedName = event.target.closest(".menu-item").id;
    let content = contentData[buttonClickedName];
    if (content) {
        if(content.header != aboutContentHeader.innerHTML){
            aboutContentHeader.innerHTML = content.header;
            aboutContentBody.innerHTML = content.body;
        }
    } else {
        aboutContentHeader.innerHTML = "Not Found";
        aboutContentBody.innerHTML = "<p>Content not found</p>";
    }
}

aboutMenuButtons.forEach(button => {
    button.addEventListener("click",loadAboutContent)
});

let header = document.querySelector('#aboutContentHeader');
let body = document.querySelector('#aboutContentBody');
let buttons = document.querySelectorAll('.menu-item'); // replace with your button

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        header.classList.remove('slideIn');
        body.classList.remove('slideIn');

        // Trigger reflow (forces restart)
        void header.offsetWidth;
        void body.offsetWidth;

        // Add class back
        header.classList.add('slideIn');
        body.classList.add('slideIn');
    });
});

console.log(buttons, header, body);

/*
Handles the logic for displaying the hero page content
*/