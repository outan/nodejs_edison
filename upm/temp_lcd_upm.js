var LCD  = require("jsupm_i2clcd");
var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(1);
console.log(temp.name());

var celsius = temp.value();
celsius = temp.value();
var fahrenheit = celsius * 9.0/5.0 + 32.0;

console.log(celsius + " degrees Celsius, or " +
Math.round(fahrenheit) + " degrees Fahrenheit");

var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62);

myLCD.setColor(255, 0, 0);

myLCD.setCursor(0,0);

myLCD.write(celsius+"Ce  "+fahrenheit+"Fa");
