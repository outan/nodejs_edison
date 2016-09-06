var m = require('mraa');
 
var button = new m.Aio(0);
var led = new m.Gpio(8);
led.dir(m.DIR_OUT);
 
setInterval(function(){
    var buttonValue = button.read();
    if(buttonValue === 0) {
     console.log("off");
     led.write(0);
    } else {
     console.log("on");
     led.write(1);
    }
},1000);
