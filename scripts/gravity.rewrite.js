//Config
math.config({
    number: 'bignumber', // Default type of number: 'number' (default) or 'bignumber'
    precision: 30 // Number of significant digits for BigNumbers
});

//Physics constants and functions
var G = new math.bignumber('6.675e-11');
var bodies = [];
var scale = new math.bignumber('1000000'); //One pixel = 1000km or 1000000m

function calcTotalForce(mass1, mass2, distance) { //For graphing rather than actual calcs
    return (math.multiply((math.multiply(mass1, mass2)), G) / math.pow(distance, 2));
}

function calcXForce(b1, b2) {
    var diffX = math.subtract(b1.x, b2.x);
    var xForce = math.multiply((math.multiply(b1.mass, b2.mass)), G) / math.pow(diffX, 2);

    return xForce;
}

function calcYForce(b1, b2) {
    var diffY = math.subtract(b1.y, b2.y);
    var yForce = math.multiply((math.multiply(b1.mass, b2.mass)), G) / math.pow(diffY, 2);

    return yForce;
}

function calcDistance(dx, dy) {
    return math.sqrt(math.subtract(math.pow(dx, 2), math.pow(dy, 2)));
}

function calcAcc(force, mass) {
    return math.divide(force, mass);
}

//TODO: remove
/*function calcAngle(b1, b2) {
    var diffX = math.subtract(b1.x, b2.x);
    var diffY = math.subtract(b1.y, b2.y);

    return math.divide(math.multiply(math.atan2(diffX, diffY), 180), math.pi);
}*/

function collision(b1, b2) {
    //TODO: Do stuff here
    return false;
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
function body(r, m, x, y, hv, vv, ha, va, s) //r = radius, m = mass, x = x coord, y = y coord, hv = horizontal velocity, vv = vertical velocity, ha = horizontal acceleration, va = vertical acceleration, s = selected (bool)
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
    this.s = false; //TODO: implement selection colouring and functions
    IDcount++;
}


function simulation(c, cc, b, t) //c = canvas, cc = chart, b = bodies, t = time between steps
{
    this.canvas = c;
    this.steptime = t;
    this.step = function() {
        console.log("pants"); //Obligatory inclusion in rewrite
        if (paused == false) {
            if (collision == false) { /* TODO: Do stuff here */ }
            for (var i = 0; i < b.length; i++) {
                var totalVAcc = math.bignumber('0');
                var totalHAcc = math.bignumber('0');

                for (var j = 0; j < b.length; j++) {
                    if (i != j) {
                        //Calculate force components
                        var xForce = calcXForce(b[i], b[j]);
                        var yForce = calcYForce(b[i], b[j]);

                        //Calculate acceleration from force components
                        totalHAcc = math.subtract(totalHAcc, calcAcc(xForce, b[i].mass));
                        totalVAcc = math.subtract(totalVAcc, calcAcc(yForce, b[i].mass));

                        //logging
                        console.log("totalHAcc: " + math.format(totalHAcc) + " totalVAcc: " + math.format(totalVAcc));
                        console.log("Body IDs: " + b[i].ID + " " + b[j].ID);
                        console.log("X distance: " + math.format(math.subtract(b[i].x, b[j].x)));
                        console.log("Y distance: " + math.format(math.subtract(b[i].y, b[j].y)));
                        console.log("X component = " + xForce + ", Y component = " + yForce);

                        //Graphing
                        if (graphWriteCount >= 10 && b[i].ID == 0) {
                            cc.addData([parseInt(math.format(xForce))], labelCount);
                            if (labelCount >= 600) {
                                cc.removeData();
                            }
                            graphWriteCount = 0;
                        }
                    }
                }

                //Set acceleration to calculated acceleration
                b[i].hacceleration = totalHAcc;
                b[i].vacceleration = totalVAcc;

                //Speed and displacement calcs
                //S = ut + 0.5at^2
                var hdistance = math.add(math.multiply(b[i].hvelocity, this.steptime), math.multiply(math.multiply(0.5, b[i].hacceleration), math.pow(this.steptime, 2)));
                var vdistance = math.add(math.multiply(b[i].vvelocity, this.steptime), math.multiply(math.multiply(0.5, b[i].vacceleration), math.pow(this.steptime, 2)));

                //v = u + at
                b[i].hvelocity = math.add(b[i].hvelocity, math.multiply(b[i].hacceleration, this.steptime));
                b[i].vvelocity = math.add(b[i].vvelocity, math.multiply(b[i].vacceleration, this.steptime));

                b[i].x = math.add(b[i].x, hdistance);
                b[i].y = math.add(b[i].y, vdistance);
            }

            //Add 1 to counts
            graphWriteCount++;
            labelCount++;
        }

        //Draw function
        draw(c, b);
    }
}


function draw(c, b) //C = canvas, b = bodies (array)
{
    var context = c.getContext("2d");

    //Clear old stuff:
    context.clearRect(0, 0, c.width, c.height);

    //Loop through bodies
    for (var i = 0; i < b.length; i++) {
        context.fillStyle = b[i].colour;
        context.strokeStyle = b[i].colour;
        context.beginPath();
        context.arc(math.divide(b[i].x, scale), math.divide(b[i].y, scale), b[i].radius, 0, 2 * Math.PI); //TODO: radius scaling
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
    var testBody = new body(15, math.bignumber('1e29'), math.bignumber('200000000'), math.bignumber('150000000'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'));
    var testBody2 = new body(15, math.bignumber('1500'), math.bignumber('600000000'), math.bignumber('250000000'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'));

    bodies.push(testBody);
    bodies.push(testBody2);
    mainsim = new simulation(canvas, mainChart, bodies, 5);
    window.requestAnimationFrame(function() {
        mainloop(mainsim);
    });

};
