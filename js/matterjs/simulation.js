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
        background: 'transparent',
        airFriction: 0
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
        y: window.innerHeight + 25.4
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

//Variable trackers for all the methods
let isTouching = false;
let currentButton = 0;
let applyBlastX = 0;
let applyBlastY = 0;
let lastScrollY = window.scrollY;
let scrollDifference = 0;

function applyScrollForce() {
    if (Math.abs(scrollDifference) > 1) { // Small threshold to ignore tiny jitters
        let scrollVelocity = scrollDifference * 0.0008; // tune this for sensitivity

        Composite.allBodies(world).forEach(shape => {
            if (!shape.isStatic) {
                Body.applyForce(shape, shape.position, { 
                    x: 0, 
                    y: scrollVelocity*-1 //Invert so scrolling down pushes the balls up and vice versa
                });

                console.log(
                    `Applying Scroll Force:`,
                    (scrollVelocity*-1).toFixed(4),
                );
            }
        });
    }

    scrollDifference *= 0.2; //Apply gradual dampening so force applies decreases overtime

    requestAnimationFrame(applyScrollForce);
}

applyScrollForce();

//Creates a circle of desired size and weight
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

//Calculates a random position within the screen bounds
function randomPosition(minBoundX, maxBoundX, minBoundY, maxBoundY){
    let rangeX = Math.max(Math.random()*maxBoundX,minBoundX);
    let rangeY = Math.max(Math.random()*maxBoundY,minBoundY);
    return {rangeX,rangeY};
}

//Calculates the blast's effect on all objects in the scene
function applyCursorForce(x, y, isRepulsive){
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

//Function plays every frame for continous blasts if you hold down the mouse buttons
function blastLoop(){
    if(isTouching){ //Only applies blast when mouse is clicked
        if(currentButton === 0){
            applyCursorForce(applyBlastX,applyBlastY,false);
        } else if (currentButton === 2){
            applyCursorForce(applyBlastX,applyBlastY,true);
        }
    }
    requestAnimationFrame(blastLoop);
}

blastLoop();

function biasedRandom(min, max, power) {
  let skewedRandom = Math.pow(Math.random(), power);
  return min + (max - min) * skewedRandom;
}

// Detect scroll, calculate scroll difference, add diffence to offset applyblast location.
window.addEventListener('scroll', () => {
    scrollDifference = window.scrollY - lastScrollY;
    applyBlastY += scrollDifference; //Offsets applyblastY position to account for scrolling

    lastScrollY = window.scrollY;
});

window.addEventListener("mousemove", e => {
    applyBlastX = e.pageX;
    applyBlastY = e.pageY;
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

//Spawns i number iterations of circles
for(let i = 0; i < 30; i++){
    addCircle(biasedRandom(15,100,30),10)
}

//Checks for any resizing of the window, calls resize static elements function
window.addEventListener('resize', resizeSimulation);
resizeSimulation();

// Run the renderer and engine
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);