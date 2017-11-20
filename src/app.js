var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var os = require('os');
var pty = require('node-pty');
var monitor = require('node-docker-monitor');

var terminals = {},
    logs = {};

var dockerStatus = {new: {}, up: {}, down: {}};

app.use('/build', express.static(__dirname + '/../build'));

app.use('/css', express.static(__dirname + '/css'));

app.use('/fonts', express.static(__dirname + '/fonts'));

app.use('/js', express.static(__dirname + '/js'));

app.use('/img', express.static(__dirname + '/img'));

app.use('/templates', express.static(__dirname + '/templates'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/container_classes', function(req, res){
  res.sendFile(__dirname + '/json/container_classes.json');
});

app.get('/api/project_folders', function(req, res){
  res.sendFile(__dirname + '/json/project_folders.json');
});

app.post('/terminals', function (req, res) {
  var cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: 'xterm-color',
        cols: cols || 70,
        rows: rows || 55,
        cwd: process.env.PWD,
        env: process.env
      });

    monitor({
      onContainerUp: function(container) {
          if (dockerStatus['up'][container.Id] == null){
            dockerStatus['new'][container.Id] = container;
          }
          console.log('Container up: ', container)
      },

      onContainerDown: function(container) {
          if (dockerStatus['up'][container.Id] == null) {
              delete dockerStatus['up'][container.Id];
              dockerStatus['down'][container.Id] = container;
          }
          console.log('Container down: ', container)
      }
    });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function(data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

app.post('/docker', function (req, res) {
    res.send(dockerStatus);
    dockerStatus['up'] = dockerStatus['new'];
    dockerStatus['new'] = {};
    dockerStatus['down'] = {};
    res.end();
});

app.post('/terminals/:pid/size', function (req, res) {
  var pid = parseInt(req.params.pid),
      cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = terminals[pid];

  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});

app.ws('/terminals/:pid', function (ws, req) {
  var term = terminals[parseInt(req.params.pid)];
  console.log('Connected to terminal ' + term.pid);
  ws.send(logs[term.pid]);

  term.on('data', function(data) {
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function(msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

var port = process.env.PORT || 3000,
    host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';

console.log('App listening to http://' + host + ':' + port);
app.listen(port, host);
