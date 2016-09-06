//Rotary Angle Sensorを定義。
var upm = require('jsupm_grove');
var myRotary = new upm.GroveRotary(3);
 
// LED Socketを定義。
var mraa = require('mraa'); 
var pwm3 = new mraa.Pwm(3);
pwm3.enable(true);
pwm3.period_us(2000);
var brightness = 0.0;
 
setInterval(function () {
  var abs = myRotary.abs_value();
  // Rotary Angle Sensorの最大値が1024のため、1024で割って、
  // 0.0-1.0の範囲にbrightnessを設定している。
  var brightness = abs / 1024;
  pwm3.write(brightness);
}, 20);
