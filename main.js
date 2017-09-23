var app = require('http').createServer(handler)
var io = require('socket.io')(app)

var port = 8080
app.listen(port)
console.log('> Listening on port ' + port)

function handler (req, res) {
  res.writeHead(404)
  res.end('404 - No main page on RPi client.')
}

// socket.emit('news', { hello: 'world' })
io.on('connection', function (socket) {
  // initialazation section
  var connType
  socket.on('connType', function (data) {
    connType = data
    if (data === 'rpi-client') {
      console.log('> RPi connected')
    } else if (data === 'web-client') {
      console.log('> Web client connected')
    }
  })

  // RPi client section
  socket.on('serial-recv', function (data) {
    console.log('> Data recv:')
    console.log(data)
  })
  function sendData (data) {
    socket.emit('serial-write', data)
  }
  sendData('H1\r')
})
