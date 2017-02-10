var noble = require('noble');
var mraa = require('mraa')

var myOnboardLed = new mraa.Gpio(13); 
myOnboardLed.dir(mraa.DIR_OUT); 

//BLEのための変数宣言
var serviceUUIDs = ['1230010039fa4005860c09362f6169da'];//Heart RateサービスのUUID
var characteristicUUIDs = ['1230010139fa4005860c09362f6169da'];//Heart Rate Measurementに設定するキャラクタリスティクのUUID


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
    if (peripheral.advertisement.localName === 'outan_ble01') { 
       // console.log(peripheral.advertisement.localName + " is detected");
        console.log('Found device with local name: ' + peripheral.advertisement.localName);
        console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);

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
