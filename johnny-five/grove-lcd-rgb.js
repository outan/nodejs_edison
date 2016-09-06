var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
this.repl.inject({
    lcd: new five.LCD({controller: "JHD1313M1"})
});

});

