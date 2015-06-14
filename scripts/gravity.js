//Physics constants and functions
var G = 6.675e-11
var objects = [];
var scale = 1000000; //One pixel = 1000km or 1000000m

function calcForce(mass1, mass2, distance)
{
    return ((G*mass1*scale*mass2*scale)/distance^2);
}

function calcDistance(o1, o2)
{
    console.log("distance: " + Math.sqrt((o1.x + o2.x)^2 + (o1.y + o2.y)^2))
    return(scale*(Math.sqrt((o1.x + o2.x)^2 + (o1.y + o2.y)^2)));
}

function calcAcc(force, mass)
{
    return (force/(mass*scale));
}

function calcAngle(o1, o2)
{
    var dX = o1.x - o2.x;
    var dY = o1.y - o2.y;
    return Math.atan2(dX, dY) * 180 / Math.PI;
}

function calcXforce(angle, force)
{
    return(Math.sin(angle) * force);
}

function calcYforce(angle, force)
{
    return(Math.cos(angle) * force);
}

//Other global variables
var IDcount = 0;
var chartData = {
  labels: [],
  datasets: [
        {
           fillColor: "rgba(220,220,220,0.2)",
           strokeColor: "rgba(220,220,220,1)",
           pointColor: "rgba(220,220,220,1)",
           pointStrokeColor: "#fff",
           pointHighlightFill: "#fff",
           pointHighlightStroke: "rgba(220,220,220,1)",
           data: []
        },
  ]
};
var chartIter = 0;
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
    this.step = function(){
        for (var i = 0; i<o.length; i++) {
          var totalVAcc = 0
          var totalHAcc = 0

          //Gravity force calcs
          for (var j = 0; j <o.length; j++) {
                var force = calcForce(o[j].mass, o[i].mass, scale*calcDistance(o[j], o[i]));
                var forceX = calcXforce(calcAngle(o[i], o[j]), force);
                var forceY = calcYforce(calcAngle(o[i], o[j]), force);
                totalVAcc += scale*calcAcc(forceX, o[i].mass);
                totalHAcc += scale*calcAcc(forceY, o[i].mass);

                if (graphWriteCount >= 10 && o[i].ID == 0)
                {
                   cc.addData([force], labelCount);
                   if (labelCount >= 600)
                   {
                     cc.removeData();
                   }
                   graphWriteCount = 0
                }

                console.log(o[i].ID);
          }

          o[i].hacceleration = totalHAcc;
          o[i].vacceleration = totalVAcc;

          //Speed and displacement calcs
          var hvel = o[i].hvelocity;
          var vvel = o[i].vvelocity;
          var hacc = o[i].hacceleration;
          var vacc = o[i].vacceleration;

          console.log("o.vvelocity: " + o[i].vvelocity + "vvel: " + vvel + "o.vacceleration: " + o[i].vacceleration)
          //S = ut + 0.5at^2
          var hdistance = hvel*this.steptime + 0.5*hacc*(this.steptime^2);
          var vdistance = vvel*this.steptime + 0.5*vacc*(this.steptime^2);

          //console.log("Vdistance: " + vdistance + " Vacc: " + vacc)
          o[i].x += hdistance / scale;
          o[i].y += vdistance / scale;
        }

        //Add 1 to counts
        graphWriteCount++;
        labelCount++;

        //Draw function. Needs to be last
        draw(c, o);
    }
}

function draw(c, o) //C = canvas, o = objects (array)
{
    var context = c.getContext("2d");

    //Clear old stuff:
    context.clearRect(0, 0, c.width, c.height);

    //Loop through objects
    for (var i = 0; i<o.length; i++) {
      context.fillStyle=o[i].colour;
      context.strokeStyle=o[i].colour;
      context.beginPath();
      context.arc(o[i].x, o[i].y, o[i].radius, 0, 2*Math.PI);
      context.lineWidth = 1;
      context.fill();
      context.stroke();
    }
}

function mainloop(sim) //sim = a simulation
{
    try {
      sim.step();
    } catch(e) {
      console.log(e);
    }

    window.requestAnimationFrame(function() {
      mainloop(sim);
    })
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    chartCanvas = document.getElementById("chartCanvas");
    chartContext = chartCanvas.getContext("2d");

    var mainChart = new Chart(chartContext).Line(chartData);

    //r, m, x, y, hv, vv, ha, va
    var testObject = new object(20, 200, 500, 150, 1000, 1000, 10, 10);
    var testObject2 = new object(10, 100, 100, 150, -500, -500, 10, 10);
    var testObject3 = new object(15, 150, 550, 550, -600, -600, 10, 10);

    var testObjects = [testObject, testObject2, testObject3];
    mainsim = new simulation(canvas, mainChart, testObjects, 5);
    window.requestAnimationFrame(function() {
      mainloop(mainsim);
    });

}
