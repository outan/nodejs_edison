var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {
  var count              = 0;
  var shougaibutu_num    = 0;
  var light_num          = 0;
  var light_limit_opened = 300;
  var light_threshold    = 300;
  var led_congratulation = new five.Led(8);
  var led_shougai        = new five.Led(13);
  var shougaibutu1       = new five.Sensor.Digital(5);
  var shougaibutu2       = new five.Sensor.Digital(6);
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
        io.sockets.emit("statue", "ready");
    }
    else {
      led_shougai.off();
      led_congratulation.stop().off();
      //shougaibutu_num = 0;
      console.log("障害物1なし");
    }
  });

  shougaibutu2.on('change', function () {
    if(this.value == 0) {
      led_shougai.on();
      shougaibutu_num = 2;
      console.log("障害物2検知した");
      if (is_ready_go())
        io.sockets.emit("statue", "ready");
    }
    else {
      led_shougai.off();
      led_congratulation.stop().off();
     // shougaibutu_num = 0;
      console.log("障害物2なし");

    }
  });

  shougaibutu3.on('change', function () {
    if(this.value == 0) {
      io.sockets.emit("shougaibutu", {value: "障害物3を検知した"});
      led_shougai.on();
      shougaibutu_num = 3;
      console.log("障害物3検知した");
      if(is_ready_go())
        io.sockets.emit("status", "ready");
        
    }
    else {
      io.sockets.emit("shougaibutu", {value : "障害物3なし"});
      led_shougai.off();
      led_congratulation.stop().off();
     // is_joke = 0;
     // shougaibutu_num = 0;
      console.log("障害物3なし");
    }
  });


  light1.on('change', function () {
    console.log("light1 value is "+this.value);
    if (this.value > light_limit_opened) {
      light_num = 1;
      console.log("box1 is opened");
      //if (is_getable()) {
      //  io.sockets.emit('resulut', 0);
      //  console.log("お菓子1を取ってください。");
      //} else
        judgeSendCount (light_num, this.value);
    } else {
        led_congratulation.stop().off();
        console.log("box1 is closed");
        if (is_getable()) {
          console.log("お菓子1を取ってください。");
          //is_joke = 1;
          io.sockets.emit('result', 0);
        }
    }
  })

 light2.on('change', function () {
    console.log("light2 value is "+this.value);
    if (is_getable())
      console.log("お菓子2を取ってください。");
    else if (this.value > light_limit_opened) {
      light_num = 2;
      console.log("box2 is opened");
      judgeSendCount (light_num, this.value);
    } else {
      led_congratulation.stop().off();
      console.log("box2 is closed");
       if (shougaibutu_num > 0 && shougaibutu_num == light_num) {
        console.log("お菓子2を取ってください。");
        is_joke = 1;
        io.sockets.emit('result', 0);
       }
    }
  })

 light3.on('change', function () {
    console.log("light3 value is "+this.value);
    if (is_getable())
      console.log("お菓子3を取ってください。");
    else if (this.value > light_limit_opened) {
      light_num = 3;
      console.log("box3 is opened");
      judgeSendCount (light_num, this.value);
    } else {
      led_congratulation.stop().off();
      console.log("box3 is closed");
      if (shougaibutu_num > 0 && shougaibutu_num == light_num) {
        console.log("お菓子3を取ってください。");
        is_joke = 1;
        io.sockets.emit('result', 0);
      }
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

  function is_ready_open(light_value) {
    console.log("shougaibutu_num is "+shougaibutu_num);
    console.log("light_num is "+light_num);
    if (shougaibutu_num > 0 && light_value > light_limit_opened) {
       // console.log("I'm ready!");
      return true;
    } else {
        //console.log("I'm not ready yet!");
      return false;
    }
  }

  function is_ready_go() {
    if (shougaibutu_num > 0 && light_num == 0) {
      console.log("I'm ready!");
      return 1;
    } else {
      console.log("I'm not ready!");
      return 0;
    }
    //return shougaibutu_num > 0 && light_num == 0) ? 1 :0;

  }

  function judgeSendCount (light_num,light_value) {
    console.log("in judgeSendCount method");
    if (is_ready_open(light_value)) {
      console.log("from ready to open");
      console.log("box"+light_num+" openned");
      //io.sockets.emit( 'boxOpenned', { value : "box"+num+" is openned" } );
      count++;
      console.log("操作回数count is " + count);

      if (shougaibutu_num > 0 && shougaibutu_num == light_num) {
        console.log(count+"回当たり、おめでとう");
        io.sockets.emit('result', count);
        count = 0;
        led_congratulation.blink();
        //shougaibutu_num = 0;
        light_num = 0;
      } else {
          console.log("はずれ。残念！もう一回やってみて");
          //io.sockets.emit('result', 4);
          io.sockets.emit('result', count);
      }
    } else {
      //console.log();
      led_congratulation.stop().off()
    }
  };
});
