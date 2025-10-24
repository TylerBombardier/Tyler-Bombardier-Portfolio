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
        header: "<h1>Myself</h1>",
        body: `
        <p>I'm a Mobile Application Development student at St. Clair College with a strong passion for puzzle-solving. 
        I enjoy transforming my ideas into interactive and functional applications that provide real value to users.
        </p>
        <br>
        <p>
        I was formally introduced to the idea of coding in high school, and it's where everything began. 
        I quickly discovered how rewarding it is to solve the puzzle-like challenges in coding and seeing my creations come to life
        on the screen and I’ve been hooked ever since.
        </p>
        <br>
        <p>
        When I'm not programming, you can usually find me reading a book, learning something online, or thinking about my next project.
        </p>
        `
    },
    "education": {
        header: "<h1>Learning</h1>",
        body: `
        <p>My educational life gave me a strong foundation in technology, business, and problem-solving skills:</p>
        <ul>
            <li><strong>Languages:</strong></li>
        </ul>
        `
    },
    "skills": {
        header: "<h1>My Skills</h1>",
        body: `
        <p>
        </p>
        `
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

/*
Plays slide in animation upon menu item click each time
*/

let header = document.querySelector('#aboutContentHeader');
let body = document.querySelector('#aboutContentBody');
let buttons = document.querySelectorAll('.menu-item');

let activeBtn = null;

buttons.forEach(btn => {
    btn.addEventListener('click', e => {
        if(btn !== activeBtn){
            header.classList.remove('slideIn');
            body.classList.remove('slideIn');

            // Trigger reflow (forces restart)
            void header.offsetWidth;
            void body.offsetWidth;

            // Add class back
            header.classList.add('slideIn');
            body.classList.add('slideIn');

            activeBtn = btn;
        }
    });
});

/*
Handles the logic for displaying the hero page content
*/