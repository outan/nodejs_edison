var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({io: new Edison()});

board.on("ready", function() {
    var count   = 0;
    var button;

    var led1    = new five.Led(7);
    var button1 = new five.Button(3);
    var light1  = new five.Sensor({
                pin: 'A0',
                threshold: 300
                });

    //var led2    = new five.Led(9);
    var button2 = new five.Button(4);
    var light2  = new five.Sensor({
                pin: 'A1',
                threshold: 300
                });

    //var led3    = new five.Led(10);
    var button3 = new five.Button(5);
    var light3  = new five.Sensor({
                pin: 'A2',
                threshold: 300
                });

    var ready        = 0;
    var led_ready    = new five.Led(8);
    var touch_button = new five.Button(6);

    var http = require( 'http' ); // HTTPモジュール読み込み
    var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
    var fs = require( 'fs' ); // ファイル入出力モジュール読み込み

    // 3000番ポートでHTTPサーバーを立てる
    var server = http.createServer( function( req, res ) {
        res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
        res.end( fs.readFileSync('./index2.html', 'utf-8') );  // index.htmlの内容を出力
    }).listen(3000);

    var io = socketio.listen( server );
    // 接続確立後の通信処理部分を定義
    io.sockets.on( 'connection', function(socket) {
        socket.emit('message',{ value: '接続できました'});
        console.log('I am connectted');
    });

    io.sockets.on('aaa', function(data) {
    console.log(data.value);})

    light1.on('change', function () {
        sendMessage (1, this.value);
    })

    button1.on("press", function() {
        button = 1;
        //led1.toggle();
        console.log( "Button1 pressed" );
        io.sockets.emit( 'buttonPressed', { value : "box1: button1 is pressed" } );
        led1.stop().off();
    });

    light2.on('change', function () {
        sendMessage(2, this.value);   
    });

    button2.on("press", function() {
        button = 2;
        //led2.toggle();
        console.log( "Button2 pressed" );
        io.sockets.emit( 'buttonPressed', { value : "box2: button2 is pressed" } );
        led1.stop().off()
    });

    light3.on('change', function () {
        sendMessage(3, this.value);
    });

    button3.on("press", function() {
        button = 3;
        led1.toggle();
        console.log( "Button3 pressed" );
        io.sockets.emit( 'buttonPressed', { value : "box3: button3 is pressed" } );
        led1.stop().off()
    });
    

    touch_button.on("press", function() {
        led_ready.on();
        ready = 1;
        console.log("touch_button is pressed");
        console.log("ready is "+ready);
        io.sockets.emit('buttonPressed', {value : "I'm ready. touch_button is pressed"});
    });

    function sendMessage (num,value) {
        if (ready == 1 && value > 550) {
            console.log("ready is "+ ready);
            console.log("box"+num+" openned");
            console.log("light"+num+" value is "+value);
            io.sockets.emit( 'boxOpenned', { value : "box"+num+" is openned" } );
            count++;

            console.log("count is " + count);
            if (button == num) {
                if (count == 1) {
                    io.sockets.emit( 'message', { value : "おめでとう~当たりだよ。1回で当てるなんてすごい" } );
                    count = 0;
                    led1.blink();
                    led_ready.off();
                    ready = 0;
                } else if (count == 2) {
                    io.sockets.emit( 'message', { value : "おめでとう~当たりだよ。やるね" } );
                    count = 0;
                    led1.blink();
                    led_ready.off();
                    ready = 0;
                } else {
                    io.sockets.emit( 'message', { value : "おめでとう~当たりだよ。良かったね。" } );
                    count = 0;
                    led1.blink();
                    led_ready.off();
                    ready = 0
                }
            } else {
                io.sockets.emit('message', {value : "残念~はずれだよ。もう1回やってみて"});
                led_ready.off();
            }
        } else {
            console.log("ready is "+ready);
            //console.log("box"+num+" closed");
            console.log("light"+num+" value is "+value);
            led1.stop().off()
        }
    };
});
