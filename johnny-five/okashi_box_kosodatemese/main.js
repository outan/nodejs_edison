var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {
  var count              = 0;
  var shougaibutu_num    = 0;
  var box1               = 0;
  var box2               = 0;
  var box3               = 0;
  var light_num          = 0;
  var light_limit_opened = 600;
  var light_threshold    = 340;
  var led_congratulation = new five.Led(5);
  var led_shougai        = new five.Led(13);
  var shougaibutu1       = new five.Sensor.Digital(7);
  var shougaibutu2       = new five.Sensor.Digital(8);
  var shougaibutu3       = new five.Sensor.Digital(4);
  var is_joke            = 0;

  var light1  = new five.Sensor({
                  pin: 'A0',
                  threshold: light_threshold
              });
  var light2  = new five.Sensor({
                  pin: 'A1',
                  threshold: light_threshold
              });
  var light3  = new five.Sensor({
                  pin: 'A2',
                  threshold: light_threshold
              });

  var http = require( 'http' );
  var socketio = require( 'socket.io' );
  var fs = require( 'fs' );

  // 3000番ポートでHTTPサーバーを立てる
  var server = http.createServer( function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./index.html', 'utf-8') );  // index.htmlの内容を出力
  }).listen(3000);

  var io = socketio.listen( server );
  io.sockets.on( 'connection', function(socket) {
    console.log('I am connectted with socketio');
  });

  shougaibutu1.on('change', function () {
    if(this.value == 0) {
      led_shougai.on();
      shougaibutu_num = 1;
      console.log("障害物1検知した");
      if (is_ready_go())
        io.sockets.emit("status", 1);
      else {
        io.sockets.emit("status",0);
        console.log("すべての箱を閉めてください");
      }
    } else {
      led_shougai.off();
      led_congratulation.stop().off();
      shougaibutu_num = 0;
      is_joke = 0;
      console.log("障害物1なし");
    }
  });

  shougaibutu2.on('change', function () {
    if(this.value == 0) {
      led_shougai.on();
      shougaibutu_num = 2;
      console.log("障害物2検知した");
      if (is_ready_go())
        io.sockets.emit("status", 1); 
      else {
        io.sockets.emit("status",0);
        console.log("すべての箱を閉めてください");
      }
    } else {
      led_shougai.off();
      led_congratulation.stop().off();
      shougaibutu_num = 0;
      console.log("障害物2なし");
      is_joke = 0;
    }
  });

  shougaibutu3.on('change', function () {
    if(this.value == 0) {
      io.sockets.emit("shougaibutu", {value: "障害物3を検知した"});
      led_shougai.on();
      shougaibutu_num = 3;
      console.log("障害物3検知した");
      if(is_ready_go())
        io.sockets.emit("status", 1);
      else {
        io.sockets.emit("status",0);
        console.log("すべての箱を閉めてください");
      }
    } else {
      io.sockets.emit("shougaibutu", {value : "障害物3なし"});
      led_shougai.off();
      led_congratulation.stop().off();
      is_joke = 0;
      shougaibutu_num = 0;
      console.log("障害物3なし");
    }
  });


  light1.on('change', function () {
    console.log("light1 value is "+this.value);
    if (this.value > light_limit_opened) {
      box1 = 1;
      console.log("box1 is opened");
      if (is_joke) {
        io.sockets.emit('status', 2);
        console.log("お菓子1を取ってください。");
      } else {
        light_num = 1;
        judgeSendCount (light_num, this.value);
      }
    } else {
        box1 = 0;
        led_congratulation.stop().off();
        console.log("box1 is closed");
        if (is_getable()) {
          console.log("お菓子1を取ってください。");
          is_joke = 1;
          io.sockets.emit('status', 2);
        }
        if (all_box_closed()&&!is_joke)
          light_num = 0;
    }
  })

  function all_box_closed() {
    console.log("box1 is "+box1);
    console.log("box2 is "+box2);
    console.log("box3 is "+box3);
    return (box1 == 0 && box2 == 0 && box3 == 0)? 1: 0;
  }

  light2.on('change', function () {
    console.log("light2 value is "+this.value);
    if (this.value > light_limit_opened) {
      console.log("box2 is opened");
      box2 = 1;
      if (is_joke) {
        io.sockets.emit('status', 2);
        console.log("お菓子2を取ってください。");
      } else {
        light_num = 2;
        judgeSendCount (light_num, this.value);
      }
    } else {
        box2 = 0;
        led_congratulation.stop().off();
        console.log("box2 is closed");
        if (is_getable()) {
          console.log("お菓子2を取ってください。");
          is_joke = 1;
          io.sockets.emit('status', 2);
        }
        if(all_box_closed()&&!is_joke)
          light_num = 0;
    }
  })

  light3.on('change', function () {
    console.log("light3 value is "+this.value);
    if (this.value > light_limit_opened) {
      box3 = 1;
      console.log("box3 is opened");
      if (is_joke) {
        io.sockets.emit('status', 2);
        console.log("お菓子3を取ってください。");
      } else {
        light_num = 3;
        judgeSendCount (light_num, this.value);
      }
    } else {
        box3 = 0;
        led_congratulation.stop().off();
        console.log("box3 is closed");
        if (is_getable()) {
          console.log("お菓子3を取ってください。");
          is_joke = 1;
          io.sockets.emit('status', 2);
        }
        if (all_box_closed()&&!is_joke)
          light_num = 0;
    }
  })

  function is_getable() {
    console.log("shougaibutu_num is "+shougaibutu_num);
    console.log("light_num is "+light_num);
    if (shougaibutu_num > 0 && shougaibutu_num == light_num) {
      console.log("I'm getable.");
      return 1;
    } else {
      console.log("I'm not getable.");
      return 0;
    }
    //return (shougaibutu_num > 0 && shougaibutu_num == light_num) ? 1 :0;
  }

  function is_ready_go() {
    console.log("shougaibutu_num is "+shougaibutu_num);
    console.log("light_num is "+light_num);
    if (shougaibutu_num > 0 && light_num == 0) {
      console.log("I'm ready!");
      return 1;
    } else {
      console.log("I'm not ready!");
      return 0;
    }
    //return shougaibutu_num > 0 && light_num == 0) ? 1 :0;

  }

  function judgeSendCount () {
    console.log("in judgeSendCount method");
    if (shougaibutu_num) {
      count++;
      console.log("操作回数count is " + count);

      if (shougaibutu_num == light_num) {
        console.log(count+"回当たり、おめでとう");
        io.sockets.emit('result', count);
        count = 0;
        led_congratulation.blink();
        //shougaibutu_num = 0;
        //light_num = 0;
      } else {
          console.log("はずれ。残念！もう一回やってみて");
          //io.sockets.emit('result', 4);
          io.sockets.emit('result', 0);
      }
    } else {
      //console.log();
      console.log("お菓子をいれていくださいね。");
      io.sockets.emit("status",3);
      led_congratulation.stop().off()
    }
  };
});
