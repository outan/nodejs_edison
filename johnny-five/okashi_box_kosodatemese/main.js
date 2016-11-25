var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});
board.on("ready", function() {
  var open_box_count         = 0;
  var box1_status            = 0;
  var box2_status            = 0;
  var box3_status            = 0;
  var item1_status           = 0;
  var item2_status           = 0;
  var item3_status           = 0;
  var item_found_num         = 0;
  var box_opened_num         = 0;
  var box_opened_light_limit = 600;
  var light_change_threshold = 300;
  //var led_congratulation     = new five.Led(5);
  var item_found_led         = new five.Led(13);
  var shougaibutu_sensor1    = new five.Sensor.Digital(7);
  var shougaibutu_sensor2    = new five.Sensor.Digital(8);
  var shougaibutu_sensor3    = new five.Sensor.Digital(4);
  var is_joke                = 0;
  var mode                   = 1; // 0:idle, 1:game
  var mode_button            = new five.Button(3);
  var idle_mode_interval;
  var reset_button           = new five.Button(6);

  five.Pin.read(reset_button, function(error, value) {
      console.log(value);
  });

  var light_sensor1  = new five.Sensor({
                  pin: 'A0',
                  threshold: light_change_threshold
              });
  var light_sensor2  = new five.Sensor({
                  pin: 'A1',
                  threshold: light_change_threshold
              });
  var light_sensor3  = new five.Sensor({
                  pin: 'A2',
                  threshold: light_change_threshold
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

  mode_button.on("press", function() {
    console.log( "Button pressed" );
    if(mode == 0) {
      mode = 1;
      console.log("mode is "+mode);
      io.sockets.emit("mode",1);
      console.log("emit mode 1:game mode");

      clearInterval(idle_mode_interval);
   } else {
      mode = 0;
      io.sockets.emit("mode",0);
      console.log("emit mode 0:idle mode");

      idle_mode_interval = setInterval(function() {
        io.sockets.emit("mode",0);
        console.log("emit mode 0:idle mode");
      },15000);
   }
  });

  reset_button.on('press', function() {
    console.log("reset_button is pressed");
    item_found_led.off();
    item_found_num = 0;
    box_opened_num = 0;
    is_joke = 0;
    item1_status = 0;
    item2_status = 0;
    item3_status = 0;
  });

  shougaibutu_sensor1.on('change', function () {
    if(this.value == 0) {
      item_found_led.on();
      item_found_num = 1;
      console.log("障害物1検知した");
      if(item1_status == 0 && is_ready_go()) {
        io.sockets.emit("status", 1);
        item1_status = 1;
      }
      else if(is_ready_go() == 0) {
        io.sockets.emit("status",0);
        console.log("すべての箱を閉めてください");
      }
    } else if(box1_status == 1) {
      item_found_led.off();
      //led_congratulation.stop().off();
      item_found_num = 0;
      is_joke = 0;
      item1_status = 0;
      console.log("障害物1が取れました");
    }
  });

  shougaibutu_sensor2.on('change', function () {
    if(this.value == 0) {
      item_found_led.on();
      item_found_num = 2;
      console.log("障害物2検知した");
      if(item2_status == 0 && is_ready_go()) {
        io.sockets.emit("status", 1); 
        item2_status = 1;
      }
      else if(is_ready_go() == 0){
        io.sockets.emit("status",0);
        console.log("すべての箱を閉めてください");
      }
    } else if(box2_status == 1) {
      item_found_led.off();
      //led_congratulation.stop().off();
      item_found_num = 0;
      console.log("障害物2が取れました");
      is_joke = 0;
      item2_status = 0;
    }
  });

  shougaibutu_sensor3.on('change', function () {
    if(this.value == 0) {
      io.sockets.emit("shougaibutu_sensor", {value: "障害物3を検知した"});
      item_found_led.on();
      item_found_num = 3;
      console.log("障害物3検知した");
      if(item3_status == 0 && is_ready_go()) {
        io.sockets.emit("status", 1);
        item3_status = 1;
      }
      else if (is_ready_go() == 0){
        io.sockets.emit("status",0);
        console.log("すべての箱を閉めてください");
      }
    } else if(box3_status == 1) {
      io.sockets.emit("shougaibutu_sensor", {value : "障害物3が取れました"});
      item_found_led.off();
      //led_congratulation.stop().off();
      is_joke = 0;
      item_found_num = 0;
      console.log("障害物3が取れました");
      item3_status = 0;
    }
  });


  light_sensor1.on('change', function () {
    console.log("light_sensor1 value is "+this.value);
    if (this.value > box_opened_light_limit) {
      box1_status = 1;
      console.log("box1 is opened");
      if(is_joke == 0) {
        box_opened_num = 1;
        judgeSendCount (box_opened_num, this.value);
      }
    } else {
        box1_status = 0;
        //led_congratulation.stop().off();
        console.log("box1 is closed");
        if (is_getable()) {
          console.log("お菓子1を取ってください。");
          is_joke = 1;
          io.sockets.emit('status', 2);
        }
        if (all_box_closed()&&!is_joke)
          box_opened_num = 0;
    }
  })

  function all_box_closed() {
    console.log("box1 is "+box1_status);
    console.log("box2 is "+box2_status);
    console.log("box3 is "+box3_status);
    return (box1_status == 0 && box2_status == 0 && box3_status == 0)? 1: 0;
  }

  light_sensor2.on('change', function () {
    console.log("light_sensor2 value is "+this.value);
    if (this.value > box_opened_light_limit) {
      console.log("box2 is opened");
      box2_status = 1;
      if(is_joke == 0) {
        box_opened_num = 2;
        judgeSendCount (box_opened_num, this.value);
      }
    } else {
        box2_status = 0;
        //led_congratulation.stop().off();
        console.log("box2 is closed");
        if (is_getable()) {
          console.log("お菓子2を取ってください。");
          is_joke = 1;
          io.sockets.emit('status', 2);
        }
        if(all_box_closed()&&!is_joke)
          box_opened_num = 0;
    }
  })

  light_sensor3.on('change', function () {
    console.log("light_sensor3 value is "+this.value);
    if (this.value > box_opened_light_limit) {
      box3_status = 1;
      console.log("box3 is opened");
      if (is_joke == 0) {
        box_opened_num = 3;
        judgeSendCount (box_opened_num, this.value);
      }
    } else {
        box3_status = 0;
        //led_congratulation.stop().off();
        console.log("box3 is closed");
        if (is_getable()) {
          console.log("お菓子3を取ってください。");
          is_joke = 1;
          io.sockets.emit('status', 2);
        }
        if (all_box_closed()&&!is_joke)
          box_opened_num = 0;
    }
  })

  function is_getable() {
    console.log("item_found_num is "+ item_found_num);
    console.log("box_opened_num is "+box_opened_num);
    if (item_found_num > 0 && item_found_num == box_opened_num) {
      console.log("I'm getable.");
      return 1;
    } else {
      console.log("I'm not getable.");
      return 0;
    }
    //return (item_found_num > 0 && item_found_num = box_opened_num) ? 1 :0;
  }

  function is_ready_go() {
    console.log("item_found_num is "+item_found_num);
    console.log("box_opened_num is "+box_opened_num);
    if (item_found_num > 0 && box_opened_num == 0) {
      console.log("I'm ready!");
      return 1;
    } else {
      console.log("I'm not ready!");
      return 0;
    }
    //return item_found_num > 0 && box_opened_num == 0) ? 1 :0;

  }

  function judgeSendCount () {
    console.log("in judgeSendCount method");
    if (item_found_num) {
      open_box_count++;
      console.log("操作回数open_box_count is " + open_box_count);

      if (item_found_num == box_opened_num) {
        console.log(open_box_count+"回当たり、おめでとう");
        io.sockets.emit('result', open_box_count);
        open_box_count = 0;
        //led_congratulation.blink();
        //item_found_num = 0;
        //box_opened_num = 0;
      } else {
          console.log("はずれ。残念！もう一回やってみて");
          //io.sockets.emit('result', 4);
          io.sockets.emit('result', 0);
      }
    } else {
      //console.log();
      console.log("お菓子をいれていくださいね。");
      io.sockets.emit("status",3);
      //led_congratulation.stop().off()
    }
  };
});
