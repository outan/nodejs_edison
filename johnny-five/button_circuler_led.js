var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

var GCL = require("jsupm_my9221");
var circle = new GCL.GroveCircularLED(9, 8);
var level = 0;
var myInterval;
var mode = 0;

board.on("ready", function() {
  // Create a new `button` hardware instance.
  var button = new five.Button(2);

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log( "Button pressed" );
    if(mode == 0) {
      mode = 1;
      myInterval = setInterval(function()
      {
        circle.setSpinner(level);
        level = (level + 1) % 24;
      }, 30);
    } else {
      mode = 0;
      clearInterval(myInterval);
      circle.setLevel(0);
      //circle = null;
      //GCL.cleanUp();
    }
});

  button.on("release", function() {
    console.log( "Button released" );
    //led.off();
  });
});
