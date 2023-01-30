var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var server_port = '5000';
server.listen(process.env.PORT || server_port);

var oldDirTR, oldDir133, oldDir150, oldDir200, rootDirTR, rootDir133, rootDir150, rootDir200;

var connections = [];
var serverclients = [];

app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '\\index.html');
});

io.sockets.on('connection', (socket) => {
  console.log(
    'Клиент подключился ' +
      socket.request.connection.remoteAddress.substr(7) +
      ' - ' +
      Date().substr(3, 21),
  );
  serverclients.push(socket.handshake.address.substr(7));
  connections.push(socket);

  io.sockets.emit('clients', { serverclients });

  socket.on('disconnect', () => {
    console.log(
      'Клиент отключился ' +
        socket.request.connection.remoteAddress.substr(7) +
        ' - ' +
        Date().substr(3, 21),
    );
    delete connections[socket];
    serverclients.splice(serverclients.indexOf(socket.handshake.address.substr(7)), 1);
    io.sockets.emit('clients', { serverclients });
  });

  function sendDir(dir, rootDir, col) {
    var cli = socket.request.connection.remoteAddress.substr(7);
    io.sockets.emit('printTR', { dir, rootDir, col, cli });
    console.log('sendDir ' + rootDir);
  } //senddir

  function copyVar(data) {
    return data;
  }
  function readDataFile() {
    oldDirTR = copyVar(rootDirTR);
    oldDir133 = copyVar(rootDir133);
    oldDir150 = copyVar(rootDir150);
    oldDir200 = copyVar(rootDir200);
    try {
      const getData = () => {
        if (fs.existsSync('//192.168.0.60/!out/Trafaret/'))
          rootDirTR = fs.readdirSync('//192.168.0.60/!out/Trafaret/', 'utf8', 'true');
        if (fs.existsSync('//192.168.0.60/!out/133/'))
          rootDir133 = fs.readdirSync('//192.168.0.60/!out/133/', 'utf8', 'true');
        if (fs.existsSync('//192.168.0.60/!out/150/'))
          rootDir150 = fs.readdirSync('//192.168.0.60/!out/150/', 'utf8', 'true');
        if (fs.existsSync('//192.168.0.60/!out/Offset_200/'))
          rootDir200 = fs.readdirSync('//192.168.0.60/!out/Offset_200/', 'utf8', 'true');
      };

      getData();
    } catch (err) {
      console.log(err);
      if (err) {
        console.log('Directory not found!');
      }
    }
  }

  function sendAll() {
    readDataFile();

    if (rootDirTR) sendDir(rootDirTR, 'rootDirTR', rootDirTR.length);
    if (rootDir133) sendDir(rootDir133, 'rootDir133', rootDir133.length);
    if (rootDir150) sendDir(rootDir150, 'rootDir150', rootDir150.length);
    if (rootDir200) sendDir(rootDir200, 'rootDir200', rootDir200.length);
  }

  sendAll();

  setInterval(() => {
    readDataFile();
    if (oldDirTR) {
      if (oldDirTR.toString() != rootDirTR.toString()) {
        console.log('Trafaret update !!!');
        sendDir(rootDirTR, 'rootDirTR', rootDirTR.length);
      }
    } else {
      console.log('Not found directory');
    }

    if (rootDir133) {
      if (oldDir133.toString() != rootDir133.toString()) {
        console.log('Flex133 update !!!');
        sendDir(rootDir133, 'rootDir133', rootDir133.length);
      }
    } else {
      console.log('Not found directory');
    }
    if (oldDir150) {
      if (oldDir150.toString() != rootDir150.toString()) {
        console.log('Flex150 update !!!');
        sendDir(rootDir150, 'rootDir150', rootDir150.length);
      }
    } else {
      console.log('Not found directory');
    }

    if (oldDir200) {
      if (oldDir200.toString() != rootDir200.toString()) {
        console.log('Offset200 update !!!');
        sendDir(rootDir200, 'rootDir200', rootDir200.length);
      }
    } else {
      console.log('Not found directory');
    }
  }, 10000);

  //
});

console.log('RIP-WIN socket.io v1.0.0 (websocket)\nServer started on port ' + server_port);
