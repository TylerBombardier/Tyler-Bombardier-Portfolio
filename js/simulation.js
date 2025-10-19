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

// Create Ground to the size of the window
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

// Resize handling for ground and canvas
function resizeSimulation() {
    // Resize canvas to fit the new width and height
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    // Reposition the ground to the new center
    Body.setPosition(ground, {
        x: window.innerWidth / 2,
        y: window.innerHeight + 25
    });

    // Scale the ground’s width to match new window width
    var currentWidth = ground.bounds.max.x - ground.bounds.min.x;
    var scaleX = window.innerWidth / currentWidth;
    Body.scale(ground, scaleX, 1);
}

//Creates a bouncy circle
function addShape(){
    var circle = Bodies.circle(
        window.innerWidth / 2,
        window.innerHeight - 100,
        50,
        {                    
            restitution: 1.1, //Controls bounce level
            render: { fillStyle: '#4af' },
            frictionAir: 0.01
        }
    )
    Composite.add(world, circle);
}

function applyBlast(x, y, isRepulsive){
    let blastRadius = 1000;
    let blastStrength = 0.06;

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

let isMouseDown = false;
let currentButton = 0;
let mouseX = 0;
let mouseY = 0;

//Tracks the mouse's position
document.getElementById("homePage").addEventListener('mousemove', e => {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

//Update mouse status to clicked
document.getElementById("homePage").addEventListener("mousedown", e=>{
    isMouseDown = true;
    currentButton = e.button;
});

//Update mouse status to unclicked
document.getElementById("homePage").addEventListener("mouseup", e=>{
    isMouseDown = false;
});

// Prevents the context menu from appearing on the home page
document.getElementById("homePage").addEventListener('contextmenu', e => {
    e.preventDefault();
}, true);

//Function plays every frame for continous blasts if you hold down the mouse buttons
function blastLoop(){
    if(isMouseDown){
        if(currentButton === 0){
            applyBlast(mouseX,mouseY,false);
        } else if (currentButton === 2){
            applyBlast(mouseX,mouseY,true);
        }
    }
    requestAnimationFrame(blastLoop);
}

blastLoop();

addShape();

window.addEventListener('resize', resizeSimulation);
resizeSimulation();

// Run the renderer and engine
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);