//Config
math.config({
    number: 'bignumber', // Default type of number: 'number' (default) or 'bignumber'
    precision: 30 // Number of significant digits for BigNumbers
});

//Physics constants and functions
var G = new math.bignumber('6.67384e-11');
var bodies = [];
var scale = new math.bignumber('1000000'); //One pixel = 1000km or 1000000m

function calcTotalForce(b1, b2, distance) {
    return (math.multiply(math.multiply(b1.mass, b2.mass), G) / math.pow(distance, 2));
}

function calcXForce(force, angle) {
    return math.multiply(math.sin(angle), force);
}

function calcYForce(force, angle) {
    return math.multiply(math.cos(angle), force);
}

function calcDistance(b1, b2) {
    var dx = math.subtract(math.subset(b1.position, math.index(0)), math.subset(b2.position, math.index(0)));
    var dy = math.subtract(math.subset(b1.position, math.index(1)), math.subset(b2.position, math.index(1)));

    return math.sqrt(math.subtract(math.pow(dx, 2), math.pow(dy, 2)));
}

function calcAcc(force, mass) {
    return math.divide(force, mass);
}

function calcAngle(b1, b2) {
    //TODO: fix rounding error
    var diffX = math.subtract(math.round(math.subset(b1.position, math.index(0))), math.round(math.subset(b2.position, math.index(0))));
    var diffY = math.subtract(math.round(math.subset(b1.position, math.index(1))), math.round(math.subset(b2.position, math.index(1))));

    console.log(diffX + " " + diffY + " " + math.format(math.atan2(diffX, diffY)));

    return math.divide(math.multiply(math.atan2(diffX, diffY), 180), math.pi);
}

function collision(b1, b2) {
    if (math.compare(calcDistance(b1, b2), math.add(b1.radius, b2.radius)) === -1) { //From website: The function cannot be used to compare values smaller than approximately 2.22e-16
        return true;
    } else {
        return false;
    }
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
    this.position = math.matrix([x, y]); //Indices: 0 = x, 1 = y
    this.hvelocity = hv;
    this.vvelocity = vv;
    this.hacceleration = ha;
    this.vacceleration = va;
    this.colour = Please.make_color()[0];
    this.ID = IDcount;
    this.s = false; //TODO: implement selection colouring and functions
    IDcount++;
}

/* TODO: It appears that when the more massive object is on the left,
   massive objects on the right may be repelled. Look into and fix */
function simulation(c, cc, b, t) //c = canvas, cc = chart, b = bodies, t = time between steps
{
    this.canvas = c;
    this.steptime = t;
    this.step = function() {
        console.log("pants"); //Obligatory inclusion in rewrite
        if (paused === false) {
            for (var i = 0; i < b.length; i++) {
                var totalVAcc = math.bignumber('0');
                var totalHAcc = math.bignumber('0');

                for (var j = 0; j < b.length; j++) {
                    if (i != j) {
                        if (collision(b[i], b[j]) === true) {
                            /* var area = math.add(math.multiply(math.pi, math.pow(b[i].radius, 2)), math.multiply(math.pi, math.pow(b[j].radius, 2)));
                            b[i].radius = math.sqrt(math.divide(area, math.pi));
                            b[i].mass = math.add(b[j].mass, b[i].mass); */
                            console.log("collision!");
                        }

                        //Calculate total force
                        var force = calcTotalForce(b[i], b[j], calcDistance(b[i], b[j]));

                        //Calculate angle between bodies
                        var angle;
                        try {
                            angle = calcAngle(b[i], b[j]);
                        } catch (e) {
                            console.log("Error in calcAngle(): " + e);
                        }

                        //Calculate force components
                        var xForce = calcXForce(force, angle);
                        var yForce = calcYForce(force, angle);

                        //Calculate acceleration from force components
                        totalHAcc = math.subtract(totalHAcc, calcAcc(xForce, b[i].mass));
                        totalVAcc = math.subtract(totalVAcc, calcAcc(yForce, b[i].mass));

                        //logging
                        console.log("totalHAcc: " + math.format(totalHAcc) + " totalVAcc: " + math.format(totalVAcc));
                        console.log("Body IDs: " + b[i].ID + " " + b[j].ID);
                        console.log("X distance: " + math.format(math.subtract(math.subset(b[i].position, math.index(0)), math.subset(b[j].position, math.index(0)))));
                        console.log("Y distance: " + math.format(math.subtract(math.subset(b[i].position, math.index(1)), math.subset(b[j].position, math.index(1)))));
                        console.log("X component = " + xForce + ", Y component = " + yForce);

                        //Graphing
                        if (graphWriteCount >= 10 && b[i].ID === 0) {
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

                b[i].position.subset(math.index(0), math.add(math.subset(b[i].position, math.index(0)), hdistance)); //Set X coord
                b[i].position.subset(math.index(1), math.add(math.subset(b[i].position, math.index(1)), vdistance)); //And Y
            }

            //Add 1 to counts
            graphWriteCount++;
            labelCount++;
        }

        //Draw function
        draw(c, b);
    };
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
        context.arc(math.divide(math.subset(b[i].position, math.index(0)), scale), math.divide(math.subset(b[i].position, math.index(1)), scale), math.divide(b[i].radius, scale), 0, 2 * Math.PI);
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
    var testBody = new body(math.bignumber('15000000'), math.bignumber('1e30'), math.bignumber('200000000'), math.bignumber('150000000'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'));
    var testBody2 = new body(math.bignumber('15000000'), math.bignumber('1500'), math.bignumber('600000000'), math.bignumber('250000000'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'), math.bignumber('0'));

    bodies.push(testBody);
    bodies.push(testBody2);
    mainsim = new simulation(canvas, mainChart, bodies, 5);
    window.requestAnimationFrame(function() {
        mainloop(mainsim);
    });

};
