var five = require("johnny-five");
var edison = require("edison-io");
var board = new five.Board({io:new edison()});

board.on("ready", function() {
var led = new five.Led(5);

// This will set the brightness to about half 
led.brightness(128);
this.repl.inject({
  led: new five.Led(5)
});

});

