var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {
    //server
    var hitml = require('fs').readFileSync('index2.html');
    var http = require('http').createServer(function(req, res) {
        A
        res.writeHead(200, {
        'Content-Type': 'text/html'
        });
        res.end(html);
    });

// SOCKET IO ///////////////////////////
    var io = require('socket.io')(http);
    http.listen(3000);

    var led = new five.Led(5);
    var button = new five.Button(2);

    io.on('connection', function(socket) {
        button.on("press", function() {
            console.log( "Button pressed" );
            led.toggle();
            data = 'button is pressed';
            io.emit('press', {value : data});
        });
    });
});
