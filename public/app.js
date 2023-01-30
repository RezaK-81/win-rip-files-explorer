const status = document.getElementById('status');

var socket = io.connect();

function setStatus(value) {
  status.innerHTML = value;
  if (value == 'OFFLINE') {
    status.classList.remove('togreen');
    status.classList.add('tored');
  } else {
    status.classList.remove('tored');
    status.classList.add('togreen');
  }
}

var difcountTR = 0; //количество всех файлов в списке фотовывода
var difcount133 = 0;
var difcount150 = 0;
var difcount200 = 0;

socket.on('printTR', (data) => {
  console.log('Updated ' + Date().substr(3, 21) + ' (' + data.cli + ')');

  var tempstr = '';
  for (var i = 0; i < data.dir.length; i++) {
    tempstr = tempstr + data.dir[i] + '<br>';
  }

  if (!tempstr) {
    tempstr = 'Пусто';
  }

  var colTR = document.getElementById('colTR');
  var col133 = document.getElementById('col133');
  var col150 = document.getElementById('col120');
  var col200 = document.getElementById('col200');

  if (data.rootDir == 'rootDirTR') {
    var Dir = document.getElementById('rootDirTR');
    var col = document.getElementById('colTR');
    difcountTR = data.dir.length;
  }
  if (data.rootDir == 'rootDir133') {
    var Dir = document.getElementById('rootDir133');
    var col = document.getElementById('col133');
    difcount133 = data.dir.length;
  }
  if (data.rootDir == 'rootDir150') {
    var Dir = document.getElementById('rootDir150');
    var col = document.getElementById('col150');
    difcount150 = data.dir.length;
  }
  if (data.rootDir == 'rootDir200') {
    var Dir = document.getElementById('rootDir200');
    var col = document.getElementById('col200');
    difcount200 = data.dir.length;
  }

  difcount = difcountTR + difcount133 + difcount150 + difcount200;
  window.document.title = '(' + difcount + ') WIN-RIP v1.0';

  var mydiv = document.createElement('div');
  Dir.innerHTML = null;
  if (tempstr != 'Пусто') {
    mydiv.classList.add('text-left');
  }
  mydiv.innerHTML = tempstr;
  col.innerHTML = '(' + data.col + ')';
  Dir.append(mydiv);
});

socket.on('clients', (data) => {
  var clienstdiv = document.getElementById('clients');
  var tempclients = '';
  for (var i = 0; i < data.serverclients.length; i++) {
    tempclients = tempclients + data.serverclients[i] + '<br>';
  }
  var mydivclients = document.createElement('div');
  clienstdiv.innerHTML = null;
  mydivclients.innerHTML = tempclients;
  mydivclients.classList.add('clientsList');
  clienstdiv.append(mydivclients);
}); 

socket.on('connect', () => setStatus('ONLINE'));
socket.on('disconnect', () => setStatus('OFFLINE'));
