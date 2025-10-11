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

let myButton = document.getElementById("themeToggle");
const cooldownTime = 700; //In miliseconds

myButton.addEventListener("click",()=>{
    myButton.disabled = true;
    console.log("Theme Changed, myButton disabled.")
    setTimeout(()=>{
        myButton.disabled = false;
        console.log("myButton re-enabled.")
    },cooldownTime)
})