var five = require("johnny-five");
var edison = require("edison-io");
var board = new five.Board({io:new edison()});

board.on("ready", function() {
  // Assuming an Led is attached to pin 9, 
  // this will turn it on at full brightness
  // PWM is the mode used to write ANALOG 
  // signals to a digital pin
  this.pinMode(5, five.Pin.PWM);
  this.analogWrite(5, 255);
});
