var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {

  // Create a new `button` hardware instance.
  var button = new five.Button(2);

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log( "Button pressed" );
  });

  button.on("release", function() {
    console.log( "Button released" );
  });
});
