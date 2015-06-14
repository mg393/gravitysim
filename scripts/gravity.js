//Physics constants and functions
var G = 6.675e-11;
var objects = [];
var distScale = 1000000; //One pixel = 1000km or 1000000m
var massScale = 1000000000000000000000000; //One arbitrary mass unit = 1e23kg

function calcForce(mass1, mass2, distance) {
    return ((G * mass1 * distScale * mass2 * distScale) / Math.pow(distance, 2));
}

function calcDistance(o1, o2) {
    return (distScale * (Math.sqrt(Math.pow((o1.x + o2.x), 2) + Math.pow((o1.y + o2.y), 2))));
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

//Main code
function object(r, m, x, y, hv, vv, ha, va) //r = radius, m = mass, x = x coord, y = y coord, hv = horizontal velocity, vv = vertical velocity, ha = horizontal acceleration, va = vertical acceleration
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

function simulation(c, cc, o, t) //c = canvas, cc = chart, o = objects, t = time between steps
{
    this.canvas = c;
    this.steptime = t;
    console.log("pants");
    this.step = function() {
        for (var i = 0; i < o.length; i++) {
            var totalVAcc = 0;
            var totalHAcc = 0;

            //Gravity force calcs
            for (var j = 0; j < o.length; j++) {
                var force = calcForce(o[j].mass * massScale, o[i].mass * massScale, calcDistance(o[j], o[i]) * distScale);
                var forceX = calcXforce(calcAngle(o[i], o[j]), force);
                var forceY = calcYforce(calcAngle(o[i], o[j]), force);
                totalVAcc += calcAcc(forceX, o[i].mass * massScale);
                totalHAcc += calcAcc(forceY, o[i].mass * massScale);
            }

            o[i].hacceleration = totalHAcc;
            o[i].vacceleration = totalVAcc;

            //Speed and displacement calcs
            //v = u + at
            var hvel = o[i].hvelocity + o[i].hacceleration*this.steptime;
            var vvel = o[i].vvelocity + o[i].vacceleration*this.steptime;

            var hacc = o[i].hacceleration;
            var vacc = o[i].vacceleration;

            //S = ut + 0.5at^2
            var hdistance = hvel * this.steptime + 0.5 * hacc * Math.pow(this.steptime, 2);
            var vdistance = vvel * this.steptime + 0.5 * vacc * Math.pow(this.steptime, 2);

            o[i].x += hdistance / distScale;
            o[i].y += vdistance / distScale;
            console.log(o[i].x + " " + o[i].y);

            if (graphWriteCount >= 10 && o[i].ID === 0) {
                cc.addData([o[i].x], labelCount);
                if (labelCount >= 600) {
                    cc.removeData();
                }
                graphWriteCount = 0;
            }
        }

        //Add 1 to counts
        graphWriteCount++;
        labelCount++;

        //Draw function. Needs to be last
        draw(c, o);
    };
}

function draw(c, o) //C = canvas, o = objects (array)
{
    var context = c.getContext("2d");

    //Clear old stuff:
    context.clearRect(0, 0, c.width, c.height);

    //Loop through objects
    for (var i = 0; i < o.length; i++) {
        context.fillStyle = o[i].colour;
        context.strokeStyle = o[i].colour;
        context.beginPath();
        context.arc(o[i].x, o[i].y, o[i].radius, 0, 2 * Math.PI);
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
    chartCanvas = document.getElementById("chartCanvas");
    chartContext = chartCanvas.getContext("2d");

    var mainChart = new Chart(chartContext).Line(chartData);

    //r, m, x, y, hv, vv, ha, va
    var testObject = new object(20, 20, 500, 150, 100000, 100000, 10, 10);
    var testObject2 = new object(10, 10, 100, 150, -50000, -50000, 10, 10);
    var testObject3 = new object(15, 10, 550, 550, -60000, -60000, 10, 10);

    var testObjects = [testObject, testObject2, testObject3];
    mainsim = new simulation(canvas, mainChart, testObjects, 5);
    window.requestAnimationFrame(function() {
        mainloop(mainsim);
    });

};
