var Cylon = require('cylon');

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'ble', uuid: '00101801919b' }
  },

  devices: {
    wiced: { driver: 'wiced-sense' }
  },

  work: function(my) {
    my.wiced.getData(function(err, data) {
      if (!!err) {
        console.log("Error: ", err);
        return;
      }

      console.log("Data: ", data);
    });
  }
}).start();
