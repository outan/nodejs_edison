var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({
	  io: new Edison()
});

board.on("ready", function() {
    sensor = new five.Sensor.Digital(13);
    sensor.on("change", function() {
        if(this.value == 0)
            console.log("障害物検知した。");
        else
            console.log("障害物がなくなった。");
    });
});
