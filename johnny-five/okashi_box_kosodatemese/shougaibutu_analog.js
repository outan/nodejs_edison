var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({
	  io: new Edison()
});

board.on("ready", function() {
    sensor = new five.Sensor('A0');
    sensor.on("change", function() {
        console.log(this.value);
        });
});
