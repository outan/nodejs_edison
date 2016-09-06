var mraa = require("mraa");
// LCD Classを定義
var LCD  = require("jsupm_i2clcd");

// LCDを初期化。0x3EはLCD_ADDRESS,0x62はRGB_ADDRESS。
var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62);

myLCD.setColor(255, 0, 0);
 
myLCD.setCursor(0,0);

myLCD.write("王�");
