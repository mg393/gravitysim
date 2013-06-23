//Physics constants and functions
var G = 6.675e-11
var objects = [];

function object (r, m) //r = radius, m = mass
{
    this.radius = r;
    this.mass = m;
}

function simulation(c, o) //c = canvas, o = objects 
{
    this.canvas = c;
    this.step = function(){
        this.draw(c, o);
    }
}

function calcForce(mass1, mass2, distance)
{
    return ((G*mass1*mass2)/distance^2)
}

//Page functions
function draw(c, o) //C = canvas, o = objects (array)
{
    //Some kind of interation through objects here while drawing them
}

function mainloop(sim) //sim = a simulation
{
    sim.step();
    setTimeout('mainLoop()', 35);
}

window.onload = function()
{   
    canvas = document.getElementById("mainCanvas");
    mainsim = new simulation(canvas);
    while (true) //The main simulation loop
    {
        mainloop(mainsim);
        return false;
    }
}