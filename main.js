// initiate web server
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// include DAQControl
const { DAQControl } = require('./daq-interface.js')

var port = 8080
server.listen(port)
console.log('> Listening on port ' + port)

app.use(express.static('public'))
app.use(express.static('bower_components'))

// socket.emit('news', { hello: 'world' })
io.on('connection', (socket) => {
  // initialazation section
  var connType
  socket.on('connType', (data) => {
    connType = data
    if (data === 'rpi-client') {
      console.log('> RPi connected')
    } else if (data === 'web-client') {
      console.log('> Web client connected')
    }
  })

  // RPi client section
  socket.on('serial-recv', (data) => {
    console.log('> Data recv')
    io.emit('web-serial-recv', data)
  })
  function sendData (data) {
    io.emit('serial-write', data)
  }

  // Web client section
  socket.on('web-serial-send', sendData)
})
