// vim: expandtab tabstop=2 shiftwidth=2 :
var http = require('http');
var fs = require('fs');
//var os = require('os');

//console.log(fs);


http.createServer(function (req, res) {
  console.log('request received');
  fs.readFile('./hello.html', function(er, file){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(file.toString());
    //res.end('_testcb(\'{"message": "Hello world!"}\')');
  })
}).listen(8888);
