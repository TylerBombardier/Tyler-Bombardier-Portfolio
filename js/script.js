/*
Automatically finds the users theme preference
*/

document.documentElement.setAttribute('data-theme', 'dark');
let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

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
const cooldownTime = 700; //Cooldown In miliseconds

myButton.addEventListener("click",()=>{
    myButton.disabled = true;
    console.log("Theme Changed, Button disabled.")
    setTimeout(()=>{
        myButton.disabled = false;
        console.log("Button re-enabled.")
    },cooldownTime)
});

/*
Handles when the navbar appears on the screen
*/

window.addEventListener("scroll",()=>{
    let navbar = document.getElementById("navBar");
    let homePage = document.getElementById("homePage");

    const dropPoint = homePage.offsetHeight * 0.3; //Controls what point past the homePage reveals the navbar

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
    "aboutMe": { //Talking about myself in a friendly manner.
        header: "<h1>Myself</h1>",
        body: `
        <p>I'm a Mobile Application Development student at St. Clair College with a strong passion for puzzle-solving. 
        I enjoy transforming my ideas into interactive and functional applications that provide real value to users.
        </p>
        <br>
        <p>
        I was formally introduced to the idea of coding in high school, and it's where everything began. 
        I quickly discovered how rewarding it is to solve the puzzle-like challenges in coding and seeing my creations come to life
        on the screen and I've been hooked ever since.
        </p>
        <br>
        <p>
        When I'm not programming, you can usually find me reading a book, learning something online, or thinking about my next project.
        </p>
        `
    },
    "experience": { //Talking about my real experience in the field, the skills and experience I've gained
        header: "<h1>Experience</h1>",
        body: `
        <p>
        During my co-op placement at Code Ninja's, I helped support youth coding classes by guiding students through debugging,
         building small projects, and understanding new concepts. I worked closely with instructors to assist learners of all skill levels, 
         which strengthened my communication, teamwork, and ability to break down complex ideas into something clear and approachable.
         This experience also helped confirm what I love most about programming: problem-solving, collaboration, and creating things that work.
        </p>
        `
    },
    "skills": { //Talking about my knowledge of programming languages and my understand of internet and technology
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

function loadAboutContent(event){ //Handles gathering the data for a button press, and indexing it to the content array.
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
            // Prepare for restart
            header.classList.remove('slideIn');
            body.classList.remove('slideIn');

            // Force restart
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
Apply 3d perspective to all project cards and handle the animation
*/

let projects = document.querySelectorAll('.project');

projects.forEach(project => {
    let mouseX = 0, mouseY = 0, rotateX = 0, rotateY = 0;
    let animationFrame;

    const updateTransform = () => {
        project.style.transform = `
            perspective(2000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.05)
        `;
        project.style.boxShadow = `
            ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 73, 77, 0.7)
        `;
        animationFrame = requestAnimationFrame(updateTransform);
    };

    project.addEventListener('mousemove', e => {
        let rect = project.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        let centerX = rect.width / 2;
        let centerY = rect.height / 2;

        rotateX = ((mouseY - centerY) / centerY) * 10; //Controls rotation amplitude on the X axis
        rotateY = ((mouseX - centerX) / centerX) * -10; //Controls rotation amplitude on the Y axis

        if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateTransform);
        }
    });

    project.addEventListener('mouseleave', () => {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        project.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        project.style.boxShadow = `
            0px 0px 15px rgba(0, 73, 77, 0.7)
        `;
    });
});