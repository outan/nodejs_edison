var five = require("johnny-five");
var edison = require("edison-io");
var board = new five.Board({io:new edison()});

board.on("ready", function() {

var gps = new five.GPS({
    port:,
    pins: [11, 10], // [RX, TX]
});


// If latitude, longitude change log it
  gps.on("change", function() {
    console.log("position");
    console.log("  latitude   : ", this.latitude);
    console.log("  longitude  : ", this.longitude);
    console.log("  altitude   : ", this.altitude);
    console.log("--------------------------------------");
  });
  // If speed, course change log it
  gps.on("navigation", function() {
    console.log("navigation");
    console.log("  speed   : ", this.speed);
    console.log("  course  : ", this.course);
    console.log("--------------------------------------");
  });
});
