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
            restitution: 1.6, //Controls bounce level
            render: { fillStyle: '#4af' }
        }
    )
    Composite.add(world, circle);
}

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

Composite.add(world, ground); //Add ground & Mouse

addShape();

window.addEventListener('resize', resizeSimulation);
resizeSimulation();

// Run the renderer and engine
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);