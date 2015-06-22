//Physics constants and functions
var G = 6.675e-11;
var bodies = [];

function calcForce(mass1, mass2, distance) {
    return ((G * mass1 * mass2) / Math.pow(distance, 2));
}

function calcDistance(dx, dy) {
    console.log("dX: " + dx + " dY: " + dy);
    dx = parseInt(dx);
    dy = parseInt(dy);
    return (Math.sqrt(dx*dx - dy*dy));
}

function calcAcc(force, mass) {
    return (force / (mass));
}

function calcAngle(o1, o2) {
    var dX = o1.x - o2.x;
    var dY = o1.y - o2.y;
    return (Math.atan2(dX, dY) * 180 / Math.PI);
}

function calcXforce(angle, force) {
    return (Math.sin(angle) * force);
}

function calcYforce(angle, force) {
    return (Math.cos(angle) * force);
}

//Other global variables
var IDcount = 0;
var chartData = {
    labels: [],
    datasets: [{
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
    }, ]
};
var graphWriteCount = 0;
var labelCount = 0;
var paused = false;

//Other functions
function addBody(x, y) {
    //r, m, x, y, hv, vv, ha, va
    var newBody = new body(10, 1000, x, y, 0.4, 0.4, 0, 0);
    bodies.push(newBody);
}

function getPosition(canvas) {
    var x = event.x;
    var y = event.y;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    addBody(x, y);
}

function clearBodies() {
    bodies.length = 0;
}

//Main code
function body(r, m, x, y, hv, vv, ha, va) //r = radius, m = mass, x = x coord, y = y coord, hv = horizontal velocity, vv = vertical velocity, ha = horizontal acceleration, va = vertical acceleration
{
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.hvelocity = hv;
    this.vvelocity = vv;
    this.hacceleration = ha;
    this.vacceleration = va;
    this.colour = Please.make_color()[0];
    this.ID = IDcount;
    IDcount++;
}

function simulation(c, cc, b, t) //c = canvas, cc = chart, b = bodies, t = time between steps
{
    this.canvas = c;
    this.steptime = t;
    console.log("pants");
    this.step = function() {
        if (paused == false) {
            for (var i = 0; i < b.length; i++) {
                var totalVAcc = 0;
                var totalHAcc = 0;

                //Gravity force calcs
                for (var j = 0; j < b.length; j++) {
                  if(i != j) {
                    var dX = b[i].x - b[j].x;
                    var dY = b[i].y - b[j].y;
                    var force = calcForce(b[j].mass, b[i].mass, calcDistance(dX, dY));
                    var forceX = calcXforce(calcAngle(b[i], b[j]), force);
                    var forceY = calcYforce(calcAngle(b[i], b[j]), force);
                    totalVAcc += calcAcc(forceX, b[i].mass);
                    totalHAcc += calcAcc(forceY, b[i].mass);

                    console.log(b[i].ID + " " + b[j].ID);
                    console.log("Angle: " + calcAngle(b[i], b[j]));
                    console.log("Distance: " + calcDistance(b[i], b[j]));
                    console.log("X component = " + forceX + ", Y component = " + forceY);
                    if (graphWriteCount >= 10 && b[i].ID == 0) {
                        cc.addData([1], labelCount);
                        if (labelCount >= 600) {
                            cc.removeData();
                        }
                        graphWriteCount = 0;
                    }
                }
                }

                b[i].hacceleration = totalHAcc;
                b[i].vacceleration = totalVAcc;

                //Speed and displacement calcs
                var hvel = b[i].hvelocity;
                var vvel = b[i].vvelocity;

                var hacc = b[i].hacceleration;
                var vacc = b[i].vacceleration;

                //S = ut + 0.5at^2
                var hdistance = hvel * this.steptime + 0.5 * hacc * Math.pow(this.steptime, 2);
                var vdistance = vvel * this.steptime + 0.5 * vacc * Math.pow(this.steptime, 2);

                //v = u + at
                b[i].hvelocity = hvel + b[i].hacceleration * this.steptime;
                b[i].vvelocity = vvel + b[i].vacceleration * this.steptime;

                b[i].x += hdistance;
                b[i].y += vdistance;
            }

            //Add 1 to counts
            graphWriteCount++;
            labelCount++;
        }
        //Draw function. Needs to be last
        draw(c, b);
    };
}

function draw(c, b) //C = canvas, b = bodies (array)
{
    var context = c.getContext("2d");

    //Clear old stuff:
    context.clearRect(0, 0, c.width, c.height);

    //Loop through bodiess
    for (var i = 0; i < b.length; i++) {
        context.fillStyle = b[i].colour;
        context.strokeStyle = b[i].colour;
        context.beginPath();
        context.arc(b[i].x, b[i].y, b[i].radius, 0, 2 * Math.PI);
        context.lineWidth = 1;
        context.fill();
        context.stroke();
    }
}

function mainloop(sim) //sim = a simulation
{
    try {
        sim.step();
    } catch (e) {
        console.log(e);
    }

    window.requestAnimationFrame(function() {
        mainloop(sim);
    });
}

window.onload = function() {
    canvas = document.getElementById("canvas");

    canvas.addEventListener("mousedown", function(event) {
        getPosition(canvas);
    }, false);
    chartCanvas = document.getElementById("chartCanvas");
    chartContext = chartCanvas.getContext("2d");

    var mainChart = new Chart(chartContext).Line(chartData);

    //r, m, x, y, hv, vv, ha, va
    var testBody = new body(15, 1500, 200, 150, 0.0, 0, 0, 0);
    var testBody2 = new body(15, 1500, 600, 250, 0.0, 0, 0, 0);

    bodies.push(testBody);
    bodies.push(testBody2);
    mainsim = new simulation(canvas, mainChart, bodies, 5);
    window.requestAnimationFrame(function() {
        mainloop(mainsim);
    });

};
