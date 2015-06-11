//Physics constants and functions
var G = 6.675e-11
var objects = [];
var scale = 1000000; //One pixel = 1000km or 1000000m

function object(r, m, x, y, hv, vv, ha, va) //r = radius, m = mass, x = x coord, y = y coord, hv = horizontal velocity, vv = vertical velocity, ha = horizontal acceleration, va = vertical acceleration
{
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.hvelocity = hv;
    this.vvelocity = vv;
    this.hacceleration = ha;
    this.vaccereeration = va;
}

function simulation(c, o, t) //c = canvas, o = objects, t = time between steps
{
    this.canvas = c;
    this.objects = o;
    this.steptime = t;
    console.log("pants");
    this.step = function(){ //use S = ut + 0.5at^2
        var hvel = o.hvelocity;
        var vvel = o.vvelocity;
        var hacc = o.hacceleration;
        var vacc = o.vacceleration;

        var hdistance = hvel*this.steptime + 0.5*hacc*(this.steptime^2);
        var vdistance = vvel*this.steptime + 0.5*vacc*(this.steptime^2);

        o.x += hdistance / scale;
        o.y += vdistance / scale;
        draw(c, o); //needs to be last
    }
}

function calcForce(mass1, mass2, distance)
{
    return ((G*mass1*mass2)/distance^2)
}

//Page functions
var finished = false;

function draw(c, o) //C = canvas, o = objects (array)
{
    var canvas = c;
    var context = canvas.getContext("2d");
    context.fillStyle="pink";
    context.strokeStyle="pink";
    context.beginPath();
    context.arc(o.x, o.y, o.radius, 0, 2*Math.PI);
    context.lineWidth = 1;
    context.fill();
    context.stroke();
    //Some kind of interation through objects here while drawing them
}

function mainloop(sim) //sim = a simulation
{
    try {
      sim.step();
    } catch(e) {
      console.log("yolo swaggins");
    }
    setTimeout('mainloop()', 30);
}

window.onload = function() {
    canvas = document.getElementById("mainCanvas");
    var testObject = new object(6, 50, 100, 100, 10, 10, 1, 1);
    //TODO: find a way to get mouse x and y from canvas click
    mainsim = new simulation(canvas, testObject, 5);
    var intervalID = window.setInterval(mainloop(mainsim), 30);

}
