var colorSensor = require('jsupm_tcs3414cs');
// Instantiate the color sensor on I2C
var mycolorSensor = new colorSensor.TCS3414CS();

var rgb = new colorSensor.tcs3414sc_rgb_t;

// Print out the r, g, b, and clr value every 0.5 seconds
setInterval(function()
{
        mycolorSensor.readRGB(rgb);
        console.log(rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + rgb.clr);
}, 500);

// Print message when exiting
process.on('SIGINT', function()
{
    console.log("Exiting...");
    process.exit(0);
});
