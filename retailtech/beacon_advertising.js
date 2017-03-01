var noble = require('noble');
//BLEのための変数宣言
var serviceUUIDs = ['1230010039fa4005860c09362f6169da'];
var characteristicUUIDs = ['1230010139fa4005860c09362f6169da'];
var allowDuplicates = true;

var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});
board.on("ready", function() {
  var http = require( 'http' );
  var socketio = require( 'socket.io' );
  var fs = require( 'fs' );
  var led_13 = new five.Led(13);
  var orderButton = new five.Button(2);
  var mode = "order";

  orderButton.on("press", function() {
    console.log( "orderButton is pressed" );
    if(mode == "order") {
      mode = "explanation"
      io.sockets.emit("mode", mode);
      console.log("emit mode: " + mode);

      explanation_mode_interval = setInterval(function() {
        io.sockets.emit("mode", mode);
        console.log("emit mode: " + mode);
      },15000);
    } else {
      mode = "order"
      io.sockets.emit("mode", mode);
      console.log("emit mode: " + mode);
      clearInterval(explanation_mode_interval);
      }
  });

  // 3000番ポートでHTTPサーバーを立てる
  var server = http.createServer( function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./index.html', 'utf-8') );  // index.htmlの内容を出力
  }).listen(3000);

  var io = socketio.listen( server );
  io.sockets.on( 'connection', function(socket) {
    console.log('some websocket client is connected to the websocket server edison');
  });

  //ペリフェラル検索のイベントに対するコールバック設定
  noble.on('stateChange', function(state) {
      console.log('state of central device is : ' + state);
      if (state === 'poweredOn') {
        noble.startScanning(serviceUUIDs, allowDuplicates);
      } else {
          noble.stopScanning();
      }
  });

  noble.on('scanStart', function() {
      console.log('start scan');
  });

  noble.on('scanStop', function() {
      console.log('stop scan\n');
  });

  noble.on('discover', discoverPeripheral);

  function discoverPeripheral(peripheral) {
      console.log('discovered peripheral: \n' + peripheral);
      localName = peripheral.advertisement.localName;
      if (localName.match(/nex/)) { 
        console.log('Found device with local name: ' + localName);
        //led_13は5秒間点灯する
        led_13.blink(500);
        setTimeout(function() {led_13.stop(), led_13.off()}, 5000)
        // peripheralを検知したら、一旦stop scan(BTN01ビーコンボタンが押されたら、３秒間連続信号を飛ばしてしまうから。)
        noble.stopScanning();

        emitMessage = localName.slice(4);
        io.sockets.emit("ble_button", emitMessage);
        console.log("emitted the message: " + emitMessage);
        // 5秒後startscan,  連打は無視される
        setTimeout(function(){noble.startScanning(serviceUUIDs, allowDuplicates)}, 5000);
      }
  }
});
