//Config
math.config({
    number: 'bignumber', // Default type of number: 'number' (default) or 'bignumber'
    precision: 30 // Number of significant digits for BigNumbers
});

//Physics constants and functions
var G = new math.bignumber('6.675e-11');
var bodies = [];
var scale = new math.bignumber('1000000'); //One pixel = 1000km or 1000000m

/************
  TO DELETE
************/
var testnum1 = new math.bignumber('6.45e21');
var testnum2 = new math.bignumber('4.12e20');

function calcForce(mass1, mass2, distance) {
    return (math.times((math.times(mass1, mass2)), G) / math.pow(distance, 2));
}

function calcDistance(dx, dy) {
    return math.sqrt(math.subtract(math.pow(dx, 2), math.pow(dy, 2)));
}

function calcAcc(force, mass) {
    return math.divide(force, mass);
}

function calcAngle(b1, b2) {
    var diffX = math.subtract(b1.x, b2.x);
    var diffY = math.subtract(b1.y, b2.y);

    return math.divide(math.multiply(math.atan2(diffX, diffY), 180), math.pi);
}

function calcXforce(angle, force) {
    return math.multiply(math.sin(angle), force);
}

function calcYforce(angle, force) {
    return math.multiply(math.cos(angle), force);
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
    console.log("pants"); //Obligatory inclusion in rewrite
    if (paused == false) {
        for (var i = 0; i < b.length; i++) {
            var totalVAcc = math.bignumber('0');
            var totalHAcc = math.bignumber('0');

            for (var j = 0; j < b.length; j++) {
                if (i != j) {


                }
            }
        }
    }
