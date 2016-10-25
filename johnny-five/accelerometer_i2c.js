var five = require("johnny-five");
var edison = require("edison-io");
var board = new five.Board({io:new edison()});

board.on("ready", function() {

  var accelerometer = new five.Accelerometer(0);

    accelerometer.on("change", function() {
      console.log("X: %d", this.x);
      console.log("Y: %d", this.y);
    });
});


