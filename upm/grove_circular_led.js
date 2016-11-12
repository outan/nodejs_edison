var GCL = require("jsupm_my9221");
var circle = new GCL.GroveCircularLED(9, 8);
var level = 0;

var myInterval = setInterval(function()
{
  circle.setSpinner(level);
  level = (level + 1) % 24;
}, 10);

process.on('SIGINT', function()
{
  clearInterval(myInterval);
  circle.setLevel(0);
  circle = null;
  GCL.cleanUp();
  console.log("Exiting...");
  process.exit(0);
});
