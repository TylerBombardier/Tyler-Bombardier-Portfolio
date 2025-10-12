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