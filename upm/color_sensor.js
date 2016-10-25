var colorSensor = require('jsupm_tcs3414cs');
// Instantiate the color sensor on I2C
var mycolorSensor = new colorSensor.TCS3414CS();

var rgb = new colorSensor.tcs3414sc_rgb_t;

// Print out the r, g, b, and clr value every 0.5 seconds
setInterval(function()
{
        mycolorSensor.readRGB(rgb);
        maxValue = Math.max(rgb.r, rgb.g, rgb.b);
        rVal  =  (Math.round(rgb.r/maxValue))*255;
        gVal  =  (Math.round(rgb.g/maxValue))*255;
        bVal  =  (Math.round(rgb.b/maxValue))*255;
if(rVal < 50){
rVal = 0;
}
if(gVal < 50){
gVal = 0;
}
if(bVal < 50){
bVal = 0;
}
        console.log(rVal + ", " + gVal + ", " + bVal);
}, 500);

// Print message when exiting
process.on('SIGINT', function()
{
    console.log("Exiting...");
    process.exit(0);
});
