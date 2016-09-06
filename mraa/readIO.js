var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); 

//setup access analog inpuput pin 0, 1
var analogPin0 = new m.Aio(0); 
var analogPin1 = new m.Aio(1); 

//read the value of the analog pin
var analogValue0 = analogPin0.read(); 
var analogValue1 = analogPin1.read(); 

//write the value of the analog pin to the console
console.log("A0: " + analogValue0); 
console.log("A1: " + analogValue1); 
