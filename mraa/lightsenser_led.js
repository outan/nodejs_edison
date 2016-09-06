var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

// Analog Input: AO
var analogPin0 = new mraa.Aio(0);

// On Board LED: GPIO13
var ledPin = new mraa.Gpio(13);
ledPin.dir(mraa.DIR_OUT);

// Threshold
var threshold = 500;

setInterval(function(){
  var analogValue = analogPin0.read(); //read the value of the analog pin
  console.log(analogValue); //write the value of the analog pin to the console
  if(analogValue < threshold)
    ledPin.write(1);
  else
  ledPin.write(0);
}, 500);

