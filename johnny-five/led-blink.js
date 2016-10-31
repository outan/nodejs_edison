var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({
	  io: new Edison()
});

board.on("ready", function() {
	  var led = new five.Led(8);
	    led.blink(500);
});
