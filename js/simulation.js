// Create Aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body;
    Mouse = Matter.Mouse,             
    MouseConstraint = Matter.MouseConstraint;


// Create engine
var engine = Engine.create();
var world = engine.world;

// Create renderer
var render = Render.create({
    element: document.getElementById("physicsContainer"),
    engine: engine,
    options: {
        //Initalize canvas to the current window size
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});

// Create ground, ceiling, and wall variables. Initialize them to the starting window size.
var ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight + 25,
    window.innerWidth,
    50,
    { 
        isStatic: true, 
    }
);

var ceiling = Bodies.rectangle(
    window.innerWidth /2,
    -26,
    window.innerWidth,
    50,
    {
        isStatic: true,
    }
)

var leftWall = Bodies.rectangle(
    -25,
    window.innerHeight /2,
    50,
    window.innerHeight,
    {
        isStatic: true,
    }
)

var rightWall = Bodies.rectangle(
    window.innerWidth + 26,
    window.innerHeight / 2,
    50,
    window.innerHeight,
    {
        isStatic: true,
    }
)

Composite.add(world, [ground, ceiling, leftWall, rightWall]); //Add ground, ceiling, and walls.

// Resize handling for all static boundary elements and canvas
function resizeSimulation() {
    // Resize the canvas element to fit the new width and height
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    //Reposition ground
    Body.setPosition(ground, {
        x: window.innerWidth / 2,
        y: window.innerHeight + 25
    });

    //Reposition left wall
    Body.setPosition(leftWall, {
        x: -25,
        y: window.innerHeight /2,
    });

    //Reposition right wall
    Body.setPosition(rightWall, {
        x: window.innerWidth + 26,
        y: window.innerHeight / 2,
    });

    //Reposition ceiling
    Body.setPosition(ceiling, {
        x: window.innerWidth /2,
        y: -26,
    });

    // Scale the ceiling and ground to the new width
    let currentWidth = ground.bounds.max.x - ground.bounds.min.x;
    let scaleX = window.innerWidth / currentWidth;
    Body.scale(ground, scaleX, 1);
    Body.scale(ceiling, scaleX, 1);

    // Scale the left and right wall to the new height
    let currentHeight = leftWall.bounds.max.y - leftWall.bounds.min.y;
    let scaleY = window.innerHeight / currentHeight;
    Body.scale(leftWall, scaleY, 1);
    Body.scale(rightWall, scaleY, 1);
}

//Creates a bouncy circle
function addCircle(radius, weight){
    let position = randomPosition(0+radius,window.innerWidth-radius,0+radius,window.innerHeight-radius)
    let circle = Bodies.circle(
        position.rangeX,
        position.rangeY,
        radius,
        {                    
            restitution: 0.5, //Controls bounce level
            density: weight / (Math.PI * Math.pow(radius,2)),
            render: { fillStyle: 'rgba(118, 228, 255, 1)' },
        }
    )
    Composite.add(world, circle);
}

function randomPosition(minBoundX, maxBoundX, minBoundY, maxBoundY){
    let rangeX = Math.max(Math.random()*maxBoundX,minBoundX);
    let rangeY = Math.max(Math.random()*maxBoundY,minBoundY);
    return {rangeX,rangeY};
}

//Calculates the blast's effect on all objects in the scene
function applyBlast(x, y, isRepulsive){
    let blastRadius = 1000;
    let blastStrength = 0.09;

    Composite.allBodies(world).forEach(shape => {
        if(!shape.isStatic){
            let dx = shape.position.x - x;
            let dy = shape.position.y - y;
            let distanceTotal = Math.sqrt(dx*dx+dy*dy);

            if(distanceTotal < blastRadius){
                let forceCurve = blastStrength * (Math.pow(1 - distanceTotal/blastRadius,2));

                let force = {
                    x: (dx / distanceTotal) * forceCurve,
                    y: (dy / distanceTotal) * forceCurve
                };

                if(!isRepulsive){
                    force.x *= -1;
                    force.y *= -1;
                }

                Body.applyForce(shape, shape.position, force);

                console.log(
                    `Applying ${isRepulsive ? 'repel' : 'attract'}:`,
                    force.x.toFixed(4),
                    force.y.toFixed(4)
                );

            }
        }
    });
}

let isTouching = false;
let currentButton = 0;
let posX = 0;
let posY = 0;

//Track if screen has been touched
document.getElementById("homePage").addEventListener("touchstart", e=>{
    isTouching = true;
    currentButton = 0; //Assume attraction, mobile doesn't have left or right click

    //start position defaults to 0 if this isn't here on first touch
    posX = e.touches[0].pageX;
    posY = e.touches[0].pageY;
})

//Tracks the position of touch
document.getElementById("homePage").addEventListener("touchmove", e=>{
    posX = e.touches[0].pageX;
    posY = e.touches[0].pageY;
})

document.getElementById("homePage").addEventListener("touchend",e=>{
    isTouching = false;
})

//Tracks the mouse's position on the page
document.getElementById("homePage").addEventListener("mousemove", e => {
    posX = e.pageX;
    posY = e.pageY;
});

//Tracks if a mouse button is being held down
document.getElementById("homePage").addEventListener("mousedown", e=>{
    e.preventDefault();
    isTouching = true;
    currentButton = e.button;
});

//Tracks if a mouse button has stopped being held down
document.getElementById("homePage").addEventListener("mouseup", e=>{
    e.preventDefault();
    isTouching = false;
});

// Prevents the context menu from appearing on the home page on a right click
document.getElementById("homePage").addEventListener('contextmenu', e => {
    e.preventDefault();
}, true);

//Function plays every frame for continous blasts if you hold down the mouse buttons
function blastLoop(){
    if(isTouching){ //Only applies blast when mouse is clicked
        if(currentButton === 0){
            applyBlast(posX,posY,false);
        } else if (currentButton === 2){
            applyBlast(posX,posY,true);
        }
    }
    requestAnimationFrame(blastLoop);
}

blastLoop();

//Spawns i number iterations of circles
for(let i = 0; i < 200; i++){
    addCircle(10,10)
}

//Checks for any resizing of the window, calls resize static elements function
window.addEventListener('resize', resizeSimulation);
resizeSimulation();

// Run the renderer and engine
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);