var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {
  var count   = 0;

  var led1    = new five.Led(7);
  var ready        = 0;
  var led_ready    = new five.Led(8);
  //var touch_button = new five.Button(6);
  var led_shougai  = new five.Led(13);
  var shougaibutu1 = new five.Sensor.Digital(2);
  var shougaibutu2 = new five.Sensor.Digital(3);
  var shougaibutu3 = new five.Sensor.Digital(4);
  var pressure_sensitive = new five.Sensor({
    pin: "A0",
    threshold: 20
  });

  var http = require( 'http' ); // HTTPモジュール読み込み
  var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
  var fs = require( 'fs' ); // ファイル入出力モジュール読み込み

  // 3000番ポートでHTTPサーバーを立てる
  var server = http.createServer( function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./index.html', 'utf-8') );  // index.htmlの内容を出力
  }).listen(3000);

  var io = socketio.listen( server );
  // 接続確立後の通信処理部分を定義
  io.sockets.on( 'connection', function(socket) {
    console.log('I am connectted');
  });

  shougaibutu1.on('change', function () {
    if(this.value == 0) {
      io.sockets.emit("shougaibutu", {value: "障害物1を検知した"});
      led_shougai.on();
      console.log("障害物1検知した。");
    }
    else {
      io.sockets.emit("shougaibutu", {value : "障害物1がなくなった"});
      led_shougai.off();
      console.log("障害物1がなくなった。");
    }
  });

shougaibutu2.on('change', function () {
    if(this.value == 0) {
      io.sockets.emit("shougaibutu", {value: "障害物2を検知した"});
      led_shougai.on();
      console.log("障害物2検知した。");
    }
    else {
      io.sockets.emit("shougaibutu", {value : "障害物2がなくなった"});
      led_shougai.off();
      console.log("障害物2がなくなった。");
    }
  });

shougaibutu3.on('change', function () {
    if(this.value == 0) {
      io.sockets.emit("shougaibutu", {value: "障害物3を検知した"});
      led_shougai.on();
      console.log("障害物3検知した。");
    }
    else {
      io.sockets.emit("shougaibutu", {value : "障害物3がなくなった"});
      led_shougai.off();
      console.log("障害物3がなくなった。");
    }
  });


  pressure_sensitive.on("change", function(value) {
    if (value > 1000) {
      io.sockets.emit("pressure-sensitive", {value: "box is open"});
      console.log("box is open");
    }
    //else {
    //    io.sockets.emit("pressure-sensitive", {value: "box is closed"});
    //    console.log("box is closed");
    //}
  });


  //touch_button.on("press", function() {
  //  led_ready.blink();
  //  ready = 1;
  //  console.log("touch_button is pressed");
  //  console.log("ready is "+ready);
  //  io.sockets.emit('outan', 5);
  //});

  function sendMessage (num,value) {
    if (ready == 1 && value > 550) {
      console.log("ready is "+ ready);
      console.log("box"+num+" openned");
      console.log("light"+num+" value is "+value);
      //io.sockets.emit( 'boxOpenned', { value : "box"+num+" is openned" } );
      count++;

      console.log("count is " + count);
      if (button == num) {
        if (count == 1) {
          io.sockets.emit( 'outan', 1);
          count = 0;
          led1.blink();
          led_ready.stop().off();
          ready = 0;
        } else if (count == 2) {
          io.sockets.emit( 'outan', 2);
          count = 0;
          led1.blink();
          led_ready.stop().off();
          ready = 0;
        } else {
          io.sockets.emit( 'outan', 3 );
          count = 0;
          led1.blink();
          led_ready.stop().off();
          ready = 0
        }
      } else {
        io.sockets.emit('outan', 4);
        led_ready.stop().off();
      }
    } else {
      console.log("ready is "+ready);
      //console.log("box"+num+" closed");
      console.log("light"+num+" value is "+value);
      led1.stop().off()
    }
  };
});
