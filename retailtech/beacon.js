var noble = require('noble');
var mraa = require('mraa')
//BLEのための変数宣言
var serviceUUIDs = ['1230010039fa4005860c09362f6169da'];
var characteristicUUIDs = ['1230010139fa4005860c09362f6169da'];
var myOnboardLed = new mraa.Gpio(13); 
myOnboardLed.dir(mraa.DIR_OUT); 

var five = require("johnny-five");
var Edison = require("galileo-io");

var board = new five.Board({io: new Edison()});
board.on("ready", function() {
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


//ペリフェラル検索のイベントに対するコールバック設定
noble.on('stateChange', function(state) {
    console.log('state: ' + state);
    if (state === 'poweredOn') {
      var allowDuplicates = false;
      noble.startScanning(serviceUUIDs);
    } else {
        noble.stopScanning();
    }
});

noble.on('scanStart', function() {
    console.log('start scan');
});

noble.on('scanStop', function() {
    console.log('stop scan');
});

noble.on('discover', discoverPeripheral);

//ペリフェラル発見時のコールバックメソッド
function discoverPeripheral(peripheral) {
    console.log('discover peripheral: ' + peripheral);
    localName = peripheral.advertisement.localName;
    if (localName.match(/outan/)) { 
       // console.log(peripheral.advertisement.localName + " is detected");
        console.log('Found device with local name: ' + localName);
        console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);

       io.sockets.emit("ble_button", localName);
       console.log("emit " + localName);        

        noble.stopScanning();
       //setTimeout(noble.startScanning(serviceUUIDs), 3000)
       //noble.startScanning(serviceUUIDs);
       peripheral.connect();
    }

   peripheral.on('connect', function() {
       console.log('connectted to the ble button');
       this.discoverServices(serviceUUIDs);
   });

   peripheral.on('servicesDiscover', function(services){
       console.log("services is ");
       console.log(services);
       if(services.length > 0){
           var heartRateService = services[0];
           heartRateService.discoverCharacteristics(characteristicUUIDs);

           heartRateService.on('characteristicsDiscover', function(characteristics){
	            //取得したキャラクタリスティックをグローバル変数に格納する
            console.log('characteristics is ' + characteristics);
           });    
       } 
       //else {
       //  peripheral.disconnect()
      // }
      peripheral.disconnect();
  });
   //BLE切断時の処理、BLEデバイス切断時は再度ペリフェラルの検索を実行する。
   peripheral.on('disconnect', function() {
       console.log('on -> disconnect');
       setTimeout(function(){noble.startScanning(serviceUUIDs)}, 5000);
       //noble.startScanning(serviceUUIDs);
   });
}
});
