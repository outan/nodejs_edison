var five = require("johnny-five");
var edison = require("edison-io");
var board = new five.Board({io:new edison()});

board.on("ready", function() {
var sensor = new five.Sensor({
  pin: 2,
  type: "digital"
});

sensor.on("change", function() {
    console.log(this.value);
  });
});
