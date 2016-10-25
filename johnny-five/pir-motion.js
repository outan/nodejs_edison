var five = require("johnny-five");
var edison = require("edison-io");
var board = new five.Board({io:new edison()});
board.on("ready", function() {

  // Create a new `motion` hardware instance.
  var motion = new five.Motion(2);
  var led    = new five.Led(3);

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated", Date.now());
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    console.log("Detecting moving object", Date.now());
    led.on();
  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {
    console.log("No moving objects detected", Date.now());
    led.off();
 });

 // motion.on("change", function(value) {
 //   console.log("changed", Date.now());
 //   console.log(value);
 //})
});
