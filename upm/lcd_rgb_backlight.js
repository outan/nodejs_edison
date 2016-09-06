var mraa = require("mraa");
// LCD Classを定義
var LCD  = require("jsupm_i2clcd");
 
// LCDを初期化。0x3EはLCD_ADDRESS,0x62はRGB_ADDRESS。
var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62);
// A0に接続されたLight Sensorを定義
var LightSensor = new mraa.Aio(0);
 
setInterval(function () {
  var a = LightSensor.read();
  // バックライト色を指定
  myLCD.setColor(255, 0, 0);
  // 配置(row,clumn)を指定
  myLCD.setCursor(0,0);
// LCD�write
  myLCD.write("Light: " + a);
}, 1000);
