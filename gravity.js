//Physics constants and functions
var G = 6.675e-11
var objects = [];

function object(r, m, x, y, h, v) //r = radius, m = mass, x = x coord, y = y coord, h = horizontal velocity, v = vertical velocity
{
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.hvelocity = h;
    this.vvelocity = v;
}

function simulation(c, o) //c = canvas, o = objects 
{
    this.canvas = c;
    this.step = function(){
    
        //this.draw(c, o); //need to be last
    }
}

function calcForce(mass1, mass2, distance)
{
    return ((G*mass1*mass2)/distance^2)
}

//Page functions
function draw(c, o) //C = canvas, o = objects (array)
{
    var canvas = c;
    var context = canvas.getContext("2d");
    context.fillStyle="pink";
    context.strokeStyle="pink"
    context.beginPath();
    context.arc(o.x, o.y, o.radius, 0, 2*Math.PI);
    context.lineWidth = 1;
    context.fill();
    context.stroke();
    //Some kind of interation through objects here while drawing them
}

function mainloop(sim) //sim = a simulation
{
    sim.step();
    setTimeout('mainloop()', 35);
}

window.onload = function()
{   
    canvas = document.getElementById("mainCanvas");
    var testObject = new object(6, 50, 100, 100, 10, 10);
    draw(canvas, testObject);
    //TODO: find a way to get mouse x and y from canvas click
    mainsim = new simulation(canvas);
    while (true) //The main simulation loop
    {
        //mainloop(mainsim);
        return false;
    }
}