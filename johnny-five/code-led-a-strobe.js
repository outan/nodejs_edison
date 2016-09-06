var five = require("johnny-five");
var Edison = require("galileo-io");
var myBoard, myLed;

myBoard = new five.Board({io: new Edison()});

myBoard.on("ready", function() {

  myLed = new five.Led(5);

 // myLed.strobe( 500 );

  // make myLED available as "led" in REPL

  this.repl.inject({
    led: myLed
  });

  // try "on", "off", "toggle", "strobe", "stop" (stops strobing)
});
