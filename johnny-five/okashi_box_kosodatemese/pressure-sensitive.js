var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({
	  io: new Edison()
});

board.on("ready", function() {
    var sensor = new five.Sensor({
        pin: "A0",
        threshold: 20
    });

    sensor.on("change", function(value) {
        if (value > 1000)
            console.log("open");
        else 
            console.log("close");
    });
});
