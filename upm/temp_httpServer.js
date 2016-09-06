var groveSensor = require('jsupm_grove');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(1);
console.log(temp.name());


var http = require('http');
http.createServer(function(req, res){
  console.log('Receive Request!!');
  var temperature = temp.value();
  console.log('temperature is '+ temperature);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var html = '<table border="1">' +
      '<tr>'+ 
      '<td>temp[degC]</td>'+
      '<td>'+ temperature +'</td>' +
      '</tr>'+ 
      '</table>';
  res.end(html);
}).listen(3000) 

