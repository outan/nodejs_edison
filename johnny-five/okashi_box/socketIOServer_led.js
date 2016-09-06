var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {
  //server
var html = require('fs').readFileSync('index.html');
  var http = require('http').createServer(function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(html);
  });

  // SOCKET IO ///////////////////////////
  var io = require('socket.io')(http);
  http.listen(3000);

  var led = new five.Led(5);

  io.on('connection', function(socket) {
    socket.on('msg', function(data) {
      console.log(data);

      if (data == "on") {
        led.on();
      } else if (data == "off") {
        led.off();
      } else if (data == "fadein") {
        led.fadeIn();
      } else if (data == "fadeout") {
        led.fadeOut();
      } else if (data == "toggle") {
          led.toggle();
      } else if (data == "blink") {
        led.blink();
      }
      else {
        io.emit('msg', data);
      }
    });
  });
});
